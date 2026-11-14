package th.srimongkol99.app;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.util.Base64;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Keeps sending the phone's GPS position to the shared database while the driver
 * is on duty (also when the screen is off), and checks for "ring" / "announce"
 * commands from the admin when the app is in the background.
 */
public class TrackService extends Service implements LocationListener {

    static final String PREFS = "sm99";
    static volatile boolean running = false;

    private static final String CH_TRACK = "track";
    private static final String CH_CMD = "cmd_alarm";
    private static final int NOTIF_TRACK = 1;
    private static final int NOTIF_CMD = 2;

    private static final long MOVE_METERS = 80;
    private static final long STOP_AFTER_MS = 3 * 60_000L;
    private static final long HEARTBEAT_MS = 5 * 60_000L;
    private static final long POLL_MS = 30_000L;

    private static Ringtone ring;
    private static final Handler main = new Handler(Looper.getMainLooper());

    private SharedPreferences sp;
    private LocationManager lm;
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private PowerManager.WakeLock wake;

    private String truckId, apiKey, projectId, refreshToken, idToken;
    private long idExp = 0;

    private Location anchor;
    private Location last;
    private long lastMoveAt = 0, lastWrite = 0, lastGpsFix = 0;
    private boolean moving = false;

    private TextToSpeech tts;
    private boolean ttsReady = false;
    private MediaPlayer player;

    private final Runnable poll = new Runnable() {
        @Override
        public void run() {
            if (!MainActivity.foreground) io.execute(TrackService.this::checkCommand);
            long now = System.currentTimeMillis();
            if (last != null && now - lastWrite > HEARTBEAT_MS) {
                if (moving && now - lastMoveAt > STOP_AFTER_MS) moving = false;
                write();
            }
            main.postDelayed(this, POLL_MS);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        sp = getSharedPreferences(PREFS, MODE_PRIVATE);
        lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        makeChannels();
        tts = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            if (ttsReady) tts.setLanguage(new Locale("th", "TH"));
        });
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "sm99:track");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (!loadConfig()) {
            stopSelf();
            return START_NOT_STICKY;
        }
        try {
            Notification n = trackNotification();
            if (Build.VERSION.SDK_INT >= 29) {
                startForeground(NOTIF_TRACK, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            } else {
                startForeground(NOTIF_TRACK, n);
            }
        } catch (Exception e) {
            stopSelf();
            return START_NOT_STICKY;
        }
        running = true;
        if (!wake.isHeld()) wake.acquire();
        startLocation();
        main.removeCallbacks(poll);
        main.postDelayed(poll, 5_000L);
        return START_STICKY;
    }

    private boolean loadConfig() {
        try {
            String raw = sp.getString("cfg", "");
            if (raw.isEmpty()) return false;
            JSONObject c = new JSONObject(raw);
            String newTruck = c.optString("truckId");
            if (!newTruck.equals(truckId)) {
                anchor = null;
                moving = false;
            }
            truckId = newTruck;
            apiKey = c.optString("apiKey");
            projectId = c.optString("projectId");
            String given = c.optString("refreshToken");
            String stored = sp.getString("refreshToken", "");
            if (!given.equals(sp.getString("lastGiven", ""))) {
                // a fresh sign-in from the app: use its token
                refreshToken = given;
                idToken = null;
                sp.edit().putString("refreshToken", given).putString("lastGiven", given).apply();
            } else {
                refreshToken = stored.isEmpty() ? given : stored;
            }
            return !truckId.isEmpty() && !apiKey.isEmpty() && !projectId.isEmpty() && !refreshToken.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    private void startLocation() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) return;
        try {
            lm.removeUpdates(this);
        } catch (Exception ignored) {
        }
        try {
            lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 20_000L, 0f, this, Looper.getMainLooper());
        } catch (Exception ignored) {
        }
        try {
            if (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 30_000L, 0f, this, Looper.getMainLooper());
            }
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onLocationChanged(Location l) {
        long now = System.currentTimeMillis();
        boolean isGps = LocationManager.GPS_PROVIDER.equals(l.getProvider());
        if (isGps) lastGpsFix = now;
        else if (now - lastGpsFix < 90_000L) return; // prefer GPS when we have it
        last = l;
        try {
            JSONObject j = new JSONObject();
            j.put("lat", l.getLatitude());
            j.put("lng", l.getLongitude());
            j.put("acc", l.getAccuracy());
            j.put("at", now);
            sp.edit().putString("lastLoc", j.toString()).apply();
        } catch (Exception ignored) {
        }
        if (anchor == null) {
            anchor = l;
            lastMoveAt = now;
            write();
            return;
        }
        float d = anchor.distanceTo(l);
        if (d >= MOVE_METERS && l.getAccuracy() < 150) {
            anchor = l;
            lastMoveAt = now;
            moving = true;
            write();
        } else if (moving && now - lastMoveAt > STOP_AFTER_MS) {
            moving = false;
            write();
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public void onProviderEnabled(String provider) {
    }

    @Override
    public void onProviderDisabled(String provider) {
    }

    private void write() {
        if (last == null) return;
        lastWrite = System.currentTimeMillis();
        final double lat = last.getLatitude(), lng = last.getLongitude();
        final float acc = last.getAccuracy();
        final float speed = last.hasSpeed() ? last.getSpeed() * 3.6f : 0f;
        final boolean mv = moving;
        final long moveAt = lastMoveAt, at = lastWrite;
        io.execute(() -> {
            try {
                JSONObject f = new JSONObject();
                f.put("lat", dbl(lat));
                f.put("lng", dbl(lng));
                f.put("acc", dbl(acc));
                f.put("speed", dbl(speed));
                f.put("moving", new JSONObject().put("booleanValue", mv));
                f.put("lastMoveAt", integer(moveAt));
                f.put("gpsAt", integer(at));
                f.put("gpsSrc", new JSONObject().put("stringValue", "app"));
                StringBuilder q = new StringBuilder("?currentDocument.exists=true");
                String[] keys = {"lat", "lng", "acc", "speed", "moving", "lastMoveAt", "gpsAt", "gpsSrc"};
                for (String k : keys) q.append("&updateMask.fieldPaths=").append(k);
                String url = docUrl("trucks/" + truckId) + q;
                http("PATCH", url, new JSONObject().put("fields", f).toString(), true);
            } catch (Exception ignored) {
            }
        });
    }

    private static JSONObject dbl(double v) throws Exception {
        return new JSONObject().put("doubleValue", v);
    }

    private static JSONObject integer(long v) throws Exception {
        return new JSONObject().put("integerValue", String.valueOf(v));
    }

    private String docUrl(String path) {
        return "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/(default)/documents/" + path;
    }

    /* ---------- admin commands while the app is in the background ---------- */

    private void checkCommand() {
        try {
            String res = http("GET", docUrl("commands/" + truckId), null, true);
            if (res == null) return;
            JSONObject f = new JSONObject(res).optJSONObject("fields");
            if (f == null) return;
            String nonce = str(f, "nonce");
            long at = num(f, "at");
            if (nonce.isEmpty() || nonce.equals(sp.getString("lastNonce", ""))) return;
            if (System.currentTimeMillis() - at > 10 * 60_000L) return;
            sp.edit().putString("lastNonce", nonce).apply();
            final String type = str(f, "type");
            final String text = str(f, "text");
            final String audio = str(f, "audio");
            main.post(() -> handleCommand(type, text, audio));
        } catch (Exception ignored) {
        }
    }

    private static String str(JSONObject f, String k) {
        JSONObject v = f.optJSONObject(k);
        return v == null ? "" : v.optString("stringValue", "");
    }

    private static long num(JSONObject f, String k) {
        JSONObject v = f.optJSONObject(k);
        if (v == null) return 0;
        if (v.has("integerValue")) return Long.parseLong(v.optString("integerValue", "0"));
        return (long) v.optDouble("doubleValue", 0);
    }

    private void handleCommand(String type, String text, String audio) {
        boolean isRing = "ring".equals(type);
        String title = isRing ? "แอดมินกดกริ่งเรียก" : "ไมค์จากแอดมิน (กำลังประกาศ)";
        String body = isRing ? "กรุณาติดต่อกลับศูนย์ควบคุม" : (text.isEmpty() ? "ข้อความเสียงจากแอดมิน" : text);
        showCommandNotification(title, body);
        vibrate(isRing);
        if (isRing) {
            startRing(this);
        } else if (!audio.isEmpty()) {
            playAudio(audio);
        } else if (!text.isEmpty() && ttsReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ann");
        }
    }

    private void playAudio(String dataUrl) {
        try {
            int comma = dataUrl.indexOf(',');
            byte[] bytes = Base64.decode(comma >= 0 ? dataUrl.substring(comma + 1) : dataUrl, Base64.DEFAULT);
            String ext = dataUrl.contains("mp4") ? ".m4a" : (dataUrl.contains("ogg") ? ".ogg" : ".webm");
            File f = new File(getCacheDir(), "announce" + ext);
            try (FileOutputStream out = new FileOutputStream(f)) {
                out.write(bytes);
            }
            if (player != null) player.release();
            player = new MediaPlayer();
            player.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_EVENT)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());
            player.setDataSource(f.getAbsolutePath());
            player.setOnCompletionListener(MediaPlayer::release);
            player.prepare();
            player.start();
        } catch (Exception ignored) {
        }
    }

    private void vibrate(boolean strong) {
        try {
            Vibrator v = (Vibrator) getSystemService(VIBRATOR_SERVICE);
            long[] p = strong ? new long[]{0, 500, 250, 500, 250, 500, 250, 500} : new long[]{0, 250};
            v.vibrate(VibrationEffect.createWaveform(p, -1));
        } catch (Exception ignored) {
        }
    }

    static void startRing(Context ctx) {
        try {
            stopRingSound();
            Uri u = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (u == null) u = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            ring = RingtoneManager.getRingtone(ctx.getApplicationContext(), u);
            if (ring != null) {
                ring.setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM).build());
                ring.play();
                main.postDelayed(TrackService::stopRingSound, 30_000L);
            }
        } catch (Exception ignored) {
        }
    }

    private static void stopRingSound() {
        try {
            if (ring != null && ring.isPlaying()) ring.stop();
        } catch (Exception ignored) {
        }
    }

    static void stopRing(Context ctx) {
        stopRingSound();
        try {
            NotificationManager nm = (NotificationManager) ctx.getSystemService(NOTIFICATION_SERVICE);
            nm.cancel(NOTIF_CMD);
        } catch (Exception ignored) {
        }
    }

    /* ---------- notifications ---------- */

    private void makeChannels() {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        NotificationChannel t = new NotificationChannel(CH_TRACK, "ติดตาม GPS", NotificationManager.IMPORTANCE_LOW);
        t.setDescription("แสดงขณะแอปส่งตำแหน่งรถให้ศูนย์ควบคุม");
        nm.createNotificationChannel(t);
        NotificationChannel c = new NotificationChannel(CH_CMD, "กริ่งและเสียงจากแอดมิน", NotificationManager.IMPORTANCE_HIGH);
        c.setDescription("แจ้งเตือนเมื่อแอดมินกดกริ่งหรือประกาศเสียง");
        c.enableVibration(true);
        c.setBypassDnd(true);
        c.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        nm.createNotificationChannel(c);
    }

    private PendingIntent openApp() {
        Intent i = new Intent(this, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(this, 0, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private Notification trackNotification() {
        return new NotificationCompat.Builder(this, CH_TRACK)
                .setSmallIcon(R.drawable.ic_stat)
                .setContentTitle("ศรีมงคล 99 · GPS กำลังติดตาม")
                .setContentText("กำลังส่งตำแหน่งรถให้ศูนย์ควบคุม")
                .setOngoing(true)
                .setColor(0xFF123778)
                .setContentIntent(openApp())
                .build();
    }

    private void showCommandNotification(String title, String body) {
        try {
            if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(this,
                    Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return;
            Notification n = new NotificationCompat.Builder(this, CH_CMD)
                    .setSmallIcon(R.drawable.ic_stat)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setColor(0xFFEF7A16)
                    .setAutoCancel(true)
                    .setContentIntent(openApp())
                    .setFullScreenIntent(openApp(), true)
                    .build();
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            nm.notify(NOTIF_CMD, n);
        } catch (Exception ignored) {
        }
    }

    /* ---------- network ---------- */

    private String token() throws Exception {
        if (idToken != null && System.currentTimeMillis() < idExp - 60_000L) return idToken;
        String body = "grant_type=refresh_token&refresh_token=" + URLEncoder.encode(refreshToken, "UTF-8");
        String res = http("POST", "https://securetoken.googleapis.com/v1/token?key=" + apiKey, body, false);
        if (res == null) throw new Exception("token");
        JSONObject j = new JSONObject(res);
        idToken = j.getString("id_token");
        idExp = System.currentTimeMillis() + Long.parseLong(j.optString("expires_in", "3600")) * 1000L;
        String rt = j.optString("refresh_token", "");
        if (!rt.isEmpty()) {
            refreshToken = rt;
            sp.edit().putString("refreshToken", rt).apply();
        }
        return idToken;
    }

    private String http(String method, String url, String body, boolean auth) {
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) new URL(url).openConnection();
            c.setConnectTimeout(15_000);
            c.setReadTimeout(20_000);
            if ("PATCH".equals(method)) {
                c.setRequestMethod("POST");
                c.setRequestProperty("X-HTTP-Method-Override", "PATCH");
            } else {
                c.setRequestMethod(method);
            }
            if (auth) c.setRequestProperty("Authorization", "Bearer " + token());
            if (body != null) {
                c.setDoOutput(true);
                c.setRequestProperty("Content-Type", auth ? "application/json; charset=utf-8"
                        : "application/x-www-form-urlencoded");
                try (OutputStream os = c.getOutputStream()) {
                    os.write(body.getBytes(StandardCharsets.UTF_8));
                }
            }
            int code = c.getResponseCode();
            if (code == 401 && auth) idToken = null;
            InputStream in = code < 400 ? c.getInputStream() : c.getErrorStream();
            if (in == null) return null;
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            in.close();
            return code < 400 ? bo.toString("UTF-8") : null;
        } catch (Exception e) {
            return null;
        } finally {
            if (c != null) c.disconnect();
        }
    }

    @Override
    public void onDestroy() {
        running = false;
        main.removeCallbacks(poll);
        try {
            lm.removeUpdates(this);
        } catch (Exception ignored) {
        }
        if (wake != null && wake.isHeld()) wake.release();
        if (tts != null) tts.shutdown();
        if (player != null) player.release();
        io.shutdown();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

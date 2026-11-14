package th.srimongkol99.app;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.app.NotificationCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.pm.PackageInfoCompat;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/** Checks GitHub for a newer ศรีมงคล 99 build, downloads it and opens the Android installer. */
final class Updater {
    private Updater() {
    }

    static final String BASE = "https://github.com/mamaff9522-sketch/FriendTalk/releases/download/srimongkol99-apk/";
    static final String VERSION_URL = BASE + "version.json";
    static final String APK_URL = BASE + "srimongkol99.apk";
    private static final int NOTIF_UPDATE = 3;

    static long myVersion(Context c) {
        try {
            PackageInfo pi = c.getPackageManager().getPackageInfo(c.getPackageName(), 0);
            return PackageInfoCompat.getLongVersionCode(pi);
        } catch (Exception e) {
            return 0;
        }
    }

    static String myVersionName(Context c) {
        try {
            return c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "";
        }
    }

    /** Returns {"versionCode":..,"versionName":..,"notes":..,"newer":true/false} or null. Call off the main thread. */
    static JSONObject check(Context c) {
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) new URL(VERSION_URL + "?t=" + System.currentTimeMillis()).openConnection();
            con.setInstanceFollowRedirects(true);
            con.setConnectTimeout(15_000);
            con.setReadTimeout(20_000);
            con.setUseCaches(false);
            if (con.getResponseCode() != 200) return null;
            InputStream in = con.getInputStream();
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            in.close();
            JSONObject j = new JSONObject(bo.toString("UTF-8"));
            j.put("newer", j.optLong("versionCode", 0) > myVersion(c));
            j.put("current", myVersionName(c));
            return j;
        } catch (Exception e) {
            return null;
        } finally {
            if (con != null) con.disconnect();
        }
    }

    interface Progress {
        void onProgress(int percent);
    }

    /** Downloads the newest APK into the cache. Call off the main thread. */
    static File download(Context c, Progress p) throws Exception {
        File dir = new File(c.getCacheDir(), "updates");
        //noinspection ResultOfMethodCallIgnored
        dir.mkdirs();
        File out = new File(dir, "srimongkol99.apk");
        File tmp = new File(dir, "download.tmp");
        HttpURLConnection con = (HttpURLConnection) new URL(APK_URL + "?t=" + System.currentTimeMillis()).openConnection();
        con.setInstanceFollowRedirects(true);
        con.setConnectTimeout(20_000);
        con.setReadTimeout(60_000);
        try {
            if (con.getResponseCode() != 200) throw new Exception("http " + con.getResponseCode());
            long total = con.getContentLengthLong();
            try (InputStream in = con.getInputStream(); OutputStream os = new FileOutputStream(tmp)) {
                byte[] buf = new byte[16384];
                long done = 0;
                int n, last = -1;
                while ((n = in.read(buf)) > 0) {
                    os.write(buf, 0, n);
                    done += n;
                    if (total > 0) {
                        int pc = (int) (done * 100 / total);
                        if (pc != last) {
                            last = pc;
                            p.onProgress(pc);
                        }
                    }
                }
            }
        } finally {
            con.disconnect();
        }
        if (out.exists()) //noinspection ResultOfMethodCallIgnored
            out.delete();
        if (!tmp.renameTo(out)) throw new Exception("rename");
        return out;
    }

    /** True when Android lets this app open the installer (asked once per phone). */
    static boolean canInstall(Context c) {
        return Build.VERSION.SDK_INT < 26 || c.getPackageManager().canRequestPackageInstalls();
    }

    static void openInstallPermission(Activity a) {
        try {
            Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + a.getPackageName()));
            a.startActivity(i);
        } catch (Exception ignored) {
        }
    }

    static boolean install(Activity a, File apk) {
        try {
            Uri u = FileProvider.getUriForFile(a, a.getPackageName() + ".files", apk);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(u, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            a.startActivity(i);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** Notification (from the GPS service) telling the driver a new version is ready. */
    static void notifyUpdate(Context c, JSONObject info) {
        try {
            Intent open = new Intent(c, MainActivity.class);
            open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pi = PendingIntent.getActivity(c, 3, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            NotificationCompat.Builder b = new NotificationCompat.Builder(c, "update")
                    .setSmallIcon(R.drawable.ic_stat)
                    .setContentTitle("ศรีมงคล 99 มีเวอร์ชันใหม่ " + info.optString("versionName"))
                    .setContentText("แตะเพื่อเปิดแอปแล้วกดอัปเดต")
                    .setColor(0xFF123778)
                    .setAutoCancel(true)
                    .setContentIntent(pi);
            ((NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE)).notify(NOTIF_UPDATE, b.build());
        } catch (Exception ignored) {
        }
    }
}

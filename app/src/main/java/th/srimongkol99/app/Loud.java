package th.srimongkol99.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Base64;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Locale;

/**
 * Plays the admin's ring / voice on the driver phone as loud as the phone can go:
 * it uses the ALARM sound channel (still heard when the phone is on silent),
 * turns that channel to maximum while playing, then puts the volume back.
 */
final class Loud {
    private Loud() {
    }

    private static final Handler main = new Handler(Looper.getMainLooper());
    private static MediaPlayer player;
    private static Integer savedVolume;
    private static TextToSpeech tts;
    private static boolean ttsReady = false;
    private static String pendingSpeech;

    private static final AudioAttributes ALARM_SOUND = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();
    private static final AudioAttributes ALARM_SPEECH = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();

    static synchronized boolean isPlaying() {
        return player != null;
    }

    /** Siren for the admin's "ring" button; loops until stop() or {@code ms} has passed. */
    static synchronized void ring(Context ctx, long ms) {
        Context c = ctx.getApplicationContext();
        stopSound(c);
        try {
            File f = siren(c);
            boost(c);
            player = new MediaPlayer();
            player.setAudioAttributes(ALARM_SOUND);
            player.setDataSource(f.getAbsolutePath());
            player.setLooping(true);
            player.setVolume(1f, 1f);
            player.prepare();
            player.start();
            main.removeCallbacksAndMessages(null);
            main.postDelayed(() -> stop(c), ms);
        } catch (Exception e) {
            stop(c);
        }
    }

    /** Admin's recorded voice (a data: URL) played at full volume. */
    static synchronized void playClip(Context ctx, String dataUrl) {
        Context c = ctx.getApplicationContext();
        stopSound(c);
        try {
            int comma = dataUrl.indexOf(',');
            byte[] bytes = Base64.decode(comma >= 0 ? dataUrl.substring(comma + 1) : dataUrl, Base64.DEFAULT);
            String ext = dataUrl.contains("mp4") ? ".m4a" : (dataUrl.contains("ogg") ? ".ogg" : ".webm");
            File f = new File(c.getCacheDir(), "announce" + ext);
            try (FileOutputStream out = new FileOutputStream(f)) {
                out.write(bytes);
            }
            boost(c);
            player = new MediaPlayer();
            player.setAudioAttributes(ALARM_SPEECH);
            player.setDataSource(f.getAbsolutePath());
            player.setVolume(1f, 1f);
            player.setOnCompletionListener(mp -> main.postDelayed(() -> stop(c), 300));
            player.prepare();
            player.start();
            main.removeCallbacksAndMessages(null);
            main.postDelayed(() -> stop(c), 60_000L);
        } catch (Exception e) {
            stop(c);
        }
    }

    /** Read a typed message aloud (Thai) at full volume. */
    static synchronized void speak(Context ctx, String text) {
        final Context c = ctx.getApplicationContext();
        if (text == null || text.trim().isEmpty()) return;
        stopSound(c);
        if (tts == null) {
            pendingSpeech = text;
            tts = new TextToSpeech(c, st -> {
                synchronized (Loud.class) {
                    ttsReady = st == TextToSpeech.SUCCESS;
                    if (!ttsReady) return;
                    tts.setLanguage(new Locale("th", "TH"));
                    tts.setAudioAttributes(ALARM_SPEECH);
                    tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override
                        public void onStart(String id) {
                        }

                        @Override
                        public void onDone(String id) {
                            main.postDelayed(() -> restoreIfIdle(c), 300);
                        }

                        @Override
                        public void onError(String id) {
                            main.post(() -> restoreIfIdle(c));
                        }
                    });
                    if (pendingSpeech != null) {
                        String p = pendingSpeech;
                        pendingSpeech = null;
                        say(c, p);
                    }
                }
            });
            return;
        }
        if (!ttsReady) {
            pendingSpeech = text;
            return;
        }
        say(c, text);
    }

    private static void say(Context c, String text) {
        boost(c);
        Bundle b = new Bundle();
        b.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, AudioManager.STREAM_ALARM);
        b.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1f);
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, b, "ann" + System.currentTimeMillis());
    }

    static synchronized void stop(Context ctx) {
        Context c = ctx.getApplicationContext();
        stopSound(c);
        try {
            if (tts != null) tts.stop();
        } catch (Exception ignored) {
        }
        restore(c);
    }

    private static void stopSound(Context c) {
        main.removeCallbacksAndMessages(null);
        if (player != null) {
            try {
                player.stop();
            } catch (Exception ignored) {
            }
            try {
                player.release();
            } catch (Exception ignored) {
            }
            player = null;
        }
    }

    private static synchronized void restoreIfIdle(Context c) {
        if (player == null) restore(c);
    }

    /** Turn the alarm channel to maximum, remembering the driver's own setting. */
    private static void boost(Context c) {
        try {
            AudioManager am = (AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
            if (savedVolume == null) savedVolume = am.getStreamVolume(AudioManager.STREAM_ALARM);
            am.setStreamVolume(AudioManager.STREAM_ALARM, am.getStreamMaxVolume(AudioManager.STREAM_ALARM), 0);
        } catch (Exception ignored) {
            // some phones refuse volume changes while Do Not Disturb is on; the alarm channel still plays
        }
    }

    private static void restore(Context c) {
        if (savedVolume == null) return;
        try {
            AudioManager am = (AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
            am.setStreamVolume(AudioManager.STREAM_ALARM, savedVolume, 0);
        } catch (Exception ignored) {
        }
        savedVolume = null;
    }

    /** A loud two-tone siren written once to the cache as a WAV file. */
    private static File siren(Context c) throws Exception {
        File f = new File(c.getCacheDir(), "siren_v1.wav");
        if (f.exists() && f.length() > 1000) return f;
        final int rate = 22050;
        final double seconds = 1.6;
        final int n = (int) (rate * seconds);
        byte[] pcm = new byte[n * 2];
        for (int i = 0; i < n; i++) {
            double t = (double) i / rate;
            double slot = (t % 0.4);
            double freq = slot < 0.2 ? 1400 : 1000;          // hi-lo pattern
            boolean gap = (t % 0.2) > 0.17;                  // short gaps make it more urgent
            double phase = 2 * Math.PI * freq * t;
            // square-ish wave (sum of odd harmonics) is much louder to the ear than a sine
            double v = gap ? 0 : (Math.sin(phase) + Math.sin(3 * phase) / 3 + Math.sin(5 * phase) / 5) * 0.95;
            if (v > 1) v = 1;
            if (v < -1) v = -1;
            short s = (short) (v * 32767);
            pcm[2 * i] = (byte) (s & 0xff);
            pcm[2 * i + 1] = (byte) ((s >> 8) & 0xff);
        }
        try (FileOutputStream out = new FileOutputStream(f)) {
            out.write(wavHeader(pcm.length, rate));
            out.write(pcm);
        }
        return f;
    }

    private static byte[] wavHeader(int dataLen, int rate) {
        int byteRate = rate * 2;
        byte[] h = new byte[44];
        put(h, 0, "RIFF");
        le32(h, 4, 36 + dataLen);
        put(h, 8, "WAVE");
        put(h, 12, "fmt ");
        le32(h, 16, 16);
        le16(h, 20, 1);      // PCM
        le16(h, 22, 1);      // mono
        le32(h, 24, rate);
        le32(h, 28, byteRate);
        le16(h, 32, 2);
        le16(h, 34, 16);
        put(h, 36, "data");
        le32(h, 40, dataLen);
        return h;
    }

    private static void put(byte[] b, int o, String s) {
        for (int i = 0; i < 4; i++) b[o + i] = (byte) s.charAt(i);
    }

    private static void le32(byte[] b, int o, int v) {
        b[o] = (byte) v;
        b[o + 1] = (byte) (v >> 8);
        b[o + 2] = (byte) (v >> 16);
        b[o + 3] = (byte) (v >> 24);
    }

    private static void le16(byte[] b, int o, int v) {
        b[o] = (byte) v;
        b[o + 1] = (byte) (v >> 8);
    }
}

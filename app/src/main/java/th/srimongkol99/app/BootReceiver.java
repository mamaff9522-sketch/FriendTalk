package th.srimongkol99.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import androidx.core.content.ContextCompat;

/** Restarts GPS tracking after the phone reboots or the app is updated, if a driver is logged in. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        String cfg = c.getSharedPreferences(TrackService.PREFS, Context.MODE_PRIVATE).getString("cfg", "");
        if (cfg.isEmpty()) return;
        try {
            ContextCompat.startForegroundService(c, new Intent(c, TrackService.class));
        } catch (Exception ignored) {
            // Android may refuse a background start; tracking resumes when the driver opens the app
        }
    }
}

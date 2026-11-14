package th.srimongkol99.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MainActivity extends Activity {

    static volatile boolean foreground = false;

    private static final String HOST = "appassets.androidplatform.net";
    private static final int REQ_PERMS = 1;
    private static final int REQ_FILE = 2;
    private static final int REQ_MIC = 3;
    private static final int REQ_GEO = 4;

    private WebView web;
    private ValueCallback<Uri[]> fileCb;
    private Uri cameraUri;
    private PermissionRequest pendingMic;
    private GeolocationPermissions.Callback geoCb;
    private String geoOrigin;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFF123778);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setUserAgentString(s.getUserAgentString() + " Srimongkol99App/1");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                openExternal(u);
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (hasPerm(Manifest.permission.ACCESS_FINE_LOCATION)) {
                    callback.invoke(origin, true, false);
                } else {
                    geoCb = callback;
                    geoOrigin = origin;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_GEO);
                }
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    if (hasPerm(Manifest.permission.RECORD_AUDIO)) {
                        request.grant(request.getResources());
                    } else {
                        pendingMic = request;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = callback;
                cameraUri = null;
                Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
                pick.addCategory(Intent.CATEGORY_OPENABLE);
                pick.setType("image/*");
                List<Intent> extra = new ArrayList<>();
                try {
                    File dir = new File(getCacheDir(), "photos");
                    //noinspection ResultOfMethodCallIgnored
                    dir.mkdirs();
                    File f = new File(dir, "cam_" + System.currentTimeMillis() + ".jpg");
                    cameraUri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                    Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    cam.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                    cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    extra.add(cam);
                } catch (Exception e) {
                    cameraUri = null;
                }
                Intent chooser = Intent.createChooser(pick, "เลือกรูป หรือ ถ่ายรูป");
                chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, extra.toArray(new Intent[0]));
                try {
                    startActivityForResult(chooser, REQ_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl("https://" + HOST + "/assets/www/index.html");

        askStartupPerms();

        tts = new TextToSpeech(this, st -> {
            ttsReady = st == TextToSpeech.SUCCESS;
            if (ttsReady) tts.setLanguage(new Locale("th", "TH"));
        });
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }

    private void askStartupPerms() {
        List<String> want = new ArrayList<>();
        if (!hasPerm(Manifest.permission.ACCESS_FINE_LOCATION)) {
            want.add(Manifest.permission.ACCESS_FINE_LOCATION);
            want.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        }
        if (Build.VERSION.SDK_INT >= 33 && !hasPerm(Manifest.permission.POST_NOTIFICATIONS)) {
            want.add(Manifest.permission.POST_NOTIFICATIONS);
        }
        if (!want.isEmpty()) requestPermissions(want.toArray(new String[0]), REQ_PERMS);
    }

    private boolean hasPerm(String p) {
        return ContextCompat.checkSelfPermission(this, p) == PackageManager.PERMISSION_GRANTED;
    }

    private void openExternal(Uri u) {
        try {
            String scheme = u.getScheme() == null ? "" : u.getScheme();
            Intent i = scheme.equals("tel") ? new Intent(Intent.ACTION_DIAL, u) : new Intent(Intent.ACTION_VIEW, u);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        super.onRequestPermissionsResult(code, perms, results);
        boolean ok = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
        if (code == REQ_MIC && pendingMic != null) {
            if (ok) pendingMic.grant(pendingMic.getResources());
            else pendingMic.deny();
            pendingMic = null;
        } else if (code == REQ_GEO && geoCb != null) {
            geoCb.invoke(geoOrigin, ok, false);
            geoCb = null;
        }
        if (web != null) web.evaluateJavascript("window.onAndroidPerms&&window.onAndroidPerms()", null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_FILE || fileCb == null) return;
        Uri result = null;
        if (resultCode == RESULT_OK) {
            if (data != null && data.getData() != null) {
                result = data.getData();
            } else if (cameraUri != null) {
                result = cameraUri;
            }
        }
        fileCb.onReceiveValue(result == null ? null : new Uri[]{result});
        fileCb = null;
    }

    @Override
    protected void onResume() {
        super.onResume();
        foreground = true;
        TrackService.stopRing(this);
        if (web != null) web.evaluateJavascript("window.onAndroidResume&&window.onAndroidResume()", null);
    }

    @Override
    protected void onPause() {
        foreground = false;
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript("(window.onAndroidBack&&window.onAndroidBack())?'1':'0'", v -> {
            if (v == null || !v.contains("1")) moveTaskToBack(true);
        });
    }

    /** Methods the web page can call as window.Android.* */
    private class Bridge {
        @JavascriptInterface
        public boolean isApp() {
            return true;
        }

        @JavascriptInterface
        public void startTracking(String json) {
            getSharedPreferences(TrackService.PREFS, MODE_PRIVATE).edit().putString("cfg", json).apply();
            Intent i = new Intent(MainActivity.this, TrackService.class);
            try {
                ContextCompat.startForegroundService(MainActivity.this, i);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void stopTracking() {
            getSharedPreferences(TrackService.PREFS, MODE_PRIVATE).edit().remove("cfg").apply();
            stopService(new Intent(MainActivity.this, TrackService.class));
        }

        @JavascriptInterface
        public boolean isTracking() {
            return TrackService.running;
        }

        @JavascriptInterface
        public String getLastLocation() {
            return getSharedPreferences(TrackService.PREFS, MODE_PRIVATE).getString("lastLoc", "");
        }

        @JavascriptInterface
        public String lastNonce() {
            return getSharedPreferences(TrackService.PREFS, MODE_PRIVATE).getString("lastNonce", "");
        }

        @JavascriptInterface
        public void markSeen(String nonce) {
            SharedPreferences sp = getSharedPreferences(TrackService.PREFS, MODE_PRIVATE);
            sp.edit().putString("lastNonce", nonce == null ? "" : nonce).apply();
        }

        @JavascriptInterface
        public void speak(final String text) {
            runOnUiThread(() -> {
                if (tts != null && ttsReady) tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ann");
            });
        }

        @JavascriptInterface
        public void ring() {
            runOnUiThread(() -> TrackService.startRing(MainActivity.this));
        }

        @JavascriptInterface
        public void stopRing() {
            TrackService.stopRing(MainActivity.this);
        }

        @JavascriptInterface
        public boolean hasLocation() {
            return hasPerm(Manifest.permission.ACCESS_FINE_LOCATION);
        }

        @JavascriptInterface
        public void askLocation() {
            runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_PERMS));
        }

        @JavascriptInterface
        public void keepScreenOn(final boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }

        @JavascriptInterface
        public void openUrl(final String url) {
            runOnUiThread(() -> openExternal(Uri.parse(url)));
        }
    }
}

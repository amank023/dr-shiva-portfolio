package com.drshivaadmin;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * Native Android Java Module for Dr. Shiva Clinical Practice
 * Provides native hardware info, direct dial intent, and clinical alerts
 */
public class ClinicalNativeModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public ClinicalNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ClinicalNativeModule";
    }

    /**
     * Retrieve Android device diagnostic information
     */
    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            WritableMap map = Arguments.createMap();
            map.putString("brand", Build.BRAND);
            map.putString("manufacturer", Build.MANUFACTURER);
            map.putString("model", Build.MODEL);
            map.putString("device", Build.DEVICE);
            map.putString("osVersion", Build.VERSION.RELEASE);
            map.putInt("sdkInt", Build.VERSION.SDK_INT);
            map.putString("appEdition", "Dr. Shiva Clinical Care Admin Native");
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("DEVICE_INFO_ERROR", e.getMessage());
        }
    }

    /**
     * Display a native Android toast notification
     */
    @ReactMethod
    public void showToast(String message) {
        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(reactContext, message, Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    /**
     * Trigger native telephone dialer intent for patient consultation
     */
    @ReactMethod
    public void directDial(String phoneNumber) {
        try {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:" + phoneNumber));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(reactContext, "Could not open dialer: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
}

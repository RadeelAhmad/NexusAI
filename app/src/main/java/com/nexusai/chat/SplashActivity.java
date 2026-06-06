package com.nexusai.chat;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(() -> {
            // Check if API key is already saved
            SharedPreferences prefs = getSharedPreferences("NexusAI", MODE_PRIVATE);
            String apiKey = prefs.getString("gemini_api_key", "");

            if (!apiKey.isEmpty()) {
                startActivity(new Intent(this, LoginActivity.class));
            } else {
                startActivity(new Intent(this, LoginActivity.class));
                // API key already hardcoded, go straight to login
            }
            finish();
        }, 1800);
    }
}

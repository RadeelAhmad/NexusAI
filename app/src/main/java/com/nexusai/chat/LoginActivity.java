package com.nexusai.chat;

import android.content.Intent;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;

public class LoginActivity extends AppCompatActivity {

    // ── Hardcoded credentials ──
    private static final String CORRECT_USERNAME = "admin";
    private static final String CORRECT_PASSWORD = "1234";

    private EditText etUsername, etPassword;
    private TextView tvError;
    private boolean passVisible = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etUsername = findViewById(R.id.et_username);
        etPassword = findViewById(R.id.et_password);
        tvError    = findViewById(R.id.tv_error);
        ImageView ivToggle = findViewById(R.id.iv_toggle_pass);
        MaterialButton btnLogin = findViewById(R.id.btn_login);

        ivToggle.setOnClickListener(v -> {
            passVisible = !passVisible;
            if (passVisible) {
                etPassword.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                ivToggle.setImageResource(R.drawable.ic_eye_off);
            } else {
                etPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                ivToggle.setImageResource(R.drawable.ic_eye);
            }
            etPassword.setSelection(etPassword.getText().length());
        });

        btnLogin.setOnClickListener(v -> attemptLogin());
    }

    private void attemptLogin() {
        String user = etUsername.getText().toString().trim();
        String pass = etPassword.getText().toString();

        tvError.setVisibility(View.INVISIBLE);
        etUsername.setBackgroundResource(R.drawable.bg_input);
        etPassword.setBackgroundResource(R.drawable.bg_input);

        if (user.isEmpty() || pass.isEmpty()) {
            showError("⚠  All fields are required");
            if (user.isEmpty()) etUsername.setBackgroundResource(R.drawable.bg_input_error);
            if (pass.isEmpty()) etPassword.setBackgroundResource(R.drawable.bg_input_error);
            return;
        }

        if (!user.equals(CORRECT_USERNAME) || !pass.equals(CORRECT_PASSWORD)) {
            showError("✕  Invalid username or password");
            etUsername.setBackgroundResource(R.drawable.bg_input_error);
            etPassword.setBackgroundResource(R.drawable.bg_input_error);
            return;
        }

        // Login success
        startActivity(new Intent(this, ChatActivity.class));
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
        finish();
    }

    private void showError(String msg) {
        tvError.setText(msg);
        tvError.setVisibility(View.VISIBLE);
    }
}

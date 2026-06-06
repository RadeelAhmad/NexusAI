package com.nexusai.chat;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ChatActivity extends AppCompatActivity {

    // ── Gemini API Key ──
    private static final String GEMINI_API_KEY = "AIzaSyBgNBEOr4r2FbsnuJ6IgVCtlEvNkh-SIc8";
    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;

    private RecyclerView recyclerView;
    private ChatAdapter adapter;
    private List<ChatMessage> messages;
    private EditText etInput;
    private JSONArray chatHistory;
    private OkHttpClient httpClient;
    private Handler mainHandler;
    private boolean isLoading = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("");
        }

        recyclerView = findViewById(R.id.recycler_view);
        etInput      = findViewById(R.id.et_input);
        ImageButton btnSend = findViewById(R.id.btn_send);

        messages    = new ArrayList<>();
        chatHistory = new JSONArray();
        httpClient  = new OkHttpClient();
        mainHandler = new Handler(Looper.getMainLooper());

        adapter = new ChatAdapter(messages);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        // Welcome message
        addAiMessage("Assalam-o-Alaikum! 👋\nMain Gemini AI hoon. Aap mujhse kuch bhi pooch sakte hain!");

        btnSend.setOnClickListener(v -> sendMessage());
    }

    private void sendMessage() {
        String text = etInput.getText().toString().trim();
        if (text.isEmpty() || isLoading) return;

        etInput.setText("");
        addUserMessage(text);
        showTyping(true);
        callGeminiAPI(text);
    }

    private void callGeminiAPI(String userText) {
        isLoading = true;
        try {
            // Add user message to history
            JSONObject userMsg = new JSONObject();
            userMsg.put("role", "user");
            JSONArray parts = new JSONArray();
            JSONObject part = new JSONObject();
            part.put("text", userText);
            parts.put(part);
            userMsg.put("parts", parts);
            chatHistory.put(userMsg);

            // Build request body
            JSONObject body = new JSONObject();
            body.put("contents", chatHistory);

            RequestBody reqBody = RequestBody.create(
                body.toString(),
                MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                .url(GEMINI_URL)
                .post(reqBody)
                .addHeader("Content-Type", "application/json")
                .build();

            httpClient.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    mainHandler.post(() -> {
                        showTyping(false);
                        isLoading = false;
                        addAiMessage("⚠ Network error: " + e.getMessage());
                    });
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String responseStr = response.body().string();
                    mainHandler.post(() -> {
                        showTyping(false);
                        isLoading = false;
                        try {
                            JSONObject json = new JSONObject(responseStr);
                            if (json.has("error")) {
                                String errMsg = json.getJSONObject("error").getString("message");
                                addAiMessage("⚠ API Error: " + errMsg);
                                return;
                            }
                            String reply = json
                                .getJSONArray("candidates")
                                .getJSONObject(0)
                                .getJSONObject("content")
                                .getJSONArray("parts")
                                .getJSONObject(0)
                                .getString("text");

                            // Add model reply to history
                            JSONObject modelMsg = new JSONObject();
                            modelMsg.put("role", "model");
                            JSONArray mParts = new JSONArray();
                            JSONObject mPart = new JSONObject();
                            mPart.put("text", reply);
                            mParts.put(mPart);
                            modelMsg.put("parts", mParts);
                            chatHistory.put(modelMsg);

                            addAiMessage(reply);

                        } catch (Exception e) {
                            addAiMessage("⚠ Parse error: " + e.getMessage());
                        }
                    });
                }
            });

        } catch (Exception e) {
            showTyping(false);
            isLoading = false;
            addAiMessage("⚠ Error: " + e.getMessage());
        }
    }

    private void addUserMessage(String text) {
        messages.add(new ChatMessage(text, ChatMessage.TYPE_USER, getTime()));
        adapter.notifyItemInserted(messages.size() - 1);
        recyclerView.scrollToPosition(messages.size() - 1);
    }

    private void addAiMessage(String text) {
        messages.add(new ChatMessage(text, ChatMessage.TYPE_AI, getTime()));
        adapter.notifyItemInserted(messages.size() - 1);
        recyclerView.scrollToPosition(messages.size() - 1);
    }

    private void showTyping(boolean show) {
        if (show) {
            messages.add(new ChatMessage("...", ChatMessage.TYPE_TYPING, ""));
            adapter.notifyItemInserted(messages.size() - 1);
            recyclerView.scrollToPosition(messages.size() - 1);
        } else {
            for (int i = messages.size() - 1; i >= 0; i--) {
                if (messages.get(i).getType() == ChatMessage.TYPE_TYPING) {
                    messages.remove(i);
                    adapter.notifyItemRemoved(i);
                    break;
                }
            }
        }
    }

    private String getTime() {
        return new SimpleDateFormat("HH:mm", Locale.getDefault()).format(new Date());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.chat_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            new AlertDialog.Builder(this)
                .setTitle("Logout")
                .setMessage("Kya aap logout karna chahte hain?")
                .setPositiveButton("Haan", (d, w) -> {
                    startActivity(new Intent(this, LoginActivity.class));
                    finish();
                })
                .setNegativeButton("Nahi", null)
                .show();
            return true;
        }
        if (item.getItemId() == R.id.action_clear) {
            new AlertDialog.Builder(this)
                .setTitle("Chat Clear")
                .setMessage("Sari chat delete ho jayegi?")
                .setPositiveButton("Clear", (d, w) -> {
                    messages.clear();
                    chatHistory = new JSONArray();
                    adapter.notifyDataSetChanged();
                    addAiMessage("Chat clear ho gayi! Naya sawaal poochein. 🌿");
                })
                .setNegativeButton("Cancel", null)
                .show();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}

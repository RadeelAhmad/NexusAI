package com.nexusai.chat;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final List<ChatMessage> messages;

    public ChatAdapter(List<ChatMessage> messages) {
        this.messages = messages;
    }

    @Override
    public int getItemViewType(int position) {
        return messages.get(position).getType();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inf = LayoutInflater.from(parent.getContext());
        if (viewType == ChatMessage.TYPE_USER) {
            View v = inf.inflate(R.layout.item_msg_user, parent, false);
            return new UserVH(v);
        } else if (viewType == ChatMessage.TYPE_TYPING) {
            View v = inf.inflate(R.layout.item_typing, parent, false);
            return new TypingVH(v);
        } else {
            View v = inf.inflate(R.layout.item_msg_ai, parent, false);
            return new AiVH(v);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ChatMessage msg = messages.get(position);
        if (holder instanceof UserVH) {
            ((UserVH) holder).tvText.setText(msg.getText());
            ((UserVH) holder).tvTime.setText(msg.getTime());
        } else if (holder instanceof AiVH) {
            ((AiVH) holder).tvText.setText(msg.getText());
            ((AiVH) holder).tvTime.setText(msg.getTime());
        }
        // TypingVH has no data to bind
    }

    @Override
    public int getItemCount() { return messages.size(); }

    static class UserVH extends RecyclerView.ViewHolder {
        TextView tvText, tvTime;
        UserVH(View v) {
            super(v);
            tvText = v.findViewById(R.id.tv_text);
            tvTime = v.findViewById(R.id.tv_time);
        }
    }

    static class AiVH extends RecyclerView.ViewHolder {
        TextView tvText, tvTime;
        AiVH(View v) {
            super(v);
            tvText = v.findViewById(R.id.tv_text);
            tvTime = v.findViewById(R.id.tv_time);
        }
    }

    static class TypingVH extends RecyclerView.ViewHolder {
        TypingVH(View v) { super(v); }
    }
}

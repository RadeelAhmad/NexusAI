import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, FlatList, Platform,
  KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../components/theme';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'ai',
      text: 'Assalam-o-Alaikum! 👋\nMain Gemini AI hoon. Aap mujhse kuch bhi pooch sakte hain — main poori koshish karunga madad karne ki!',
      time: getCurrentTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const flatListRef = useRef(null);
  const chatHistory = useRef([]);

  useEffect(() => {
    loadApiKey();
  }, []);

  async function loadApiKey() {
    const key = await SecureStore.getItemAsync('gemini_api_key');
    if (!key) {
      Alert.alert('No API Key', 'Please set your Gemini API key first', [
        { text: 'Setup', onPress: () => navigation.replace('ApiKey') }
      ]);
      return;
    }
    setApiKey(key);
  }

  function getCurrentTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), role: 'user', text, time: getCurrentTime() };
    setMessages(prev => [...prev, userMsg]);
    chatHistory.current.push({ role: 'user', parts: [{ text }] });

    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: chatHistory.current })
        }
      );
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        const errMsg = { id: Date.now().toString() + 'e', role: 'ai', text: '⚠ ' + data.error.message, time: getCurrentTime() };
        setMessages(prev => [...prev, errMsg]);
        return;
      }

      const reply = data.candidates[0].content.parts[0].text;
      chatHistory.current.push({ role: 'model', parts: [{ text: reply }] });
      const aiMsg = { id: Date.now().toString() + 'a', role: 'ai', text: reply, time: getCurrentTime() };
      setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
      setLoading(false);
      const errMsg = { id: Date.now().toString() + 'e', role: 'ai', text: '⚠ Network error. Check your internet connection.', time: getCurrentTime() };
      setMessages(prev => [...prev, errMsg]);
    }
  }

  function clearChat() {
    Alert.alert('Clear Chat', 'Sari chat delete ho jayegi?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: () => {
          chatHistory.current = [];
          setMessages([{
            id: '0', role: 'ai',
            text: 'Chat clear ho gayi. Naya sawaal poochein!',
            time: getCurrentTime()
          }]);
        }
      }
    ]);
  }

  function renderMessage({ item }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAI]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color={colors.greenBright} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={styles.bubbleText}>{item.text}</Text>
          <Text style={[styles.bubbleTime, isUser && { textAlign: 'right' }]}>{item.time}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.replace('Login')}>
          <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.aiAvatarLarge}>
          <Ionicons name="sparkles" size={22} color={colors.greenBright} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Gemini AI</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionText}>— Encrypted Session —</Text>
            </View>
          }
          ListFooterComponent={
            loading ? (
              <View style={styles.typingWrap}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={14} color={colors.greenBright} />
                </View>
                <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14, paddingHorizontal: 18 }]}>
                  <ActivityIndicator size="small" color={colors.greenMid} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Message Gemini..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={18} color={colors.bgDeep} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgDeep },

  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, paddingHorizontal: 16,
    backgroundColor: colors.bgCard,
    borderBottomWidth: 1, borderBottomColor: colors.greenBorder,
    gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.greenBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  aiAvatarLarge: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.bgInput,
    borderWidth: 2, borderColor: colors.greenMid,
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerName: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 14, fontWeight: '700', color: colors.textPrimary,
  },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.greenBright },
  onlineText: { fontSize: 11, color: colors.greenMid },
  clearBtn: { padding: 8 },

  messagesList: { padding: 14, paddingBottom: 8, flexGrow: 1 },
  sessionBadge: {
    alignSelf: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: 20, borderWidth: 1, borderColor: colors.greenBorder,
    paddingHorizontal: 16, paddingVertical: 6, marginBottom: 14,
  },
  sessionText: {
    fontSize: 11, color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },

  msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start' },

  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.greenBorder,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  bubble: {
    maxWidth: '80%', borderRadius: 16, padding: 12,
  },
  bubbleUser: {
    backgroundColor: colors.bgBubbleUser,
    borderWidth: 1, borderColor: colors.greenDim,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: colors.bgBubbleAI,
    borderWidth: 1, borderColor: colors.greenBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: colors.textPrimary, lineHeight: 21 },
  bubbleTime: { fontSize: 10, color: colors.textMuted, marginTop: 5, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  typingWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 10, paddingHorizontal: 14,
    borderTopWidth: 1, borderTopColor: colors.greenBorder,
    backgroundColor: colors.bgCard, gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.greenBorder,
    borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 11, color: colors.textPrimary,
    fontSize: 14, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.greenBright,
    alignItems: 'center', justifyContent: 'center',
  },
});

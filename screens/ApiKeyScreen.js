import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../components/theme';

export default function ApiKeyScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  async function testAndSaveKey() {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter your Gemini API key');
      return;
    }
    if (!trimmed.startsWith('AIzaSy')) {
      Alert.alert('Invalid Key', 'Gemini API key should start with "AIzaSy..."');
      return;
    }

    setLoading(true);
    try {
      // Test the key with a simple request
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${trimmed}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }]
          })
        }
      );
      const data = await res.json();

      if (data.error) {
        Alert.alert('Invalid API Key', data.error.message || 'Key verification failed');
        setLoading(false);
        return;
      }

      // Key is valid — save it
      await SecureStore.setItemAsync('gemini_api_key', trimmed);
      setLoading(false);
      navigation.replace('Login');

    } catch (e) {
      setLoading(false);
      Alert.alert('Network Error', 'Check your internet connection');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoRing}>
              <Ionicons name="sparkles" size={36} color={colors.greenBright} />
            </View>
            <Text style={styles.appTitle}>NEXUS AI</Text>
            <Text style={styles.appSub}>GEMINI POWERED</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Setup API Key</Text>
            <Text style={styles.cardDesc}>
              Enter your Gemini API key from{' '}
              <Text style={{ color: colors.greenMid }}>aistudio.google.com</Text>
              {'\n'}Key is saved securely on your device only.
            </Text>

            <Text style={styles.label}>GEMINI API KEY</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="key-outline" size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="AIzaSy..."
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowKey(!showKey)}>
                <Ionicons
                  name={showKey ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.greenDim} />
              <Text style={styles.infoText}>
                Free tier available at aistudio.google.com — No credit card needed
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.7 }]}
              onPress={testAndSaveKey}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgDeep} />
              ) : (
                <Text style={styles.btnText}>VERIFY & SAVE KEY →</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgDeep },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, borderColor: colors.greenBright,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 24, fontWeight: '700',
    color: colors.greenBright, letterSpacing: 4,
  },
  appSub: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 11, color: colors.textSecondary,
    letterSpacing: 3, marginTop: 4,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.greenBorder,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18, fontWeight: '600',
    color: colors.textPrimary, marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13, color: colors.textSecondary,
    lineHeight: 20, marginBottom: 20,
  },
  label: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10, color: colors.greenDim,
    letterSpacing: 2, marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.greenBorder,
    borderRadius: 12, paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1, color: colors.textPrimary,
    fontSize: 14, paddingVertical: 14,
  },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.bgDeep,
    borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: colors.greenBorder,
    marginBottom: 20, gap: 8,
  },
  infoText: {
    flex: 1, fontSize: 12,
    color: colors.textSecondary, lineHeight: 18,
  },
  btn: {
    backgroundColor: colors.greenBright,
    borderRadius: 12, padding: 16,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13, fontWeight: '700',
    color: colors.bgDeep, letterSpacing: 1,
  },
});

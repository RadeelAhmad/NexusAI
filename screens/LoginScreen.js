import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
  KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../components/theme';

// Hardcoded credentials
const CORRECT_USERNAME = 'admin';
const CORRECT_PASSWORD = '1234';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [userErr, setUserErr] = useState(false);
  const [passErr, setPassErr] = useState(false);

  function doLogin() {
    setError('');
    setUserErr(false);
    setPassErr(false);

    if (!username || !password) {
      setError('⚠  All fields are required');
      if (!username) setUserErr(true);
      if (!password) setPassErr(true);
      return;
    }
    if (username !== CORRECT_USERNAME || password !== CORRECT_PASSWORD) {
      setError('✕  Invalid username or password');
      setUserErr(true);
      setPassErr(true);
      return;
    }
    navigation.replace('Chat');
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
              <Ionicons name="terminal-outline" size={38} color={colors.greenBright} />
            </View>
            <Text style={styles.appTitle}>NEXUS AI</Text>
            <Text style={styles.appSub}>SECURE LOGIN</Text>
          </View>

          {/* Form */}
          <View style={styles.formWrap}>

            <Text style={styles.label}>USERNAME</Text>
            <View style={[styles.inputWrap, userErr && styles.inputErr]}>
              <Ionicons name="person-outline" size={18} color={userErr ? colors.danger : colors.textMuted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={t => { setUsername(t); setUserErr(false); setError(''); }}
                placeholder="Enter username"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>PASSWORD</Text>
            <View style={[styles.inputWrap, passErr && styles.inputErr]}>
              <Ionicons name="lock-closed-outline" size={18} color={passErr ? colors.danger : colors.textMuted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={t => { setPassword(t); setPassErr(false); setError(''); }}
                placeholder="Enter password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.errorMsg}>{error}</Text>

            <TouchableOpacity style={styles.btn} onPress={doLogin}>
              <Text style={styles.btnText}>LOGIN →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeKeyBtn}
              onPress={() => navigation.replace('ApiKey')}
            >
              <Ionicons name="key-outline" size={14} color={colors.textMuted} />
              <Text style={styles.changeKeyText}>Change API Key</Text>
            </TouchableOpacity>

          </View>

          <Text style={styles.hint}>Demo: admin / 1234</Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgDeep },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 36 },
  logoRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, borderColor: colors.greenBright,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
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
  formWrap: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.greenBorder,
    padding: 20,
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
    marginBottom: 16,
  },
  inputErr: { borderColor: colors.danger },
  input: {
    flex: 1, color: colors.textPrimary,
    fontSize: 15, paddingVertical: 14,
  },
  errorMsg: {
    fontSize: 12, color: colors.danger,
    textAlign: 'center', minHeight: 20,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  btn: {
    backgroundColor: colors.greenBright,
    borderRadius: 12, padding: 16,
    alignItems: 'center', marginBottom: 16,
  },
  btnText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 14, fontWeight: '700',
    color: colors.bgDeep, letterSpacing: 2,
  },
  changeKeyBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, padding: 8,
  },
  changeKeyText: { fontSize: 12, color: colors.textMuted },
  hint: {
    textAlign: 'center', marginTop: 24,
    fontSize: 12, color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});

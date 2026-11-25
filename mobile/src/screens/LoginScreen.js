import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getStoredApiUrl, setStoredApiUrl } from '../services/storage';
import { PRESET_ENDPOINTS } from '../config/apiConfig';
import { checkHealth } from '../services/api';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme, isDark } = useTheme();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Server settings modal
  const [modalVisible, setModalVisible] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [pingStatus, setPingStatus] = useState(null);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    getStoredApiUrl().then(setApiUrl);
  }, []);

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter your admin security password.');
      return;
    }

    try {
      setLoading(true);
      await login(password);
    } catch (err) {
      Alert.alert(
        'Authentication Error',
        err.message || 'Incorrect password. Check your server connection in Settings below.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (testUrl) => {
    const target = testUrl || apiUrl;
    try {
      setPinging(true);
      setPingStatus({ state: 'testing', message: 'Testing backend connection...' });
      await setStoredApiUrl(target);
      const res = await checkHealth();
      setPingStatus({
        state: 'ok',
        message: `Connected successfully! Engine: ${res.database || 'Firebase Cloud Firestore'}`
      });
    } catch (err) {
      setPingStatus({
        state: 'error',
        message: `Connection failed: ${err.message}`
      });
    } finally {
      setPinging(false);
    }
  };

  const selectPreset = async (preset) => {
    setApiUrl(preset.url);
    await handleTestConnection(preset.url);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Glow decoration header */}
        <View style={styles.headerArea}>
          <View style={[styles.avatarGlow, { backgroundColor: theme.colors.primaryLight }]}>
            <View style={[styles.avatarBox, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ fontSize: 36 }}>🩺</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Dr. Shiva <Text style={{ color: theme.colors.primary }}>Singh</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Critical Care Specialist · Mobile Admin Portal
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            SECURITY MASTER KEY
          </Text>
          <View style={[styles.inputRow, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }]}>
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter admin password…"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { color: theme.colors.text }]}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
              <Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🔒'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginBtnText}>Unlock Control Center →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Server Endpoint Bar */}
        <TouchableOpacity
          style={[styles.serverBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}
          onPress={() => setModalVisible(true)}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.serverLabel, { color: theme.colors.textMuted }]}>
              BACKEND ENDPOINT:
            </Text>
            <Text numberOfLines={1} style={[styles.serverUrl, { color: theme.colors.textSecondary }]}>
              {apiUrl || 'Not configured'}
            </Text>
          </View>
          <Text style={[styles.serverConfigBtn, { color: theme.colors.primary }]}>
            Configure ⚙️
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Backend Settings Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Backend Connection Setup
            </Text>
            <Text style={[styles.modalSub, { color: theme.colors.textMuted }]}>
              Select where Dr. Shiva's backend is running:
            </Text>

            {PRESET_ENDPOINTS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.presetItem,
                  { borderColor: apiUrl === p.url ? theme.colors.primary : theme.colors.cardBorder }
                ]}
                onPress={() => selectPreset(p)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.presetName, { color: theme.colors.text }]}>{p.name}</Text>
                  <Text style={[styles.presetUrl, { color: theme.colors.textMuted }]}>{p.url}</Text>
                </View>
                {apiUrl === p.url && (
                  <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>✓ Active</Text>
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 12 }]}>
              CUSTOM API URL:
            </Text>
            <TextInput
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://192.168.1.xxx:5000/api"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.inputCustom, { color: theme.colors.text, borderColor: theme.colors.inputBorder }]}
              autoCapitalize="none"
            />

            {pingStatus ? (
              <View style={[
                styles.pingBox,
                { backgroundColor: pingStatus.state === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
              ]}>
                <Text style={{
                  color: pingStatus.state === 'ok' ? '#059669' : '#dc2626',
                  fontSize: 12,
                  fontWeight: '600'
                }}>
                  {pingStatus.message}
                </Text>
              </View>
            ) : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalTestBtn, { borderColor: theme.colors.primary }]}
                onPress={() => handleTestConnection()}
                disabled={pinging}
              >
                {pinging ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Ping Test ⚡</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: theme.colors.primary }]}
                onPress={async () => {
                  await setStoredApiUrl(apiUrl);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Save & Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%'
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28
  },
  avatarGlow: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15
  },
  eyeBtn: {
    padding: 6
  },
  loginBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  },
  serverBar: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1
  },
  serverLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  serverUrl: {
    fontSize: 12,
    marginTop: 2
  },
  serverConfigBtn: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalSub: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10
  },
  presetName: {
    fontSize: 13,
    fontWeight: '700'
  },
  presetUrl: {
    fontSize: 11,
    marginTop: 2
  },
  inputCustom: {
    borderWidth: 1,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    marginBottom: 12
  },
  pingBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6
  },
  modalTestBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalSaveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { adminChangePassword, checkHealth, autoDiscoverWorkingUrl } from '../services/api';
import { getStoredApiUrl, setStoredApiUrl } from '../services/storage';
import { API_PRESETS } from '../config/apiConfig';
import { getNativeDeviceInfo, showNativeToast } from '../services/nativeDevice';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Server Diagnostics State
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const url = await getStoredApiUrl();
      setCurrentApiUrl(url);
      setCustomUrlInput(url);
    })();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword.trim()) {
      Alert.alert('Required', 'Please enter your current password.');
      return;
    }
    if (!newPassword.trim()) {
      Alert.alert('Required', 'Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Security Notice', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await adminChangePassword(oldPassword, newPassword);
      Alert.alert('Success', 'Admin password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Alert.alert('Password Change Failed', err.message || 'Could not update password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleTestHealth = async () => {
    setTestingHealth(true);
    setHealthStatus(null);
    const start = Date.now();
    try {
      const res = await checkHealth();
      const duration = Date.now() - start;
      setHealthStatus({
        ok: true,
        database: res?.database || 'Firestore Cloud',
        message: res?.message || 'API running',
        duration
      });
    } catch (err) {
      const duration = Date.now() - start;
      setHealthStatus({
        ok: false,
        message: err.message || 'Health ping failed',
        duration
      });
    } finally {
      setTestingHealth(false);
    }
  };

  const handleAutoDetect = async () => {
    setTestingHealth(true);
    setHealthStatus({
      ok: true,
      database: 'Scanning...',
      message: 'Scanning USB, Wi-Fi & loopback endpoints...',
      duration: 0
    });
    try {
      const working = await autoDiscoverWorkingUrl();
      setCurrentApiUrl(working);
      setCustomUrlInput(working);
      const start = Date.now();
      const res = await checkHealth();
      const duration = Date.now() - start;
      setHealthStatus({
        ok: true,
        database: res?.database || 'Firestore Cloud',
        message: `Auto-connected to ${working}!`,
        duration
      });
      Alert.alert('Auto-Discovery Success', `Connected to active backend:\n${working}`);
    } catch (err) {
      setHealthStatus({
        ok: false,
        message: err.message || 'Auto-discovery failed',
        duration: 0
      });
    } finally {
      setTestingHealth(false);
    }
  };

  const handleSelectPreset = async (url) => {
    try {
      await setStoredApiUrl(url);
      setCurrentApiUrl(url);
      setCustomUrlInput(url);
      setHealthStatus(null);
      Alert.alert('Endpoint Switched', `API Base URL set to:\n${url}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleSaveCustomUrl = async () => {
    if (!customUrlInput.trim().startsWith('http')) {
      Alert.alert('Invalid URL', 'Please enter a valid HTTP or HTTPS address.');
      return;
    }
    try {
      await setStoredApiUrl(customUrlInput.trim());
      setCurrentApiUrl(customUrlInput.trim());
      setHealthStatus(null);
      Alert.alert('Custom Endpoint Saved', `API URL set to:\n${customUrlInput.trim()}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your admin session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Settings & Diagnostics"
        subtitle="Server, Security & Preferences"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appearance Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>🎨 Appearance</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                {isDark ? 'Medical Dark Slate Theme' : 'Clean Clinical Light Theme'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: theme.colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Change Admin Password Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>🔒 Admin Security</Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}>
            Change dashboard & mobile master access password
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CURRENT PASSWORD</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
            secureTextEntry
            placeholder="Enter current password"
            placeholderTextColor={theme.colors.textMuted}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>NEW PASSWORD</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
            secureTextEntry
            placeholder="Enter new strong password"
            placeholderTextColor={theme.colors.textMuted}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CONFIRM NEW PASSWORD</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
            secureTextEntry
            placeholder="Re-type new password"
            placeholderTextColor={theme.colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.actionBtnText}>Update Master Password</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Server Endpoint Diagnostics Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>🌐 Backend & Database</Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}>
            Select or customize which server the mobile app connects to
          </Text>

          <View style={[styles.currentUrlBox, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <Text style={[styles.currentUrlLabel, { color: theme.colors.textMuted }]}>ACTIVE ENDPOINT</Text>
            <Text style={[styles.currentUrlText, { color: theme.colors.primary }]}>{currentApiUrl || 'None'}</Text>
          </View>

          {/* Test Health & Auto-Detect Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <TouchableOpacity
              style={[styles.testPingBtn, { flex: 1, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}
              onPress={handleAutoDetect}
              disabled={testingHealth}
            >
              <Text style={[styles.testPingText, { color: '#10b981', fontWeight: '700' }]}>
                ⚡ Auto-Detect
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testPingBtn, { flex: 1, borderColor: theme.colors.border }]}
              onPress={handleTestHealth}
              disabled={testingHealth}
            >
              {testingHealth ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text style={[styles.testPingText, { color: theme.colors.text }]}>
                  🩺 Ping Health
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Health Diagnostics Output */}
          {healthStatus && (
            <View
              style={[
                styles.healthBox,
                {
                  backgroundColor: healthStatus.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: healthStatus.ok ? '#10b981' : '#ef4444'
                }
              ]}
            >
              <Text style={[styles.healthTitle, { color: healthStatus.ok ? '#10b981' : '#ef4444' }]}>
                {healthStatus.ok ? '✅ Server Connected' : '❌ Connection Failed'}
              </Text>
              {healthStatus.ok ? (
                <>
                  <Text style={[styles.healthDetail, { color: theme.colors.text }]}>
                    • DB Engine: {healthStatus.database}
                  </Text>
                  <Text style={[styles.healthDetail, { color: theme.colors.textSecondary }]}>
                    • Latency: {healthStatus.duration} ms
                  </Text>
                </>
              ) : (
                <Text style={[styles.healthDetail, { color: '#ef4444' }]}>{healthStatus.message}</Text>
              )}
            </View>
          )}

          {/* Presets List */}
          <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 14 }]}>
            SWITCH ENDPOINT PRESET:
          </Text>
          {(API_PRESETS || []).map((p, idx) => {
            const isSelected = currentApiUrl === p.url;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.surfaceHighlight,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border
                  }
                ]}
                onPress={() => handleSelectPreset(p.url)}
              >
                <View>
                  <Text style={[styles.presetLabel, { color: isSelected ? theme.colors.primary : theme.colors.text }]}>
                    {isSelected ? '✓ ' : ''}{p.label}
                  </Text>
                  <Text style={[styles.presetUrl, { color: theme.colors.textMuted }]}>{p.url}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Custom URL Input */}
          <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 14 }]}>
            OR CUSTOM API URL:
          </Text>
          <View style={styles.customRow}>
            <TextInput
              style={[styles.input, styles.customInput, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={customUrlInput}
              onChangeText={setCustomUrlInput}
              placeholder="http://192.168.1.100:5000/api"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.saveCustomBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleSaveCustomUrl}
            >
              <Text style={styles.saveCustomText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info & Sign Out Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>ℹ️ About Application</Text>
          <Text style={[styles.infoRow, { color: theme.colors.textSecondary }]}>
            Dr. Shiva Singh • Clinical Care Admin Mobile
          </Text>
          <Text style={[styles.infoRow, { color: theme.colors.textMuted }]}>
            Version 1.0.0 (Pure React Native • Android Native Kotlin & Java)
          </Text>
          <Text style={[styles.infoRow, { color: theme.colors.textMuted }]}>
            Architecture: Kotlin Activities + Java Native Modules (Zero Expo)
          </Text>
          <Text style={[styles.infoRow, { color: theme.colors.textMuted }]}>
            Designed for Critical Care & Internal Medicine Practice
          </Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Sign Out from Admin Panel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
    gap: 16
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 12
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600'
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 8
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14
  },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  currentUrlBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  currentUrlLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  currentUrlText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  testPingBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10
  },
  testPingText: {
    fontSize: 13,
    fontWeight: '600'
  },
  healthBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10
  },
  healthTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4
  },
  healthDetail: {
    fontSize: 12,
    marginTop: 2
  },
  presetBtn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  presetUrl: {
    fontSize: 11,
    marginTop: 2
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  customInput: {
    flex: 1
  },
  saveCustomBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  saveCustomText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  infoRow: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  logoutBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
    marginTop: 16
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700'
  }
});
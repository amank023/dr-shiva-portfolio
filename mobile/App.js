import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/screens/MainNavigator';

function RootNavigation() {
  const { isDark, theme } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <Text style={styles.splashIcon}>🩺</Text>
        <Text style={[styles.splashTitle, { color: theme.colors.text }]}>Dr. Shiva Admin</Text>
        <Text style={[styles.splashSubtitle, { color: theme.colors.textSecondary }]}>
          Connecting to Clinical Practice Portal...
        </Text>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {isAuthenticated ? <MainNavigator /> : <LoginScreen />}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  splashIcon: {
    fontSize: 56,
    marginBottom: 16
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  splashSubtitle: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center'
  }
});

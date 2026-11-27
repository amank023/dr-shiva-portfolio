import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StatusBadge({ status }) {
  const { isDark } = useTheme();

  const getStyle = () => {
    switch (status) {
      case 'confirmed':
        return isDark
          ? { bg: '#064e3b', border: '#10b981', text: '#6ee7b7', icon: '✓' }
          : { bg: '#dcfce7', border: '#86efac', text: '#15803d', icon: '✓' };
      case 'completed':
        return isDark
          ? { bg: '#1e3a8a', border: '#3b82f6', text: '#93c5fd', icon: '★' }
          : { bg: '#dbeafe', border: '#93c5fd', text: '#1d4ed8', icon: '★' };
      case 'cancelled':
        return isDark
          ? { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5', icon: '✕' }
          : { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c', icon: '✕' };
      default: // pending
        return isDark
          ? { bg: '#78350f', border: '#f59e0b', text: '#fde68a', icon: '⏳' }
          : { bg: '#fef3c7', border: '#fde68a', text: '#b45309', icon: '⏳' };
    }
  };

  const style = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.icon, { color: style.text }]}>{style.icon}</Text>
      <Text style={[styles.text, { color: style.text }]}>
        {(status || 'pending').toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5
  },
  icon: {
    fontSize: 10,
    fontWeight: '800'
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});

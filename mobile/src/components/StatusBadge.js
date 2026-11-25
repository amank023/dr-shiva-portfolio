import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: '#10b981',
          text: '#059669',
          icon: '✓'
        };
      case 'completed':
        return {
          bg: 'rgba(59, 130, 246, 0.15)',
          border: '#3b82f6',
          text: '#2563eb',
          icon: '★'
        };
      case 'cancelled':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: '#ef4444',
          text: '#dc2626',
          icon: '✕'
        };
      default: // pending
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: '#f59e0b',
          text: '#d97706',
          icon: '⏳'
        };
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.8,
    gap: 4
  },
  icon: {
    fontSize: 10,
    fontWeight: '800'
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3
  }
});

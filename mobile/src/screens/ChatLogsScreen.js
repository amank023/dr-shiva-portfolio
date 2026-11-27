import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getChatLogs, deleteChatLog, clearChatLogs } from '../services/api';
import Header from '../components/Header';

export default function ChatLogsScreen() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchList = async () => {
    try {
      const data = await getChatLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load bot logs:', err.message);
      Alert.alert('Load Error', err.message || 'Could not load chat logs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchList();
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(log => {
      const userMsg = (log.userMessage || log.query || log.message || '').toLowerCase();
      const botMsg = (log.botReply || log.response || log.reply || '').toLowerCase();
      const intent = (log.intent || log.step || '').toLowerCase();
      return userMsg.includes(q) || botMsg.includes(q) || intent.includes(q);
    });
  }, [logs, searchQuery]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this interaction transcript?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChatLog(id);
              setLogs(prev => prev.filter(l => l.id !== id));
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not delete chat log.');
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Chat Logs',
      'This will permanently delete all bot conversation history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearChatLogs();
              setLogs([]);
              Alert.alert('Success', 'All bot interaction logs cleared.');
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not clear chat logs.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="24/7 Bot Assistant"
        subtitle={`${logs.length} Patient Transcripts`}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
      />

      {/* Search & Actions Bar */}
      <View style={styles.topControlRow}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search queries or responses..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearBtn, { color: theme.colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {logs.length > 0 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
            <Text style={styles.clearAllBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logs List */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>Loading conversation logs...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        >
          {filteredLogs.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.emptyIcon}>🤖</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Chat Transcripts</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No transcripts match your search term.' : 'Patient inquiries handled by the 24/7 AI bot will appear here.'}
              </Text>
            </View>
          ) : (
            filteredLogs.map(item => {
              const userQuery = item.userMessage || item.query || item.message || '(Empty user query)';
              const botReply = item.botReply || item.response || item.reply || '(No bot response recorded)';
              const intent = item.intent || item.step || 'Consultation Help';
              const date = item.timestamp || item.createdAt ? new Date(item.timestamp || item.createdAt).toLocaleString() : '';

              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}
                >
                  {/* Top Bar: Intent Tag & Timestamp */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.intentBadge, { backgroundColor: theme.colors.primaryLight }]}>
                      <Text style={[styles.intentText, { color: theme.colors.primary }]}>⚡ {intent}</Text>
                    </View>
                    <View style={styles.headerRight}>
                      {date ? <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>{date}</Text> : null}
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item.id)}
                      >
                        <Text style={styles.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Patient Bubble */}
                  <View style={[styles.chatBubble, styles.patientBubble, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Text style={[styles.bubbleAuthor, { color: theme.colors.textSecondary }]}>👤 Patient:</Text>
                    <Text style={[styles.bubbleText, { color: theme.colors.text }]}>{userQuery}</Text>
                  </View>

                  {/* Bot Bubble */}
                  <View style={[styles.chatBubble, styles.botBubble, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary, borderWidth: 1 }]}>
                    <Text style={[styles.bubbleAuthor, { color: theme.colors.primary }]}>🤖 Virtual Assistant:</Text>
                    <Text style={[styles.bubbleText, { color: theme.colors.text }]}>{botReply}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2
  },
  clearBtn: {
    fontSize: 14,
    paddingHorizontal: 6
  },
  clearAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  clearAllBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700'
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12
  },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  intentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  intentText: {
    fontSize: 11,
    fontWeight: '700'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dateText: {
    fontSize: 11
  },
  deleteBtn: {
    padding: 4
  },
  deleteBtnText: {
    fontSize: 13
  },
  chatBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  patientBubble: {},
  botBubble: {
    borderWidth: 1
  },
  bubbleAuthor: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18
  },
  emptyBox: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center'
  }
});
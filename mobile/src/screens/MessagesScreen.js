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
  Alert,
  Linking
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getMessages, updateMessage, deleteMessage } from '../services/api';
import Header from '../components/Header';

export default function MessagesScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');

  const fetchList = async () => {
    try {
      const data = await getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load messages:', err.message);
      Alert.alert('Load Error', err.message || 'Could not load messages.');
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

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const isRead = !!msg.read;
      if (activeFilter === 'unread' && isRead) return false;
      if (activeFilter === 'read' && !isRead) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (msg.name || msg.senderName || '').toLowerCase();
      const email = (msg.email || '').toLowerCase();
      const subject = (msg.subject || '').toLowerCase();
      const body = (msg.message || msg.content || '').toLowerCase();
      return name.includes(q) || email.includes(q) || subject.includes(q) || body.includes(q);
    });
  }, [messages, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    let unread = 0;
    messages.forEach(m => {
      if (!m.read) unread++;
    });
    return {
      all: messages.length,
      unread,
      read: messages.length - unread
    };
  }, [messages]);

  const handleToggleRead = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      await updateMessage(id, { read: nextStatus });
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, read: nextStatus } : m))
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not update read status.');
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Message',
      `Are you sure you want to delete inquiry from ${name || 'this sender'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage(id);
              setMessages(prev => prev.filter(m => m.id !== id));
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not delete message.');
            }
          }
        }
      ]
    );
  };

  const openEmail = (email, subject) => {
    if (!email) return;
    const sub = encodeURIComponent(`Re: ${subject || 'Dr. Shiva Clinical Inquiry'}`);
    Linking.openURL(`mailto:${email}?subject=${sub}`);
  };

  const openCall = (phone) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Contact Inquiries"
        subtitle={`${counts.unread} Unread Messages`}
      />

      {/* Search Input */}
      <View style={[styles.searchBarContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search by sender, email, subject..."
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

      {/* Segmented Filter Bar */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: `All (${counts.all})` },
          { key: 'unread', label: `Unread (${counts.unread})` },
          { key: 'read', label: `Read (${counts.read})` }
        ].map(tab => {
          const active = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.border
                }
              ]}
              onPress={() => setActiveFilter(tab.key)}
            >
              <Text style={[styles.tabBtnText, { color: active ? '#ffffff' : theme.colors.text }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Message List */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>Loading patient inquiries...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressBackgroundColor={theme.colors.card}
            />
          }
        >
          {filteredMessages.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.emptyIcon}>✉️</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Inquiries</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No match found for your search.' : `No ${activeFilter !== 'all' ? activeFilter : ''} messages in your inbox.`}
              </Text>
            </View>
          ) : (
            filteredMessages.map(msg => {
              const name = msg.name || msg.senderName || 'Anonymous Sender';
              const email = msg.email || '';
              const phone = msg.phone || '';
              const subject = msg.subject || 'Patient Consultation Inquiry';
              const body = msg.message || msg.content || '';
              const date = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '';
              const isRead = !!msg.read;

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isRead ? theme.colors.border : theme.colors.primary,
                      borderLeftWidth: isRead ? 1 : 4
                    }
                  ]}
                >
                  {/* Top Bar: Name, Date & Unread Indicator */}
                  <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                      <View style={styles.nameRow}>
                        {!isRead && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
                        <Text style={[styles.senderName, { color: theme.colors.text }]}>{name}</Text>
                      </View>
                      <Text style={[styles.senderContact, { color: theme.colors.textMuted }]}>
                        {email} {phone ? `• ${phone}` : ''}
                      </Text>
                    </View>
                    {date ? <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>{date}</Text> : null}
                  </View>

                  {/* Subject */}
                  <Text style={[styles.subjectText, { color: theme.colors.text }]}>{subject}</Text>

                  {/* Message Body */}
                  <View style={[styles.bodyBox, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>{body}</Text>
                  </View>

                  {/* Action Bar */}
                  <View style={[styles.actionBar, { borderTopColor: theme.colors.border }]}>
                    {email ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => openEmail(email, subject)}
                      >
                        <Text style={styles.actionBtnText}>✉️ Reply Email</Text>
                      </TouchableOpacity>
                    ) : null}

                    {phone ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]}
                        onPress={() => openCall(phone)}
                      >
                        <Text style={styles.actionBtnText}>📞 Call</Text>
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.toggleBtn, { borderColor: theme.colors.border }]}
                      onPress={() => handleToggleRead(msg.id, isRead)}
                    >
                      <Text style={[styles.toggleBtnText, { color: theme.colors.text }]}>
                        {isRead ? 'Mark Unread' : 'Mark Read'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(msg.id, name)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBtnText: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  headerLeft: {
    flex: 1,
    paddingRight: 8
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  senderName: {
    fontSize: 15,
    fontWeight: '700'
  },
  senderContact: {
    fontSize: 12,
    marginTop: 2
  },
  dateText: {
    fontSize: 11
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  bodyBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600'
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  deleteBtnText: {
    fontSize: 14
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
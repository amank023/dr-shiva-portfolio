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
  Modal,
  Linking
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../services/api';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
];

export default function AppointmentsScreen({ initialOpenModal = false }) {
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for New Appointment
  const [isModalVisible, setIsModalVisible] = useState(initialOpenModal);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    service: 'General Consultation',
    reason: '',
    status: 'pending'
  });

  // Modal State for Status Picker
  const [statusModalItem, setStatusModalItem] = useState(null);

  const fetchList = async () => {
    try {
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load appointments:', err.message);
      Alert.alert('Load Error', err.message || 'Could not load appointments.');
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Filter status
      if (activeFilter !== 'all' && (apt.status || 'pending').toLowerCase() !== activeFilter) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (apt.patientName || apt.name || '').toLowerCase();
      const phone = (apt.phone || '').toLowerCase();
      const service = (apt.service || '').toLowerCase();
      const reason = (apt.reason || apt.message || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || service.includes(q) || reason.includes(q);
    });
  }, [appointments, activeFilter, searchQuery]);

  const filterCounts = useMemo(() => {
    const counts = { all: appointments.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    appointments.forEach(a => {
      const st = (a.status || 'pending').toLowerCase();
      if (counts[st] !== undefined) counts[st]++;
    });
    return counts;
  }, [appointments]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointment(id, { status: newStatus });
      setAppointments(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      );
      setStatusModalItem(null);
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not change status.');
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Appointment',
      `Are you sure you want to remove appointment for ${name || 'this patient'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAppointment(id);
              setAppointments(prev => prev.filter(a => a.id !== id));
            } catch (err) {
              Alert.alert('Delete Failed', err.message || 'Could not delete appointment.');
            }
          }
        }
      ]
    );
  };

  const handleCreateSubmit = async () => {
    if (!formData.patientName.trim()) {
      Alert.alert('Required Field', 'Please enter patient name.');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Required Field', 'Please enter patient contact number.');
      return;
    }

    setSaving(true);
    try {
      const created = await createAppointment(formData);
      Alert.alert('Success', 'New appointment booked successfully.');
      setIsModalVisible(false);
      setFormData({
        patientName: '',
        phone: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        service: 'General Consultation',
        reason: '',
        status: 'pending'
      });
      fetchList();
    } catch (err) {
      Alert.alert('Creation Failed', err.message || 'Could not create appointment.');
    } finally {
      setSaving(false);
    }
  };

  const openWhatsApp = (rawPhone) => {
    if (!rawPhone) return;
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const num = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    Linking.openURL(`https://wa.me/${num}`);
  };

  const openCall = (rawPhone) => {
    if (!rawPhone) return;
    const cleanPhone = rawPhone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Appointments"
        subtitle={`${appointments.length} Total Patients`}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
      />

      {/* Top Controls: Search & New Appointment Button */}
      <View style={[styles.searchBarContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search by name, phone, or service..."
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

      {/* Filter Tabs Horizontal Scroll */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map(f => {
            const count = filterCounts[f.key] || 0;
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderColor: active ? theme.colors.primary : theme.colors.border
                  }
                ]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[styles.filterTabText, { color: active ? '#ffffff' : theme.colors.text }]}>
                  {f.label}
                </Text>
                <View
                  style={[
                    styles.countPill,
                    { backgroundColor: active ? 'rgba(255,255,255,0.25)' : theme.colors.border }
                  ]}
                >
                  <Text style={[styles.countText, { color: active ? '#ffffff' : theme.colors.textSecondary }]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>Loading patient schedule...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        >
          {filteredAppointments.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Appointments Found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No match for your search query.' : `No ${activeFilter !== 'all' ? activeFilter : ''} appointments scheduled.`}
              </Text>
              <TouchableOpacity
                style={[styles.emptyActionBtn, { backgroundColor: theme.colors.primary }]}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.emptyActionBtnText}>+ Book New Patient</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredAppointments.map(item => {
              const name = item.patientName || item.name || 'Unnamed Patient';
              const phone = item.phone || '';
              const date = item.date || 'Unspecified Date';
              const time = item.time || 'General OPD';
              const service = item.service || item.type || 'Clinical Visit';
              const reason = item.reason || item.message || '';
              const status = item.status || 'pending';

              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}
                >
                  {/* Top Row: Patient Name & Status */}
                  <View style={styles.cardHeader}>
                    <View style={styles.patientInfo}>
                      <Text style={[styles.patientName, { color: theme.colors.text }]}>{name}</Text>
                      <Text style={[styles.patientService, { color: theme.colors.primary }]}>
                        🩺 {service}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setStatusModalItem(item)}>
                      <StatusBadge status={status} />
                    </TouchableOpacity>
                  </View>

                  {/* Schedule Details Row */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>DATE</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>📅 {date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>SLOT</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>⏰ {time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>PHONE</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>📞 {phone || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Optional Reason / Notes */}
                  {reason.trim().length > 0 && (
                    <View style={[styles.reasonBox, { backgroundColor: theme.colors.surfaceHighlight }]}>
                      <Text style={[styles.reasonLabel, { color: theme.colors.textMuted }]}>Notes / Reason:</Text>
                      <Text style={[styles.reasonText, { color: theme.colors.textSecondary }]}>{reason}</Text>
                    </View>
                  )}

                  {/* Interactive Action Bar */}
                  <View style={[styles.actionBar, { borderTopColor: theme.colors.border }]}>
                    {phone ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.callBtn]}
                          onPress={() => openCall(phone)}
                        >
                          <Text style={styles.actionBtnText}>📞 Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.waBtn]}
                          onPress={() => openWhatsApp(phone)}
                        >
                          <Text style={styles.actionBtnText}>💬 WhatsApp</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.meetBtn]}
                      onPress={() => Linking.openURL('https://meet.google.com/new')}
                    >
                      <Text style={styles.actionBtnText}>💻 Meet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.statusBtn, { borderColor: theme.colors.border }]}
                      onPress={() => setStatusModalItem(item)}
                    >
                      <Text style={[styles.statusBtnText, { color: theme.colors.primary }]}>⚙️ Status</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => handleDelete(item.id, name)}
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

      {/* Floating Action Button for New Appointment */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabText}>+ Add Patient</Text>
      </TouchableOpacity>

      {/* Status Picker Modal */}
      {statusModalItem && (
        <Modal
          visible={!!statusModalItem}
          transparent
          animationType="fade"
          onRequestClose={() => setStatusModalItem(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Update Status</Text>
              <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
                {statusModalItem.patientName || statusModalItem.name}
              </Text>

              {['pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor:
                        statusModalItem.status === st
                          ? theme.colors.primaryLight
                          : theme.colors.surfaceHighlight,
                      borderColor: statusModalItem.status === st ? theme.colors.primary : 'transparent'
                    }
                  ]}
                  onPress={() => handleStatusChange(statusModalItem.id, st)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color:
                          statusModalItem.status === st
                            ? theme.colors.primary
                            : theme.colors.text
                      }
                    ]}
                  >
                    {st === 'pending' && '⏳ '}
                    {st === 'confirmed' && '✅ '}
                    {st === 'completed' && '🎉 '}
                    {st === 'cancelled' && '❌ '}
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: theme.colors.border }]}
                onPress={() => setStatusModalItem(null)}
              >
                <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* New Appointment Modal Form */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.formModalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Book New Appointment</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Create consultation entry in Dr. Shiva's schedule
            </Text>

            <ScrollView style={styles.formScroll}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>PATIENT FULL NAME *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={theme.colors.textMuted}
                value={formData.patientName}
                onChangeText={t => setFormData(prev => ({ ...prev, patientName: t }))}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>PHONE NUMBER *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="e.g. +91 98895 27343"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={t => setFormData(prev => ({ ...prev, phone: t }))}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>EMAIL ADDRESS</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="e.g. patient@gmail.com"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={t => setFormData(prev => ({ ...prev, email: t }))}
              />

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>DATE (YYYY-MM-DD)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                    placeholder="2026-11-26"
                    placeholderTextColor={theme.colors.textMuted}
                    value={formData.date}
                    onChangeText={t => setFormData(prev => ({ ...prev, date: t }))}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>TIME SLOT</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                    placeholder="10:00 AM"
                    placeholderTextColor={theme.colors.textMuted}
                    value={formData.time}
                    onChangeText={t => setFormData(prev => ({ ...prev, time: t }))}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>CONSULTATION SERVICE</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="General Consultation / Cardiology / OPD"
                placeholderTextColor={theme.colors.textMuted}
                value={formData.service}
                onChangeText={t => setFormData(prev => ({ ...prev, service: t }))}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>SYMPTOMS / NOTES</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="Brief reason for visit or patient remarks..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={3}
                value={formData.reason}
                onChangeText={t => setFormData(prev => ({ ...prev, reason: t }))}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.colors.border }]}
                onPress={() => setIsModalVisible(false)}
                disabled={saving}
              >
                <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreateSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>Save Visit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterWrapper: {
    marginBottom: 8
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600'
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10
  },
  countText: {
    fontSize: 11,
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
    paddingBottom: 90,
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
    alignItems: 'flex-start',
    marginBottom: 10
  },
  patientInfo: {
    flex: 1,
    paddingRight: 8
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700'
  },
  patientService: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(150,150,150,0.15)'
  },
  detailItem: {
    flex: 1
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600'
  },
  reasonBox: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 16
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
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callBtn: {
    backgroundColor: '#3b82f6'
  },
  waBtn: {
    backgroundColor: '#10b981'
  },
  meetBtn: {
    backgroundColor: '#0d9488'
  },
  statusBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginLeft: 'auto'
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600'
  },
  deleteBtnText: {
    fontSize: 14
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6
  },
  fabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
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
    textAlign: 'center',
    marginBottom: 16
  },
  emptyActionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },
  emptyActionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 16
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600'
  },
  modalCloseBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600'
  },
  formModalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1
  },
  formScroll: {
    marginVertical: 10
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
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
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top'
  },
  formRow: {
    flexDirection: 'row',
    gap: 10
  },
  formCol: {
    flex: 1
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600'
  },
  modalSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  modalSubmitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  }
});
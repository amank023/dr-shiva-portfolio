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
  Modal
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  resetReviews
} from '../services/api';
import Header from '../components/Header';

export default function ReviewsScreen() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, verified, unverified

  // Modal State for Add / Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    comment: '',
    verified: true
  });

  const fetchList = async () => {
    try {
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load reviews:', err.message);
      Alert.alert('Load Error', err.message || 'Could not load patient testimonials.');
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

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const isVerified = r.verified !== false;
      if (filterType === 'verified' && !isVerified) return false;
      if (filterType === 'unverified' && isVerified) return false;
      return true;
    });
  }, [reviews, filterType]);

  const stats = useMemo(() => {
    if (!reviews.length) return { avg: '5.0', total: 0, verifiedCount: 0 };
    const totalScore = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    const verifiedCount = reviews.filter(r => r.verified !== false).length;
    return {
      avg: (totalScore / reviews.length).toFixed(1),
      total: reviews.length,
      verifiedCount
    };
  }, [reviews]);

  const handleToggleVerified = async (id, currentStatus) => {
    const nextStatus = currentStatus === false ? true : false;
    try {
      await updateReview(id, { verified: nextStatus });
      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, verified: nextStatus } : r))
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not update verification status.');
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Patient',
      rating: 5,
      comment: '',
      verified: true
    });
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      role: item.role || item.treatment || 'Patient',
      rating: Number(item.rating) || 5,
      comment: item.comment || item.text || item.review || '',
      verified: item.verified !== false
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter patient name.');
      return;
    }
    if (!formData.comment.trim()) {
      Alert.alert('Required Field', 'Please enter review comment.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateReview(editingId, formData);
        Alert.alert('Success', 'Review updated.');
      } else {
        await createReview(formData);
        Alert.alert('Success', 'Review added.');
      }
      setModalVisible(false);
      fetchList();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Review',
      `Are you sure you want to delete review by ${name || 'this patient'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(id);
              setReviews(prev => prev.filter(r => r.id !== id));
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not delete review.');
            }
          }
        }
      ]
    );
  };

  const handleResetDefaults = () => {
    Alert.alert(
      'Reset Reviews',
      'This will restore all default clinical testimonials. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Defaults',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetReviews();
              Alert.alert('Reset Complete', 'Default reviews restored.');
              fetchList();
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not reset reviews.');
            }
          }
        }
      ]
    );
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 5);
    return '⭐'.repeat(r);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Patient Reviews"
        subtitle={`${stats.total} Reviews • ⭐ ${stats.avg}`}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
      />

      {/* KPI Overview Banner */}
      <View style={[styles.kpiCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.kpiCol}>
          <Text style={[styles.kpiValue, { color: theme.colors.primary }]}>⭐ {stats.avg}</Text>
          <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>AVERAGE RATING</Text>
        </View>
        <View style={[styles.kpiDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.kpiCol}>
          <Text style={[styles.kpiValue, { color: theme.colors.text }]}>{stats.total}</Text>
          <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>TOTAL REVIEWS</Text>
        </View>
        <View style={[styles.kpiDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.kpiCol}>
          <Text style={[styles.kpiValue, { color: '#10b981' }]}>{stats.verifiedCount}</Text>
          <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>VERIFIED</Text>
        </View>
      </View>

      {/* Filter Row & Action Buttons */}
      <View style={styles.filterBar}>
        <View style={styles.filterPills}>
          {[
            { key: 'all', label: 'All' },
            { key: 'verified', label: 'Verified' },
            { key: 'unverified', label: 'Unverified' }
          ].map(f => {
            const active = filterType === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderColor: active ? theme.colors.primary : theme.colors.border
                  }
                ]}
                onPress={() => setFilterType(f.key)}
              >
                <Text style={[styles.filterPillText, { color: active ? '#fff' : theme.colors.text }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={handleResetDefaults}>
          <Text style={styles.resetBtnText}>↺ Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>Loading testimonials...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        >
          {filteredReviews.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.emptyIcon}>⭐</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Reviews</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                No {filterType !== 'all' ? filterType : ''} patient testimonials found.
              </Text>
            </View>
          ) : (
            filteredReviews.map(item => {
              const name = item.name || 'Verified Patient';
              const role = item.role || item.treatment || 'Patient';
              const rating = Number(item.rating) || 5;
              const comment = item.comment || item.text || item.review || '';
              const isVerified = item.verified !== false;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}
                >
                  {/* Card Header: Name, Stars & Verified Pill */}
                  <View style={styles.cardHeader}>
                    <View style={styles.patientMeta}>
                      <Text style={[styles.patientName, { color: theme.colors.text }]}>{name}</Text>
                      <Text style={[styles.patientRole, { color: theme.colors.textMuted }]}>{role}</Text>
                    </View>
                    <View style={styles.starsWrapper}>
                      <Text style={styles.starsText}>{renderStars(rating)}</Text>
                      <TouchableOpacity
                        style={[
                          styles.verifiedBadge,
                          { backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
                        ]}
                        onPress={() => handleToggleVerified(item.id, isVerified)}
                      >
                        <Text style={[styles.verifiedBadgeText, { color: isVerified ? '#10b981' : '#ef4444' }]}>
                          {isVerified ? '✓ Verified' : '✕ Hidden'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Comment */}
                  <Text style={[styles.commentText, { color: theme.colors.textSecondary }]}>
                    "{comment}"
                  </Text>

                  {/* Action Bar */}
                  <View style={[styles.actionBar, { borderTopColor: theme.colors.border }]}>
                    <TouchableOpacity
                      style={[
                        styles.toggleVerifiedBtn,
                        { borderColor: isVerified ? '#ef4444' : '#10b981' }
                      ]}
                      onPress={() => handleToggleVerified(item.id, isVerified)}
                    >
                      <Text style={[styles.toggleVerifiedText, { color: isVerified ? '#ef4444' : '#10b981' }]}>
                        {isVerified ? 'Hide from Web' : 'Publish to Web'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.editBtn, { borderColor: theme.colors.border }]}
                      onPress={() => handleOpenEdit(item)}
                    >
                      <Text style={[styles.editBtnText, { color: theme.colors.text }]}>✏️ Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
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

      {/* Floating Add Review Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleOpenAdd}
      >
        <Text style={styles.fabText}>+ Add Review</Text>
      </TouchableOpacity>

      {/* Add / Edit Review Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.formModalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingId ? 'Edit Review' : 'Add Patient Testimonial'}
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Showcase patient experience on Dr. Shiva's website
            </Text>

            <ScrollView style={styles.formScroll}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>PATIENT NAME *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="e.g. Anjali Sharma"
                placeholderTextColor={theme.colors.textMuted}
                value={formData.name}
                onChangeText={t => setFormData(prev => ({ ...prev, name: t }))}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>ROLE / TREATMENT</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="e.g. Knee Surgery Patient / Consultation"
                placeholderTextColor={theme.colors.textMuted}
                value={formData.role}
                onChangeText={t => setFormData(prev => ({ ...prev, role: t }))}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>RATING (STARS: 1 - 5)</Text>
              <View style={styles.starSelectorRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.starSelectBtn,
                      {
                        backgroundColor: formData.rating >= star ? theme.colors.warningLight : theme.colors.surfaceHighlight,
                        borderColor: formData.rating >= star ? theme.colors.warning : theme.colors.border
                      }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, rating: star }))}
                  >
                    <Text style={styles.starSelectText}>⭐ {star}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>TESTIMONIAL COMMENT *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                placeholder="Share the patient's kind words and recovery experience..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={4}
                value={formData.comment}
                onChangeText={t => setFormData(prev => ({ ...prev, comment: t }))}
              />

              <TouchableOpacity
                style={[
                  styles.verifiedCheckbox,
                  { backgroundColor: theme.colors.surfaceHighlight, borderColor: theme.colors.border }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, verified: !prev.verified }))}
              >
                <Text style={styles.checkboxIcon}>{formData.verified ? '☑️' : '⬜'}</Text>
                <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>
                  Mark as Verified & Publish Immediately
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.colors.border }]}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>{editingId ? 'Update' : 'Publish'}</Text>
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
  kpiCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  kpiCol: {
    flex: 1,
    alignItems: 'center'
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800'
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2
  },
  kpiDivider: {
    width: StyleSheet.hairlineWidth,
    height: '60%'
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  resetBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600'
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
  patientMeta: {
    flex: 1
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700'
  },
  patientRole: {
    fontSize: 12,
    marginTop: 2
  },
  starsWrapper: {
    alignItems: 'flex-end',
    gap: 4
  },
  starsText: {
    fontSize: 13
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 12
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8
  },
  toggleVerifiedBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  toggleVerifiedText: {
    fontSize: 12,
    fontWeight: '600'
  },
  editBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  editBtnText: {
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
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  formModalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 18,
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
    minHeight: 80,
    textAlignVertical: 'top'
  },
  starSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 4
  },
  starSelectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center'
  },
  starSelectText: {
    fontSize: 12,
    fontWeight: '700'
  },
  verifiedCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    gap: 8
  },
  checkboxIcon: {
    fontSize: 16
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '600'
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12
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
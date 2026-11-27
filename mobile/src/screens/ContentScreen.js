import React, { useState, useEffect } from 'react';
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
  Image
} from 'react-native';

const doctorAvatar = require('../../assets/doctor.jpg');
import { useTheme } from '../context/ThemeContext';
import { getContent, updateContent, resetContent } from '../services/api';
import Header from '../components/Header';

export default function ContentScreen() {
  const { theme } = useTheme();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [profile, setProfile] = useState({
    name: '',
    specialty: '',
    tagline: '',
    degrees: '',
    regNo: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    hours: '',
    googleMeetLink: '',
    heroBio: '',
    aboutBio: ''
  });

  const fetchSiteContent = async () => {
    try {
      const data = await getContent();
      setContent(data);
      if (data && data.profile) {
        setProfile({
          name: data.profile.name || '',
          specialty: data.profile.specialty || '',
          tagline: data.profile.tagline || '',
          degrees: data.profile.degrees || '',
          regNo: data.profile.regNo || '',
          phone: data.profile.phone || '',
          email: data.profile.email || '',
          location: data.profile.location || '',
          address: data.profile.address || '',
          hours: data.profile.hours || '',
          googleMeetLink: data.profile.googleMeetLink || '',
          heroBio: data.profile.heroBio || '',
          aboutBio: data.profile.aboutBio || ''
        });
      }
    } catch (err) {
      console.warn('Failed to load content:', err.message);
      Alert.alert('Load Error', err.message || 'Could not load site content.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSiteContent();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...(content || {}),
        profile: {
          ...(content?.profile || {}),
          ...profile
        }
      };
      await updateContent(payload);
      Alert.alert('Content Saved', 'Website profile and clinical details updated successfully.');
      fetchSiteContent();
    } catch (err) {
      Alert.alert('Save Error', err.message || 'Could not update website content.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Content',
      'Are you sure you want to reset all website content to original clinic defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Defaults',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await resetContent();
              Alert.alert('Reset Complete', 'Default website content restored.');
              fetchSiteContent();
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not reset content.');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Website CMS"
        subtitle="Manage Live Doctor Profile & OPD Info"
      />

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>Loading website details...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
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
          {/* Section 1: Doctor Profile */}
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👨‍⚕️</Text>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Doctor Profile</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
                  Personal identity & medical credentials
                </Text>
              </View>
            </View>

            {/* Profile Photo Preview & Edit */}
            <View style={styles.photoContainer}>
              <Image
                source={profile.photo && profile.photo.startsWith('http') ? { uri: profile.photo } : doctorAvatar}
                style={styles.doctorPhotoThumb}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PROFILE PHOTO URL</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={profile.photo || '/doctor.jpg'}
                  onChangeText={t => setProfile(p => ({ ...p, photo: t }))}
                  placeholder="/doctor.jpg or https://..."
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>FULL NAME</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.name}
              onChangeText={t => setProfile(p => ({ ...p, name: t }))}
              placeholder="e.g. Dr. Shiva Singh"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>SPECIALTY</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.specialty}
              onChangeText={t => setProfile(p => ({ ...p, specialty: t }))}
              placeholder="e.g. Critical Care Specialist"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TAGLINE / SUBTITLE</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.tagline}
              onChangeText={t => setProfile(p => ({ ...p, tagline: t }))}
              placeholder="e.g. Critical Care & Internal Medicine · Lucknow"
              placeholderTextColor={theme.colors.textMuted}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>REGISTRATION NO.</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={profile.regNo}
                  onChangeText={t => setProfile(p => ({ ...p, regNo: t }))}
                  placeholder="e.g. 79855"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>DEGREES SUMMARY</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={profile.degrees}
                  onChangeText={t => setProfile(p => ({ ...p, degrees: t }))}
                  placeholder="e.g. MBBS, B.Sc. CCM"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>
          </View>

          {/* Section 2: Contact & OPD Hours */}
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏥</Text>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Clinic & OPD Details</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
                  Timings, consultation links, & contact
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PRIMARY PHONE</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={profile.phone}
                  onChangeText={t => setProfile(p => ({ ...p, phone: t }))}
                  placeholder="+91-9889527343"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CLINIC EMAIL</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={profile.email}
                  onChangeText={t => setProfile(p => ({ ...p, email: t }))}
                  placeholder="askdrshivasingh@gmail.com"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>OPD HOURS / TIMINGS</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.hours}
              onChangeText={t => setProfile(p => ({ ...p, hours: t }))}
              placeholder="e.g. Mon–Sat · 9:00 AM – 12:00 PM & 4:00 PM – 7:00 PM"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>GOOGLE MEET CONSULTATION ROOM URL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.googleMeetLink}
              onChangeText={t => setProfile(p => ({ ...p, googleMeetLink: t }))}
              placeholder="https://meet.google.com/shv-care-meet"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CLINIC ADDRESS</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.address}
              onChangeText={t => setProfile(p => ({ ...p, address: t }))}
              placeholder="e.g. Sahara City Homes, IIM Road, Lucknow"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          {/* Section 3: Clinical Biographies */}
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Doctor Biographies</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>
                  Website summary and detailed clinical bio
                </Text>
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>HERO / INTRO SUMMARY</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.heroBio}
              onChangeText={t => setProfile(p => ({ ...p, heroBio: t }))}
              multiline
              numberOfLines={3}
              placeholder="Brief tagline for the top of the webpage..."
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>FULL CLINICAL ABOUT BIO</Text>
            <TextInput
              style={[styles.input, styles.largeTextArea, { backgroundColor: theme.colors.surfaceHighlight, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={profile.aboutBio}
              onChangeText={t => setProfile(p => ({ ...p, aboutBio: t }))}
              multiline
              numberOfLines={5}
              placeholder="Comprehensive clinical background, NABH accreditations, and achievements..."
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          {/* Save & Reset Bottom Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: '#ef4444' }]}
              onPress={handleReset}
              disabled={saving}
            >
              <Text style={styles.resetButtonText}>↺ Restore Defaults</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>💾 Save All Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  contentScroll: {
    padding: 16,
    paddingBottom: 50,
    gap: 16
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12
  },
  doctorPhotoThumb: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0284c7'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(150, 150, 150, 0.2)'
  },
  sectionIcon: {
    fontSize: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 10
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
  largeTextArea: {
    minHeight: 110,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  col: {
    flex: 1
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700'
  },
  saveButton: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  }
});
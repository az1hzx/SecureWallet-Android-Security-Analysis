import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { isDark, theme } = useTheme();
  const { changePassword, loading } = useAuth();

  const getStrength = () => {
    const len = newPassword.length;
    if (len === 0) return { level: 0, label: '', bars: [false, false, false, false] };
    if (len < 4) return { level: 1, label: 'Weak', bars: [true, false, false, false] };
    if (len < 8) return { level: 2, label: 'Medium strength', bars: [true, true, false, false] };
    if (len < 12) return { level: 3, label: 'Strong', bars: [true, true, true, false] };
    return { level: 4, label: 'Very strong', bars: [true, true, true, true] };
  };

  const strength = getStrength();

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'New passwords do not match.' });
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully.' });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, {
          backgroundColor: isDark ? 'rgba(17,19,24,0.9)' : 'rgba(248,249,251,0.9)',
          borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(226,232,240,0.2)',
        }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.primary }]}>SecureWallet</Text>
          </View>
       
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>{'Security &\nPrivacy'}</Text>
            <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
              Update your credentials to keep your SecureWallet safe.
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Current Password */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>CURRENT PASSWORD</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <MaterialCommunityIcons
                    name={showCurrent ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>NEW PASSWORD</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <MaterialCommunityIcons
                    name={showNew ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {newPassword.length > 0 && (
                <>
                  <View style={styles.strengthRow}>
                    {strength.bars.map((active, i) => (
                      <View
                        key={i}
                        style={[
                          styles.strengthBar,
                          { backgroundColor: active ? theme.primary : (isDark ? '#3a3c44' : '#e1e2e4') },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: theme.textMuted }]}>{strength.label}</Text>
                </>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>CONFIRM PASSWORD</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-type your new password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                />
                <MaterialCommunityIcons name="lock-outline" size={18} color={theme.textMuted} />
              </View>
            </View>

            <View style={[styles.securityNote, {
              backgroundColor: isDark ? 'rgba(39,41,50,0.5)' : 'rgba(225,226,228,0.35)',
            }]}>
              <View style={[styles.securityNoteIcon, {
                backgroundColor: isDark ? 'rgba(144,168,255,0.1)' : 'rgba(0,35,111,0.08)',
              }]}>
                <MaterialCommunityIcons name="shield-lock" size={20} color={theme.primary} />
              </View>
              <View style={styles.securityNoteInfo}>
                <Text style={[styles.securityNoteTitle, { color: theme.text }]}>Security Advice</Text>
                <Text style={[styles.securityNoteDesc, { color: theme.textSecondary }]}>
                  Avoid using common words or personal info. Use a mix of letters, numbers, and symbols.
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.updateBtn, { backgroundColor: theme.primaryContainer }]} activeOpacity={0.85} onPress={handleUpdate} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.updateBtnText}>Update Password</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
        
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    paddingHorizontal: 24,
    gap: 32,
  },
  fieldGroup: {},
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 2,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    height: 4,
  },
  strengthBar: {
    flex: 1,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    padding: 16,
  },
  securityNoteIcon: {
    padding: 8,
    borderRadius: 10,
  },
  securityNoteInfo: {
    flex: 1,
  },
  securityNoteTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  securityNoteDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  actions: {
    paddingTop: 16,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  forgotBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  forgotBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

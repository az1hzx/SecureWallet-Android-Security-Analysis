import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { isDark, theme } = useTheme();
  const { register, loading } = useAuth();

  const validateEmail = (text) => {
    setEmail(text);
    if (text.length > 0 && !text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Please enter a valid work email.');
    } else {
      setEmailError('');
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields.' });
      return;
    }
    if (emailError) return;
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match.' });
      return;
    }
    try {
      await register(fullName, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: err.message });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons name="shield" size={24} color={theme.primary} />
              <Text style={[styles.brandText, { color: theme.primary }]}>SecureWallet</Text>
            </View>
            <View style={[styles.encryptionBadge, { backgroundColor: isDark ? 'rgba(78,222,163,0.1)' : 'rgba(0,74,49,0.4)' }]}>
              <MaterialCommunityIcons name="lock" size={11} color="#27c38a" />
              <Text style={styles.encryptionBadgeText}>BANK-GRADE ENCRYPTION</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join the elite circle of SecureWallet users and manage your wealth with surgical precision.
          </Text>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>FULL NAME</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Jonathan Doe"
                  placeholderTextColor={theme.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }, emailError ? styles.inputErrorBorder : null]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="jonathan@vault.com"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={validateEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>VAULT PASSWORD</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="••••••••••••"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>CONFIRM VAULT PASSWORD</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="••••••••••••"
                  placeholderTextColor={theme.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.registerBtnWrap}>
              <TouchableOpacity activeOpacity={0.85} onPress={handleRegister} disabled={loading}>
                <LinearGradient
                  colors={isDark ? ['#1a2660', '#2a4ab0'] : ['#00236f', '#1e3a8a']}
                  style={styles.registerBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.registerBtnText}>Register Account</Text>
                      <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(117,118,130,0.1)' }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR CONTINUE WITH</Text>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(117,118,130,0.1)' }]} />
          </View>



          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>Already part of the vault? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>Secure Sign In</Text>
            </TouchableOpacity>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  encryptionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27c38a',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  form: {
    paddingHorizontal: 32,
    gap: 24,
  },
  fieldGroup: {},
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputErrorBorder: {
    borderBottomColor: '#EF4444',
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#EF4444',
  },
  registerBtnWrap: {
    paddingTop: 24,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    borderRadius: 14,
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    gap: 16,
    marginTop: 24,
  },
  googleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(117,118,130,0.05)',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#191c1e',
  },
  appleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#191c1e',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  appleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8f9fb',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  loginText: {
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    fontWeight: '600',
  },
});

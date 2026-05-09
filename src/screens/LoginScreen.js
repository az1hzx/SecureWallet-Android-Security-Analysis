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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { isDark, theme } = useTheme();
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter your email and password.' });
      return;
    }
    try {
      await login(email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: err.message });
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#111318', '#1e2028'] : ['#ffffff', '#e8eef7']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="shield" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>SecureWallet</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>Access your digital vault securely.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardAlt }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="name@company.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <MaterialCommunityIcons name="email-outline" size={20} color={theme.textMuted} />
            </View>

            {/* Password */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>PASSWORD</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardAlt }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'lock-outline'}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.primaryContainer }]} activeOpacity={0.85} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Log In to SecureWallet</Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.registerLink, { color: theme.primary }]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
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
  },
  header: {
    paddingTop: 80,
    paddingBottom: 36,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 6,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  loginButton: {
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  registerText: {
    fontSize: 13,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});

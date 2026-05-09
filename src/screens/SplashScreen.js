import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen({ navigation }) {
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? ['#111318', '#1a2660', '#111318'] : ['#1E3A8A', '#2548a8', '#1E3A8A']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="shield" size={80} color="#ffffff" />
        </View>
        <Text style={styles.title}>SecureWallet</Text>
        <Text style={styles.tagline}>FINANCIAL FORTITUDE</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.encryptionBadge}>
          <MaterialCommunityIcons name="shield-lock" size={16} color="#4fc3f7" />
          <Text style={styles.encryptionText}>  Bank-Grade Encryption</Text>
        </View>
        <Text style={styles.versionText}>Version 4.2.0 • Institution Grade</Text>

        <TouchableOpacity
          style={styles.skipBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.skipBtnText}>Skip</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 3,
    marginTop: 6,
  },
  bottom: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 195, 247, 0.12)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.25)',
    marginBottom: 12,
  },
  encryptionText: {
    color: '#4fc3f7',
    fontSize: 13,
    fontWeight: '600',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    marginBottom: 24,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    borderRadius: 20,
  },
  skipBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

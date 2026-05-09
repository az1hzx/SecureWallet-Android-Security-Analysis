import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const [policyVisible, setPolicyVisible] = useState(false);
  const [appearanceVisible, setAppearanceVisible] = useState(false);
  const { isDark, theme, toggleTheme } = useTheme();

  const settingsItems = [
    { id: '1', label: 'Appearance', icon: 'weather-night', onPress: () => setAppearanceVisible(true) },
    { id: '2', label: 'Privacy Policy', icon: 'file-document-outline', onPress: () => setPolicyVisible(true) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: isDark ? 'rgba(17,19,24,0.9)' : 'rgba(248,249,251,0.9)' }]}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="shield" size={22} color={theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.primary }]}>SecureWallet</Text>
          </View>
         
        </View>

        <View style={styles.titleSection}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ACCOUNT & SECURITY</Text>
          <Text style={[styles.pageTitle, { color: theme.primary }]}>Settings</Text>
        </View>

        <View style={[styles.securityCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.securityCardTop}>
            <View style={styles.securityCardLeft}>
              <View style={styles.securityIconBox}>
                <MaterialCommunityIcons name="lock" size={20} color="#27c38a" />
              </View>
              <Text style={[styles.securityCardTitle, { color: theme.text }]}>Security Level</Text>
            </View>
            <View style={styles.maxBadge}>
              <Text style={styles.maxBadgeText}>MAXIMUM</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.settingsItem, { backgroundColor: theme.cardAlt }]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.settingsItemLeft}>
                <MaterialCommunityIcons name={item.icon} size={22} color={theme.textSecondary} />
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{item.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
          <Text style={[styles.versionText, { color: theme.textMuted }]}>VERSION 4.2.0 (BUILD 992)</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav activeTab="Settings" navigation={navigation} />

      <Modal
        visible={policyVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPolicyVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPolicyVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: theme.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPolicyVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.policyHeading, { color: theme.text }]}>1. Information We Collect</Text>
              <Text style={[styles.policyText, { color: theme.textSecondary }]}>
                SecureWallet collects personal information including your name, email address, and financial data to provide our services. We use bank-grade encryption to protect all data in transit and at rest.
              </Text>

              <Text style={[styles.policyHeading, { color: theme.text }]}>2. How We Use Your Data</Text>
              <Text style={[styles.policyText, { color: theme.textSecondary }]}>
                Your data is used exclusively to provide wallet services, process transactions, and improve our security protocols. We never sell your personal information to third parties.
              </Text>

              <Text style={[styles.policyHeading, { color: theme.text }]}>3. Data Security</Text>
              <Text style={[styles.policyText, { color: theme.textSecondary }]}>
                We employ multi-layer encryption, biometric authentication, and hardware security modules to protect your data. All transactions are verified through our secure protocol.
              </Text>

              <Text style={[styles.policyHeading, { color: theme.text }]}>4. Your Rights</Text>
              <Text style={[styles.policyText, { color: theme.textSecondary }]}>
                You have the right to access, modify, or delete your personal data at any time. Contact our support team to exercise these rights.
              </Text>

              <Text style={[styles.policyHeading, { color: theme.text }]}>5. Contact Us</Text>
              <Text style={[styles.policyText, { color: theme.textSecondary }]}>
                For privacy-related inquiries, reach out to privacy@securewallet.io. We respond to all requests within 48 hours.
              </Text>
              <View style={{ height: 24 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={appearanceVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAppearanceVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAppearanceVisible(false)}>
          <Pressable style={[styles.modalSheetSmall, { backgroundColor: theme.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Appearance</Text>
              <TouchableOpacity onPress={() => setAppearanceVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.appearanceDesc, { color: theme.textSecondary }]}>
              Choose your preferred theme for SecureWallet.
            </Text>

            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: theme.cardAlt, borderColor: !isDark ? theme.primary : 'transparent', borderWidth: 2 },
                ]}
                activeOpacity={0.8}
                onPress={() => { if (isDark) toggleTheme(); }}
              >
                <View style={[styles.themePreview, { backgroundColor: '#f8f9fb' }]}>
                  <View style={[styles.themePreviewBar, { backgroundColor: '#00236f' }]} />
                  <View style={[styles.themePreviewLine, { backgroundColor: '#e1e2e4' }]} />
                  <View style={[styles.themePreviewLine, { backgroundColor: '#e1e2e4', width: '60%' }]} />
                </View>
                <View style={styles.themeOptionLabel}>
                  <MaterialCommunityIcons name="white-balance-sunny" size={18} color={!isDark ? theme.primary : theme.textMuted} />
                  <Text style={[styles.themeOptionText, { color: !isDark ? theme.primary : theme.textMuted, fontWeight: !isDark ? '700' : '500' }]}>Light</Text>
                </View>
                {!isDark && <MaterialCommunityIcons name="check-circle" size={20} color={theme.primary} style={styles.themeCheck} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: theme.cardAlt, borderColor: isDark ? theme.primary : 'transparent', borderWidth: 2 },
                ]}
                activeOpacity={0.8}
                onPress={() => { if (!isDark) toggleTheme(); }}
              >
                <View style={[styles.themePreview, { backgroundColor: '#111318' }]}>
                  <View style={[styles.themePreviewBar, { backgroundColor: '#90a8ff' }]} />
                  <View style={[styles.themePreviewLine, { backgroundColor: '#272932' }]} />
                  <View style={[styles.themePreviewLine, { backgroundColor: '#272932', width: '60%' }]} />
                </View>
                <View style={styles.themeOptionLabel}>
                  <MaterialCommunityIcons name="moon-waning-crescent" size={18} color={isDark ? theme.primary : theme.textMuted} />
                  <Text style={[styles.themeOptionText, { color: isDark ? theme.primary : theme.textMuted, fontWeight: isDark ? '700' : '500' }]}>Dark</Text>
                </View>
                {isDark && <MaterialCommunityIcons name="check-circle" size={20} color={theme.primary} style={styles.themeCheck} />}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  securityCard: {
    marginHorizontal: 24,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  securityCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  securityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityIconBox: {
    padding: 8,
    backgroundColor: 'rgba(39,195,138,0.08)',
    borderRadius: 10,
  },
  securityCardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  maxBadge: {
    backgroundColor: 'rgba(39,195,138,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  maxBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27c38a',
    letterSpacing: 1.5,
  },
  securityCardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingsList: {
    paddingHorizontal: 24,
    gap: 4,
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsItemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(239,68,68,0.08)',
    paddingVertical: 20,
    borderRadius: 14,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  modalSheetSmall: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalScroll: {
    maxHeight: 400,
  },
  policyHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  policyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  appearanceDesc: {
    fontSize: 14,
    marginBottom: 24,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  themeOption: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  themePreview: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'flex-end',
    gap: 6,
  },
  themePreviewBar: {
    width: '80%',
    height: 8,
    borderRadius: 4,
  },
  themePreviewLine: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
  themeOptionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeOptionText: {
    fontSize: 14,
  },
  themeCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

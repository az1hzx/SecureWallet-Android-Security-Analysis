import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UPLOADS_BASE } from '../config';

const menuItems = [
  {
    id: '3',
    label: 'Log Out',
    icon: 'logout',
    iconColor: '#ba1a1a',
    iconBg: 'rgba(255,218,214,0.3)',
    hasChevron: false,
    isDestructive: true,
  },
];

export default function ProfileScreen({ navigation }) {
  const { isDark, theme } = useTheme();
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';
  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();
  const imageUri = user?.userImage ? `${UPLOADS_BASE}/${user.userImage}` : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: isDark ? 'rgba(17,19,24,0.9)' : 'rgba(248,249,251,0.9)' }]}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="shield" size={22} color={theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.primary }]}>SecureWallet</Text>
          </View>
         
        </View>

        <View style={styles.sectionTitle}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ACCOUNT OVERVIEW</Text>
          <Text style={[styles.pageTitle, { color: theme.primary }]}>Profile</Text>
        </View>

        <View style={[styles.identityCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={isDark ? ['#2a4ab0', '#1a2660'] : ['#00236f', '#1e3a8a']}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.avatarInner, { backgroundColor: isDark ? '#272932' : '#e1e2e4' }]}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons name="account" size={48} color={theme.textMuted} />
                )}
              </View>
            </LinearGradient>
          </View>

          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email || ''}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: theme.primaryContainer }]} activeOpacity={0.85} onPress={() => navigation.navigate('EditProfile')}>
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changePassBtn} activeOpacity={0.85} onPress={() => navigation.navigate('ChangePassword')}>
              <MaterialCommunityIcons name="lock-reset" size={18} color="#27c38a" />
              <Text style={styles.changePassText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.cardAlt }]}>
            <View style={[styles.statIcon, { backgroundColor: theme.card }]}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#27c38a" />
            </View>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>MEMBER</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>Since {memberYear}</Text>
          </View>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.isDestructive) {
                  logout();
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <Text style={[styles.menuLabel, item.isDestructive && styles.menuLabelDestructive]}>
                  {item.label}
                </Text>
              </View>
              {item.hasChevron && (
                <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav activeTab="Profile" navigation={navigation} />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  identityCard: {
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: 'rgba(0,35,111,0.04)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 4,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 32,
    padding: 4,
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  proBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#004a31',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27c38a',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 32,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  changePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#004a31',
    paddingVertical: 16,
    borderRadius: 14,
  },
  changePassText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#27c38a',
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 32,
    padding: 24,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuList: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#191c1e',
  },
  menuLabelDestructive: {
    color: '#ba1a1a',
  },
});

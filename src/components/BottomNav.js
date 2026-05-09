import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { key: 'Home', icon: 'home', label: 'HOME' },
  { key: 'Cards', icon: 'credit-card-outline', label: 'CARDS' },
  { key: 'AddCard', icon: 'plus', label: '' },
  { key: 'Profile', icon: 'account-outline', label: 'PROFILE' },
  { key: 'Settings', icon: 'cog-outline', label: 'SETTINGS' },
];

export default function BottomNav({ activeTab, navigation }) {
  const { isDark, theme } = useTheme();

  return (
    <View style={[styles.bottomNav, {
      backgroundColor: theme.navBg,
      borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(241,245,249,1)',
    }]}>
      {TABS.map((tab) => {
        if (tab.key === 'AddCard') {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.fabCenter}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AddCard')}
            >
              <View style={[styles.fabCircle, { backgroundColor: theme.primaryContainer }]}>
                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.navItem,
              isActive && [styles.navItemActive, {
                backgroundColor: isDark ? 'rgba(144,168,255,0.15)' : 'rgba(219,234,254,0.6)',
              }],
            ]}
            onPress={() => {
              if (!isActive) navigation.navigate(tab.key);
            }}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={22}
              color={isActive ? theme.primary : theme.textMuted}
            />
            <Text style={[
              styles.navLabel,
              { color: isActive ? theme.primary : theme.textMuted },
              isActive && { fontWeight: '700' },
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 3,
  },
  navItemActive: {
    transform: [{ scale: 1.08 }],
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  fabCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  fabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});

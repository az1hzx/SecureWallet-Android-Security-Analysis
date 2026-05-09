import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UPLOADS_BASE } from '../config';

export default function EditProfileScreen({ navigation }) {
  const { isDark, theme } = useTheme();
  const { user, loading, updateProfile, uploadImage } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [localImage, setLocalImage] = useState(null);
  const [webFile, setWebFile] = useState(null);
  const fileInputRef = useRef(null);

  const imageUri = localImage || (user?.userImage ? `${UPLOADS_BASE}/${user.userImage}` : null);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      const ImagePicker = await import('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setLocalImage(result.assets[0].uri);
      }
    }
  };

  const handleWebFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const uri = URL.createObjectURL(file);
      setLocalImage(uri);
      setWebFile(file);
    }
  };

  const handleSave = async () => {
    try {
      if (localImage) {
        await uploadImage(Platform.OS === 'web' ? webFile : localImage);
      }
      await updateProfile(fullName, email);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated successfully.' });
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileChange}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, {
          backgroundColor: isDark ? 'rgba(17,19,24,0.9)' : 'rgba(248,249,251,0.9)',
          borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(226,232,240,0.2)',
        }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.primary }]}>Edit Profile</Text>
          </View>
          <View style={styles.headerShield}>
            <MaterialCommunityIcons name="shield" size={22} color="#27c38a" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarCircle, {
                backgroundColor: isDark ? '#272932' : '#e7e8ea',
                borderColor: theme.card,
              }]}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons name="account" size={48} color={theme.textMuted} />
                )}
              </View>
              <TouchableOpacity style={[styles.cameraBtn, { borderColor: theme.bg }]} activeOpacity={0.85} onPress={pickImage}>
                <MaterialCommunityIcons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarName, { color: theme.primary }]}>{user?.name || 'User'}</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.primary }]}>Full Name</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.textMuted}
                />
                <MaterialCommunityIcons name="account-outline" size={18} color={theme.textMuted} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.primary }]}>Email Address</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: theme.cardAlt,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(117,118,130,0.15)',
              }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <MaterialCommunityIcons name="email-outline" size={18} color={theme.textMuted} />
              </View>
            </View>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <View style={[styles.securityIcon, { backgroundColor: theme.card }]}>
              <MaterialCommunityIcons name="lock" size={20} color="#27c38a" />
            </View>
            <View style={styles.securityInfo}>
              <Text style={[styles.securityTitle, { color: isDark ? '#4edea3' : '#004a31' }]}>END-TO-END ENCRYPTED</Text>
              <Text style={[styles.securityDesc, { color: theme.textSecondary }]}>
                Your profile data is protected by SecureWallet's multi-layer encryption protocols.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleSave} disabled={loading}>
              <LinearGradient
                colors={isDark ? ['#1a2660', '#2a4ab0'] : ['#00236f', '#1e3a8a']}
                style={styles.saveBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="content-save" size={22} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discardBtn} onPress={() => navigation.goBack()}>
              <Text style={[styles.discardBtnText, { color: theme.textMuted }]}>Discard Changes</Text>
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
    gap: 16,
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
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerShield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(39,195,138,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    marginBottom: 48,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00236f',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  avatarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
  formSection: {
    paddingHorizontal: 24,
    gap: 32,
    marginBottom: 48,
  },
  fieldGroup: {},
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: 'rgba(39,195,138,0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginBottom: 40,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  actions: {
    paddingHorizontal: 32,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    borderRadius: 24,
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  discardBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  discardBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

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
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

const CARD_NETWORKS = ['Visa', 'Mastercard'];

export default function AddCardScreen({ navigation }) {
  const { token } = useAuth();
  const [cardNetwork, setCardNetwork] = useState('Visa');
  const [bankName, setBankName] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [balance, setBalance] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleSave = async () => {
    if (!bankName || !cardholderName || !cardNumber || !expiryDate || !cvv || !balance || !creditScore) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardHolder: cardholderName,
          expiryDate,
          cvv,
          bankName,
          balence: parseFloat(balance),
          creditScore: parseInt(creditScore, 10),
          cardType: cardNetwork,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Card added successfully.' });
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const displayCardNumber = cardNumber
    ? formatCardNumber(cardNumber.replace(/\D/g, ''))
    : '•••• •••• •••• ••••';

  const displayName = cardholderName || 'Your Name Here';
  const displayExpiry = expiryDate || 'MM/YY';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#00236f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Card</Text>
        </View>
  
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card Preview */}
        <LinearGradient
          colors={['#00236f', '#1e3a8a']}
          style={styles.cardPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardPreviewAbstract} />
          <View style={styles.cardPreviewTop}>
            <Text style={styles.cardPreviewBrand}>SecureWallet</Text>
            <MaterialCommunityIcons name="contactless-payment" size={28} color="rgba(255,255,255,0.7)" />
          </View>
          <View style={styles.cardPreviewMiddle}>
            <Text style={styles.cardPreviewNumber}>{displayCardNumber}</Text>
          </View>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>Card Holder</Text>
              <Text style={styles.cardPreviewValue}>{displayName.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>Expiry</Text>
              <Text style={styles.cardPreviewValue}>{displayExpiry}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          {/* Card Network */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CARD NETWORK</Text>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => setShowNetworkPicker(!showNetworkPicker)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{cardNetwork}</Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color="#757682" />
            </TouchableOpacity>
            {showNetworkPicker && (
              <View style={styles.pickerDropdown}>
                {CARD_NETWORKS.map((network) => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      styles.pickerOption,
                      cardNetwork === network && styles.pickerOptionActive,
                    ]}
                    onPress={() => {
                      setCardNetwork(network);
                      setShowNetworkPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        cardNetwork === network && styles.pickerOptionTextActive,
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bank Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>BANK NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Chase Bank"
              placeholderTextColor="rgba(117,118,130,0.4)"
              value={bankName}
              onChangeText={setBankName}
            />
          </View>

          {/* Cardholder Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CARDHOLDER NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="John Doe"
              placeholderTextColor="rgba(117,118,130,0.4)"
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="words"
            />
          </View>

          {/* Card Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CARD NUMBER</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.textInput, styles.cardNumberInput]}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="rgba(117,118,130,0.4)"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19}
              />
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={22}
                color="rgba(117,118,130,0.5)"
                style={styles.fieldIcon}
              />
            </View>
          </View>

          {/* Expiry & CVV */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>EXPIRY DATE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="MM/YY"
                placeholderTextColor="rgba(117,118,130,0.4)"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiry(text))}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={{ width: 32 }} />
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="•••"
                  placeholderTextColor="rgba(117,118,130,0.4)"
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
                <MaterialCommunityIcons
                  name="information-outline"
                  size={22}
                  color="rgba(117,118,130,0.5)"
                  style={styles.fieldIcon}
                />
              </View>
            </View>
          </View>

          {/* Balance & Credit Score */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>BALANCE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor="rgba(117,118,130,0.4)"
                value={balance}
                onChangeText={setBalance}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ width: 32 }} />
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>CREDIT SCORE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="750"
                placeholderTextColor="rgba(117,118,130,0.4)"
                value={creditScore}
                onChangeText={(text) => setCreditScore(text.replace(/\D/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Securely</Text>
            )}
          </TouchableOpacity>
         
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: 'rgba(248,249,251,0.9)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00236f',
    letterSpacing: -0.3,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(39,195,138,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  protectedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27c38a',
    letterSpacing: 1.2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
    marginBottom: 40,
    overflow: 'hidden',
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  cardPreviewAbstract: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardPreviewBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  cardPreviewMiddle: {
    marginTop: 28,
  },
  cardPreviewNumber: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 16,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardPreviewValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  form: {
    gap: 28,
  },
  fieldGroup: {},
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#444651',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(117,118,130,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 4,
    fontSize: 15,
    color: '#191c1e',
  },
  cardNumberInput: {
    flex: 1,
    letterSpacing: 3,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(117,118,130,0.15)',
  },
  fieldIcon: {
    paddingRight: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(117,118,130,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  selectText: {
    fontSize: 15,
    color: '#191c1e',
  },
  pickerDropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pickerOptionActive: {
    backgroundColor: 'rgba(30,58,138,0.06)',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#191c1e',
  },
  pickerOptionTextActive: {
    color: '#00236f',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  saveSection: {
    marginTop: 48,
    paddingBottom: 20,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#757682',
    marginTop: 16,
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  termsLink: {
    color: '#00236f',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

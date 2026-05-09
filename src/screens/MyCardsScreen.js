import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const CARD_VARIANTS = ['gradient', 'dark', 'light'];

export default function MyCardsScreen({ navigation }) {
  const { token } = useAuth();
  const { isDark, theme } = useTheme();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailCard, setDetailCard] = useState(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/cards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCards(data.data.cards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [token])
  );

  const maskNumber = (num) => {
    const clean = num.replace(/\s/g, '');
    if (clean.length <= 4) return clean;
    return '**** **** **** ' + clean.slice(-4);
  };

  const renderCard = (item, index) => {
    const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
    const masked = maskNumber(item.cardNumber);
    const bal = `$${item.balence.toLocaleString()}`;

    const cardContent = (
      <>
        <View style={styles.cardAbstract} />
        <View style={styles.cardTopRow}>
          <View>
            <Text style={variant === 'light' ? [styles.cardTypeLight, { color: theme.textSecondary }] : styles.cardType}>
              {item.cardType}
            </Text>
            <Text style={variant === 'light' ? [styles.cardNameLight, { color: theme.primary }] : styles.cardNameDark}>
              {item.bankName}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.viewBtn, variant === 'light' && { backgroundColor: isDark ? 'rgba(144,168,255,0.12)' : 'rgba(30,58,138,0.08)' }]}
            onPress={() => setDetailCard(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="eye-outline" size={18} color={variant === 'light' ? theme.primary : '#fff'} />
          </TouchableOpacity>
        </View>
        <Text style={variant === 'light' ? [styles.cardNumberLight, { color: theme.textSecondary }] : styles.cardNumberDark}>
          {masked}
        </Text>
        <View style={styles.cardBottomRow}>
          <View>
            <Text style={variant === 'light' ? [styles.cardDetailLabelLight, { color: theme.textMuted }] : styles.cardDetailLabel}>Balance</Text>
            <Text style={variant === 'light' ? [styles.cardBalanceLight, { color: theme.primary }] : styles.cardBalanceDark}>{bal}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={variant === 'light' ? [styles.cardDetailLabelLight, { color: theme.textMuted }] : styles.cardDetailLabel}>Expiry</Text>
            <Text style={variant === 'light' ? [styles.cardExpiryLight, { color: theme.textSecondary }] : styles.cardExpiryDark}>{item.expiryDate}</Text>
          </View>
        </View>
      </>
    );

    if (variant === 'gradient') {
      return (
        <View key={item.id} style={{ marginBottom: 16 }}>
          <LinearGradient
            colors={isDark ? ['#1a2660', '#2a4ab0'] : ['#00236f', '#1e3a8a']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {cardContent}
          </LinearGradient>
        </View>
      );
    }

    if (variant === 'dark') {
      return (
        <View key={item.id} style={[styles.card, styles.cardDark, { marginBottom: 16 }]}>
          {cardContent}
        </View>
      );
    }

    return (
      <View key={item.id} style={[styles.card, styles.cardLight, {
        backgroundColor: theme.card,
        borderColor: theme.border,
        marginBottom: 16,
      }]}>
        {cardContent}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.summary}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>TOTAL CARDS</Text>
          <Text style={[styles.summaryCount, { color: theme.primary }]}>{cards.length} Cards</Text>
          <Text style={[styles.summarySub, { color: theme.textSecondary }]}>All cards are encrypted & secure</Text>
        </View>

        {/* Cards List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>All Cards</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
            <View style={[styles.addBadge, { backgroundColor: isDark ? 'rgba(144,168,255,0.12)' : 'rgba(30,58,138,0.08)' }]}>
              <MaterialCommunityIcons name="plus" size={14} color={theme.primary} />
              <Text style={[styles.addBadgeText, { color: theme.primary }]}>ADD NEW</Text>
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : cards.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="credit-card-off-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No cards added yet</Text>
          </View>
        ) : (
          cards.map(renderCard)
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav activeTab="Cards" navigation={navigation} />

      {/* Detail Modal */}
      <Modal visible={!!detailCard} transparent animationType="fade" onRequestClose={() => setDetailCard(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDetailCard(null)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Card Details</Text>
              <TouchableOpacity onPress={() => setDetailCard(null)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {detailCard && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Card Holder</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.cardHolder}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Card Type</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.cardType}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Bank Name</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.bankName}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Card Number</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.cardNumber}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Expiry Date</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.expiryDate}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>CVV</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.cvv}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Balance</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>${detailCard.balence.toLocaleString()}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Credit Score</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{detailCard.creditScore}</Text>
                </View>
                <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, { color: theme.textMuted }]}>Status</Text>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{detailCard.status}</Text>
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
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
  summary: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 4,
  },
  summarySub: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#191c1e',
  },
  cardLight: {
    borderWidth: 1,
  },
  cardAbstract: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardNameDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  cardNumberDark: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 4,
    marginBottom: 16,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDetailLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardBalanceDark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  cardExpiryDark: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  cardTypeLight: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardNameLight: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardNumberLight: {
    fontSize: 15,
    letterSpacing: 4,
    marginBottom: 16,
  },
  cardDetailLabelLight: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardBalanceLight: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardExpiryLight: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailDivider: {
    height: 1,
  },
  detailKey: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(39,195,138,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27c38a',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27c38a',
  },
});

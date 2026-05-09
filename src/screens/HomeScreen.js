import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_SPACING = 16;

const SkeletonBlock = ({ w, h, radius, theme }) => {
  const opacity = useState(new Animated.Value(0.3))[0];

  useState(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{
      width: w, height: h, borderRadius: radius || 8,
      backgroundColor: theme.cardAlt, opacity,
    }} />
  );
};

export default function HomeScreen({ navigation }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { isDark, theme } = useTheme();
  const { user, token } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'User';
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (token) fetchCards();
    }, [token])
  );

  const netWorth = cards.reduce((sum, c) => sum + (c.balence || 0), 0);
  const avgCreditScore = cards.length > 0
    ? Math.round(cards.reduce((sum, c) => sum + (c.creditScore || 0), 0) / cards.length)
    : 0;

  const onCardScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    setActiveCardIndex(index);
  };

  const maskNumber = (num) => {
    const clean = (num || '').replace(/\s/g, '');
    if (clean.length <= 4) return clean;
    return '**** **** **** ' + clean.slice(-4);
  };

  const renderCard = ({ item, index }) => {
    const isEven = index % 2 === 0;
    const masked = maskNumber(item.cardNumber);
    const bal = `$${item.balence.toLocaleString()}`;

    if (isEven) {
      return (
        <View style={[styles.sliderCard, styles.sliderCardDark]}>
          <View style={styles.cardContactless}>
            <MaterialCommunityIcons name="contactless-payment" size={32} color="rgba(255,255,255,0.15)" />
          </View>
          <View>
            <Text style={styles.cardType}>{item.cardType}</Text>
            <Text style={styles.cardNameDark}>{item.bankName}</Text>
          </View>
          <View>
            <Text style={styles.cardNumberDark}>{masked}</Text>
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardBalanceDark}>{bal}</Text>
              <View style={styles.mastercardCircles}>
                <View style={[styles.mcCircle, { backgroundColor: 'rgba(239,68,68,0.8)' }]} />
                <View style={[styles.mcCircle, { backgroundColor: 'rgba(234,179,8,0.8)', marginLeft: -10 }]} />
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.sliderCard, styles.sliderCardLight, {
        backgroundColor: theme.card,
        borderColor: theme.border,
      }]}>
        <View>
          <Text style={[styles.cardTypeLight, { color: theme.textSecondary }]}>{item.cardType}</Text>
          <Text style={[styles.cardNameLight, { color: theme.primary }]}>{item.bankName}</Text>
        </View>
        <View>
          <Text style={[styles.cardNumberLight, { color: theme.textSecondary }]}>{masked}</Text>
          <View style={styles.cardBottomRow}>
            <Text style={[styles.cardBalanceLight, { color: theme.primary }]}>{bal}</Text>
            <MaterialCommunityIcons name="circle-multiple" size={24} color="#27c38a" />
          </View>
        </View>
      </View>
    );
  };

  const renderSkeletonCards = () => (
    <View style={{ flexDirection: 'row', paddingLeft: 24, paddingRight: 8 }}>
      {[1, 2].map((i) => (
        <View key={i} style={[styles.sliderCard, { backgroundColor: theme.cardAlt, marginRight: CARD_SPACING }]}>
          <View>
            <SkeletonBlock w={80} h={10} theme={theme} />
            <View style={{ height: 8 }} />
            <SkeletonBlock w={140} h={18} theme={theme} />
          </View>
          <View>
            <SkeletonBlock w={180} h={14} theme={theme} />
            <View style={{ height: 10 }} />
            <SkeletonBlock w={100} h={22} theme={theme} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>PORTFOLIO OVERVIEW</Text>
          <Text style={[styles.greetingName, { color: theme.primary }]}>Hello, {firstName}</Text>
          <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>
            {loading ? 'Loading your cards...' : `You have ${cards.length} cards saved`}
          </Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={isDark ? ['#1a2660', '#2a4ab0'] : ['#00236f', '#1e3a8a']}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.abstractCircle} />
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>TOTAL NET WORTH</Text>
              {loading ? (
                <SkeletonBlock w={180} h={36} radius={12} theme={{ cardAlt: 'rgba(255,255,255,0.12)' }} />
              ) : (
                <Text style={styles.balanceAmount}>${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              )}
            </View>
            <View style={styles.trendIcon}>
              <MaterialCommunityIcons name="trending-up" size={22} color="#fff" />
            </View>
          </View>
        </LinearGradient>

        {/* Your Cards */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Your Cards</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cards')}>
            <Text style={[styles.viewAll, { color: theme.primary }]}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {loading ? renderSkeletonCards() : (
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.cardsList}
            onScroll={onCardScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.emptyCards}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>No cards yet</Text>
              </View>
            }
          />
        )}

        {/* Quick Insights */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Quick Insights</Text>
        </View>
        <View style={styles.insightsRow}>
          <View style={[styles.insightCard, { backgroundColor: theme.cardAlt }]}>
            <View style={[styles.insightIconCircle, { backgroundColor: 'rgba(39,195,138,0.1)' }]}>
              <MaterialCommunityIcons name="wallet" size={22} color="#27c38a" />
            </View>
            <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>NET WORTH</Text>
            {loading ? (
              <SkeletonBlock w={90} h={22} theme={theme} />
            ) : (
              <Text style={[styles.insightValue, { color: theme.primary }]}>${netWorth.toLocaleString()}</Text>
            )}
          </View>
          <View style={[styles.insightCard, { backgroundColor: theme.cardAlt }]}>
            <View style={[styles.insightIconCircle, { backgroundColor: isDark ? 'rgba(144,168,255,0.1)' : 'rgba(30,58,138,0.1)' }]}>
              <MaterialCommunityIcons name="credit-card-check" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>CREDIT SCORE</Text>
            {loading ? (
              <SkeletonBlock w={60} h={22} theme={theme} />
            ) : (
              <Text style={[styles.insightValue, { color: theme.primary }]}>{avgCreditScore || '—'}</Text>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav activeTab="Home" navigation={navigation} />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  greeting: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  greetingLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 8,
  },
  greetingName: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 18,
  },
  balanceCard: {
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 32,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#00236f',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  abstractCircle: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  balanceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 3,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  trendIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 14,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  transferBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  transferBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00236f',
    letterSpacing: 2,
  },
  analyticsBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  analyticsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cardsList: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 8,
  },
  sliderCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 16,
    padding: 24,
    marginRight: CARD_SPACING,
    justifyContent: 'space-between',
  },
  sliderCardDark: {
    backgroundColor: '#191c1e',
    overflow: 'hidden',
  },
  sliderCardLight: {
    borderWidth: 1,
  },
  cardContactless: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 3,
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalanceDark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  mastercardCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 6,
  },
  cardBalanceLight: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyCards: {
    width: CARD_WIDTH,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 24,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  insightsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  insightCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
  },
  insightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  activityRowZebra: {
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySub: {
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});

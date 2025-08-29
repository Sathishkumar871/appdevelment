import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

/*************************
 * DATA
 *************************/
const newsItems = [
  { id: 'n1', title: 'Free Fire Tournament: Grand Finale Live!', image: 'https://ik.imagekit.io/pimx50ija/IMG_20250819_213204.jpg?updatedAt=1755619417712' },
  { id: 'n2', title: 'Cricket League: Season 3 kicks off!', image: 'https://ik.imagekit.io/pimx50ija/34a18d8f09695559e101635c63daa019.jpg?updatedAt=1756095223392' },
  { id: 'n3', title: 'Kids Fun Zone: New games and prizes!', image: 'https://ik.imagekit.io/pimx50ija/a92fc81200a23bcff87c94d88c9d6a6b.jpg?updatedAt=1756095307892' },
];

const winners = [
  { id: 'w1', game: 'CS2', winner: 'Team Vitality' },
  { id: 'w2', game: 'Apex Legends', winner: 'VK Gaming' },
  { id: 'w3', game: 'Warzone', winner: 'Twisted Minds' },
  { id: 'w4', game: 'Chess', winner: 'Team Liquid' },
  { id: 'w5', game: 'SF6', winner: 'Team Spirit' },
];

const onlineGames = [
  { id: 'online-1', name: 'BGMI', genre: 'Battle Royale', image: 'https://ik.imagekit.io/pimx50ija/34.2_8th_Anniversary_KV.jpg?updatedAt=1756060975831', route: '/games/pubg' },
  { id: 'online-2', name: 'Free Fire', genre: 'Battle Royale', image: 'https://ik.imagekit.io/pimx50ija/3339313cfb446d61ce907b5efc2b4fd7.jpg?updatedAt=1756060121791', route: '/games/freefire' },
  { id: 'online-3', name: 'Valorant', genre: 'FPS', image: 'https://ik.imagekit.io/pimx50ija/4eb048a798cef1a388e06591d6c6bb403579cec0-854x484.avif?updatedAt=1756061300974', route: '/games/valrorant' },
  { id: 'online-4', name: 'call of duty', genre: 'MOBA', image: 'https://ik.imagekit.io/pimx50ija/a74b9e643ee7125523055d023cd6bf66.jpg?updatedAt=1756088219477', route: '/games/callofduty' },
  
];

const outdoorGames = [
  { id: 'out-1', name: 'Cricket', image: 'https://ik.imagekit.io/pimx50ija/IMG_20250825_075841.jpg?updatedAt=1756088985872', route: '/games/cricket' },
  { id: 'out-2', name: 'Kabaddi', image: 'https://ik.imagekit.io/pimx50ija/56bb1cc581a8267d968113d35c2b3f2a.jpg?updatedAt=1756089335324', route: '/games/kabaddi' },
  { id: 'out-3', name: 'Volleyball', image: 'https://ik.imagekit.io/pimx50ija/IMG_20250825_081535.jpg?updatedAt=1756089992053', route: '/games/vollyball' },

];

const kidsGames = [
  { id: 'kid-1', name: 'football', image: 'https://ik.imagekit.io/pimx50ija/d62898c582396454f33e46d5e26eade2.jpg?updatedAt=1756090345299', route: '/kids/football' },
  { id: 'kid-2', name: 'tug of war', image: 'https://ik.imagekit.io/pimx50ija/1d220b99e560ebf67a5f5cb77237b354.jpg?updatedAt=1756090561121', route: '/kids/tugofwar' },
  { id: 'kid-3', name: 'Laugh & Learn Quiz', image: 'https://ik.imagekit.io/pimx50ija/90ac66ab7d6b67613b3760b71c08297f.jpg?updatedAt=1756091041116', route: '/kids/quiz' },
  
];

const coupleGames = [
  { id: 'cp-1', name: 'Couple Quiz', image: 'https://play-lh.googleusercontent.com/B-1pW8pUdY-2-fMEi3h1s-9t3G5c_Q-s4o_uH_D_GnHP-Qlq_z-k_euq1_E=w240-h480-rw', route: '/couples/quiz' },
  { id: 'cp-2', name: '2-Player Duels', image: 'https://play-lh.googleusercontent.com/z4_cK5g3t2wsUlq2e-z23232bQYU2t-g_g_g_g-g_g_g_g_g_g-g=w240-h480-rw', route: '/couples/duels' },
];

const SectionTitle = ({ title }) => (
  <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);
const NewsCard = ({ item }) => (
  <TouchableOpacity style={styles.newsCard}>
    <Image source={{ uri: item.image }} style={styles.newsImage} />
    <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
  </TouchableOpacity>
);
const WinnersMarquee = ({ items }) => {
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);
  const translateX = useSharedValue(0);
  useEffect(() => {
    const totalWidth = items.length * 170;
    translateX.value = withRepeat(
      withTiming(-totalWidth, { duration: items.length * 2000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(translateX);
  }, [items, translateX]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={[styles.marqueeContent, animatedStyle]}>
        {duplicatedItems.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.winnerItem}>
            <Text style={styles.winnerText}><Text style={{ fontWeight: 'bold' }}>{item.game}:</Text> {item.winner}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};
const AnimatedFire = ({ isVisible }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (isVisible) {
      scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(1, { duration: 300 }, () => {
        opacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) });
      });
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [isVisible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.fireEffect, animatedStyle]} />
  );
};

const GameCard = ({ item, onPress, isFav, onToggleFav }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = useCallback(() => (scale.value = withTiming(0.96, { duration: 100 })), [scale]);
  const onPressOut = useCallback(() => (scale.value = withTiming(1, { duration: 120 })), [scale]);

  const [fireVisible, setFireVisible] = useState(false);

  const handlePress = useCallback(() => {
    if (item.name === 'Free Fire') {
      setFireVisible(true);
      setTimeout(() => setFireVisible(false), 600);
    }
    onPress();
  }, [item.name, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.gameCard, animatedStyle]}>
        <Image source={{ uri: item.image }} style={styles.gameCardImage} />
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favBtn} onPress={(e) => { e.stopPropagation?.(); onToggleFav?.(item); }}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#ef4444' : '#1F2937'} />
        </TouchableOpacity>
        <View style={styles.gameCardLabel}>
          <Text style={styles.gameCardText}>{item.name}</Text>
        </View>
        {item.name === 'Free Fire' && <AnimatedFire isVisible={fireVisible} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

/*************************
 * NEW: SECTION WRAPPER with unique background
 *************************/
const SectionWrapper = ({ children, gradientColors }) => (
  <View style={styles.sectionContainer}>
    <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
    {children}
  </View>
);

/*************************
 * CATEGORY ROW (reusable)
 *************************/
const GameCategoryRow = ({ title, items, router, favorites, toggleFavorite }) => (
  <View style={styles.section}>
    <SectionTitle title={title} />
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      renderItem={({ item }) => (
        <GameCard
          item={item}
          onPress={() => router.push(item.route)}
          isFav={favorites.has(item.id)}
          onToggleFav={toggleFavorite}
        />
      )}
    />
  </View>
);

/*************************
 * ONLINE ARENA – Filter Only (Search Bar Removed)
 *************************/
const OnlineArena = ({ router, favorites, toggleFavorite }) => {
  const [genre, setGenre] = useState('All');
  const genres = useMemo(() => ['All', 'FPS', 'MOBA', 'Battle Royale', 'Strategy'], []);

  const filtered = useMemo(() => {
    return onlineGames.filter((g) => genre === 'All' || g.genre === genre);
  }, [genre]);

  return (
    <View style={styles.section}>
      <SectionTitle title="Online Arena" />
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        {genres.map((g) => (
          <TouchableOpacity key={g} style={[styles.chip, genre === g && styles.chipActive]} onPress={() => setGenre(g)}>
            <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        horizontal
        data={filtered}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <GameCard
            item={item}
            onPress={() => router.push(item.route)}
            isFav={favorites.has(item.id)}
            onToggleFav={toggleFavorite}
          />
        )}
      />
    </View>
  );
};

/*************************
 * FOOTER
 *************************/
const Footer = () => (
  <View style={styles.footer}>
    <TouchableOpacity><Text style={styles.footerText}>Privacy Policy</Text></TouchableOpacity>
    <TouchableOpacity><Text style={styles.footerText}>Terms of Service</Text></TouchableOpacity>
  </View>
);

/*************************
 * MAIN SCREEN
 *************************/
const FinalPremiumHub = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
      return next;
    });
  }, []);

  const allItems = useMemo(() => [...onlineGames, ...outdoorGames, ...kidsGames, ...coupleGames], []);
  const favoriteItems = useMemo(() => allItems.filter((i) => favorites.has(i.id)), [favorites, allItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        {/* Top News */}
        <View style={styles.section}>
          <SectionTitle title="Latest News" />
          <FlatList
            horizontal
            data={newsItems}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => <NewsCard item={item} />}
          />
        </View>

        {/* Winners Marquee */}
        <WinnersMarquee items={winners} />

        {/* Online with search + filters */}
        <SectionWrapper gradientColors={['#E5E7EB', '#D1D5DB']}>
          <OnlineArena router={router} favorites={favorites} toggleFavorite={toggleFavorite} />
        </SectionWrapper>

        {/* Outdoor */}
        <SectionWrapper gradientColors={['#D1FAE5', '#F0FDF4']}>
          <GameCategoryRow title="Outdoor Sports" items={outdoorGames} router={router} favorites={favorites} toggleFavorite={toggleFavorite} />
        </SectionWrapper>

        {/* Kids */}
        <SectionWrapper gradientColors={['#FCE7F3', '#F9A8D4']}>
          <GameCategoryRow title="Kids' Zone" items={kidsGames} router={router} favorites={favorites} toggleFavorite={toggleFavorite} />
        </SectionWrapper>

        {/* Couple */}
        <SectionWrapper gradientColors={['#FFE4E6', '#FECDD3']}>
          <GameCategoryRow title="Couple Games" items={coupleGames} router={router} favorites={favorites} toggleFavorite={toggleFavorite} />
        </SectionWrapper>

        {/* Favorites (only if something is saved) */}
        {favoriteItems.length > 0 && (
          <SectionWrapper gradientColors={['#FEF3C7', '#FDE68A']}>
            <GameCategoryRow title="My Favorites" items={favoriteItems} router={router} favorites={favorites} toggleFavorite={toggleFavorite} />
          </SectionWrapper>
        )}

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

/*************************
 * STYLES
 *************************/
const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 16,
  },
  section: { marginBottom: 10 },
  sectionTitle: { color: '#1F2937', fontSize: 22, fontWeight: 'bold' },

  newsCard: { width: 300, marginRight: 16, backgroundColor: '#F3F4F6', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  newsImage: { width: '100%', height: 150 },
  newsTitle: { color: '#1F2937', fontWeight: '600', padding: 12 },

  marqueeContainer: { height: 42, backgroundColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', justifyContent: 'center', marginVertical: 18 },
  marqueeContent: { flexDirection: 'row', alignItems: 'center' },
  winnerItem: { width: 170, alignItems: 'center' },
  winnerText: { color: '#4B5563', fontSize: 14 },

  gameCard: {
    width: 160,
    height: 190,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#F9FAFB',
  },
  gameCardImage: { width: '100%', height: '68%' },
  gameCardLabel: { height: '32%', backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },
  gameCardText: { color: 'white', fontWeight: 'bold' },

  badge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  badgeText: { color: '#e5e7eb', fontSize: 11, fontWeight: '600' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },

  // Filter Chips
  chip: { marginRight: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.05)' },
  chipActive: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
  chipText: { color: '#4B5563' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  footer: { borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.1)', marginTop: 24, paddingTop: 20, paddingBottom: 10, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-around' },
  footerText: { color: '#4B5563' },
  
  fireEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    borderRadius: 16,
  },
});

export default FinalPremiumHub;
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// --- Reusable Data and Components ---
const travelOptions = [
  { id: 't1', name: 'Hotels', icon: 'bed', colors: ['#3B82F6', '#2563EB'], route: '/travel/hotels' },
  { id: 't2', name: 'Cars', icon: 'car', colors: ['#10B981', '#059669'], route: '/travel/cars' },
  { id: 't3', name: 'Bikes', icon: 'bike', colors: ['#FBBF24', '#F59E0B'], route: 'travel/bikes' },
];

const offers = [
  { id: 'o1', title: 'Luxury Stays', subtitle: '50% Off on Premium Hotels', image: 'https://i.imgur.com/k91J1Wb.jpeg' },
  { id: 'o2', title: 'Car Rentals', subtitle: 'Book a ride, get 25% cashback', image: 'https://i.imgur.com/aC2zE0P.jpeg' },
  { id: 'o3', title: 'Bike Adventures', subtitle: 'Weekend deals in Rajahmundry', image: 'https://i.imgur.com/9C0D3E5.jpeg' },
];

// --- Animated Travel Card Component ---
const AnimatedTravelCard = ({ item, router }) => {
  const rotation = useSharedValue(0);

  const startAnimation = () => {
    rotation.value = withSequence(
      withTiming(-5, { duration: 150 }),
      withTiming(5, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <TouchableOpacity
      style={styles.cardButton}
      onPress={() => router.push(item.route)}
      onPressIn={startAnimation}
    >
      <LinearGradient
        colors={item.colors}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.cardContent, animatedStyle]}>
        <MaterialCommunityIcons name={item.icon} size={60} color="#fff" />
        <Text style={styles.cardText}>{item.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Animated Offer Card Component ---
const AnimatedOfferCard = ({ item }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1)) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.offerCard, animatedStyle]}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
    </Animated.View>
  );
};

// --- Main TravelScreen Component ---
const TravelScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={StyleSheet.absoluteFill}
      />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Hello, User!</Text>
              <Text style={styles.welcomeSubtitle}>Your travel hub for Rajahmundry.</Text>
            </View>

            <Text style={styles.sectionTitle}>Today's Top Offers</Text>
          </>
        }
        horizontal
        data={offers}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <AnimatedOfferCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        style={{ marginBottom: 20 }}
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Book Your Travel</Text>
        <View style={styles.grid}>
          {travelOptions.map((item) => (
            <AnimatedTravelCard key={item.id} item={item} router={router} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    padding: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  offerCard: {
    width: 280,
    height: 120,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  cardButton: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default TravelScreen;
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85; // Full width style
const CARD_HEIGHT = 180;
const CARD_MARGIN = 15;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const offersData = [
  { title: "Infinity Play Days", subtitle: "Exclusive Gaming Tournaments", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60" },
  { title: "30 Minute Food Delivery", subtitle: "Hungry? Get It Fast!", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60" },
  { title: "Instant Grocery", subtitle: "Fresh Produce at Your Door", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60" },
  { title: "Random Calls & Chat", subtitle: "Connect with Privacy", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60" },
  { title: "Vehicle Rentals", subtitle: "Cars & Bikes On-Demand", imageUrl: "https://images.unsplash.com/photo-1517524206127-48bbd363f5d4?w=600&auto=format&fit=crop&q=60" },
];

type FeaturedCardProps = { title: string; subtitle: string; imageUrl: string; };

const FeaturedCard = ({ title, subtitle, imageUrl }: FeaturedCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
      <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.featuredCardBackground}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.textOverlay}>
            <Text style={styles.featuredTitle}>{title}</Text>
            <Text style={styles.featuredSubtitle}>{subtitle}</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
};

const Scrolling = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % offersData.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * SNAP_INTERVAL, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
        onMomentumScrollEnd={handleScroll}
      >
        {offersData.map((offer, index) => (
          <FeaturedCard key={index} {...offer} />
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {offersData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index ? styles.activeDot : {}]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: CARD_MARGIN / 2,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,111,97,0.5)',
  },
  featuredCardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  textOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 10,
    borderRadius: 15,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dcdcdc',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fe6f61',
  },
});

export default Scrolling;

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Animated as RNAnimated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Sample Data ---
const teams = [
  { id: 't1', name: 'Roaring Lions', mascot: '🦁' },
  { id: 't2', name: 'Speedy Foxes', mascot: '🦊' },
  { id: 't3', name: 'Brave Bears', mascot: '🐻' },
  { id: 't4', name: 'Silly Monkeys', mascot: '🐒' },
];

// --- Kids Football Screen Component ---
const KidsFootballScreen = () => {
  const router = useRouter();
  const [score, setScore] = useState({ home: 0, away: 0 });
  const pressAnim = useRef(new RNAnimated.Value(1)).current;

  const handlePressIn = () => {
    RNAnimated.spring(pressAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleGoal = () => {
    setScore(prevScore => {
      const isHomeGoal = Math.random() > 0.5;
      return {
        home: isHomeGoal ? prevScore.home + 1 : prevScore.home,
        away: !isHomeGoal ? prevScore.away + 1 : prevScore.away,
      };
    });
  };

  const animatedStyle = {
    transform: [{ scale: pressAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Kids Football Fun!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreBoard}>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team A</Text>
            <Text style={styles.scoreText}>{score.home}</Text>
          </View>
          <Text style={styles.vsText}>-</Text>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team B</Text>
            <Text style={styles.scoreText}>{score.away}</Text>
          </View>
        </View>

        <RNAnimated.View style={[styles.buttonContainer, animatedStyle]}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handleGoal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.playButtonText}>Make a Goal! ⚽</Text>
          </TouchableOpacity>
        </RNAnimated.View>

        <Text style={styles.sectionTitle}>Meet the Mascots!</Text>
        <View style={styles.mascotContainer}>
          {teams.map((team) => (
            <View key={team.id} style={styles.mascotCard}>
              <Text style={styles.mascotEmoji}>{team.mascot}</Text>
              <Text style={styles.mascotName}>{team.name}</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  vsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  mascotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  mascotCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: 120,
  },
  mascotEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  mascotName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default KidsFootballScreen;
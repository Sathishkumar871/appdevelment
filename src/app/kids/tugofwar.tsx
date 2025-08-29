import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// --- Tug of War Screen Component ---
const TugOfWarScreen = () => {
  const router = useRouter();
  const ropePosition = useSharedValue(0); // 0 is the center, negative is Team A, positive is Team B

  const pullRope = (team: 'A' | 'B') => {
    // Pull the rope a little bit towards the selected team
    const pullAmount = team === 'A' ? -20 : 20;
    ropePosition.value = withSpring(ropePosition.value + pullAmount, {
      damping: 15,
      stiffness: 100,
    });
  };

  const animatedRopeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: ropePosition.value }],
    };
  });

  const getTeamColor = (team: 'A' | 'B') => {
    const position = ropePosition.value;
    if (Math.abs(position) > 100) {
      return team === 'A' ? (position < 0 ? '#4CAF50' : '#FF5252') : (position > 0 ? '#4CAF50' : '#FF5252');
    }
    return 'rgba(255,255,255,0.4)';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <LinearGradient
        colors={['#8E44AD', '#9B59B6']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Tug of War!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.gameArea}>
          {/* Team A Side */}
          <View style={[styles.teamZone, { borderRightWidth: 1, borderColor: '#fff' }]}>
            <Text style={styles.teamName}>Team A</Text>
            <TouchableOpacity onPress={() => pullRope('A')} style={styles.pullButton}>
              <Text style={styles.pullButtonText}>PULL!</Text>
            </TouchableOpacity>
          </View>
          {/* Team B Side */}
          <View style={styles.teamZone}>
            <Text style={styles.teamName}>Team B</Text>
            <TouchableOpacity onPress={() => pullRope('B')} style={styles.pullButton}>
              <Text style={styles.pullButtonText}>PULL!</Text>
            </TouchableOpacity>
          </View>
          {/* Animated Rope */}
          <Animated.View style={[styles.rope, animatedRopeStyle]} />
          <View style={styles.centerLine} />
        </View>

        <View style={styles.instructionBox}>
          <Ionicons name="information-circle" size={20} color="#fff" />
          <Text style={styles.instructionsText}>
            Tap the "PULL!" button to help your team win!
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameArea: {
    flexDirection: 'row',
    width: '90%',
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  teamZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  teamName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  pullButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  pullButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  centerLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    left: '50%',
  },
  rope: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: '#A0522D',
    top: '50%',
    marginTop: -5,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    width: '90%',
  },
  instructionsText: {
    color: '#fff',
    marginLeft: 10,
  },
});

export default TugOfWarScreen;
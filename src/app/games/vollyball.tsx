import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Sample Data for Volleyball Matches ---
const matches = [
  {
    id: 'vm1',
    team1: 'Team Sky',
    team2: 'Team Thunder',
    status: 'Live',
    score1: '25-23, 21-25',
    score2: '25-23, 21-25',
    sets: '1-1',
    venue: 'Indoor Court 3',
  },
  {
    id: 'vm2',
    team1: 'Team Raptors',
    team2: 'Team Eagles',
    status: 'Upcoming',
    date: 'SEP 29',
    time: '2:00 PM',
  },
  {
    id: 'vm3',
    team1: 'Team Warriors',
    team2: 'Team Vikings',
    status: 'Completed',
    winner: 'Team Warriors',
    score: '3-0',
  },
  {
    id: 'vm4',
    team1: 'Team Phoenix',
    team2: 'Team Titans',
    status: 'Upcoming',
    date: 'OCT 01',
    time: '6:30 PM',
  },
];

// --- Volleyball Screen Component ---
const VolleyballScreen = () => {
  const router = useRouter();

  const [liveMatch, setLiveMatch] = useState(matches.find(m => m.status === 'Live'));
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  // Simple live score update (dummy data for demonstration)
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to fetch live score updates from an API
      setLiveMatch(prev => {
        if (!prev || prev.status !== 'Live') return prev;
        const newScore = `${Math.floor(Math.random() * 25)}-${Math.floor(Math.random() * 25)}`;
        const newSets = prev.sets; // For simplicity, sets remain constant
        return { ...prev, score1: newScore, score2: newScore, sets: newSets };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- UI Components for the Screen ---
  const LiveMatchCard = ({ match }) => (
    <View style={styles.liveCard}>
      <LinearGradient
        colors={['#0077B6', '#0096C7']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.liveHeader}>
        <Text style={styles.liveStatus}>🔴 LIVE</Text>
        <Text style={styles.liveVenue}>{match.venue}</Text>
      </View>
      <View style={styles.liveScoreContainer}>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{match.team1}</Text>
          <Text style={styles.scoreText}>{match.sets}</Text>
          <Text style={styles.oversText}>({match.score1})</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{match.team2}</Text>
          <Text style={styles.scoreText}>{match.sets}</Text>
          <Text style={styles.oversText}>({match.score2})</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Watch Live</Text>
      </TouchableOpacity>
    </View>
  );

  const MatchFixtureCard = ({ match }) => (
    <View style={styles.fixtureCard}>
      <Text style={styles.fixtureDate}>{match.date}, {match.time}</Text>
      <View style={styles.fixtureTeams}>
        <Text style={styles.fixtureTeamName}>{match.team1}</Text>
        <Text style={styles.fixtureVsText}>vs</Text>
        <Text style={styles.fixtureTeamName}>{match.team2}</Text>
      </View>
    </View>
  );

  const CompletedMatchCard = ({ match }) => (
    <View style={styles.completedCard}>
      <Text style={styles.completedTitle}>Final Score</Text>
      <Text style={styles.completedTeams}>{match.team1} vs {match.team2}</Text>
      <Text style={styles.completedWinner}>Winner: {match.winner}</Text>
      <Text style={styles.completedScore}>Score: {match.score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#023E73" />
      <LinearGradient
        colors={['#023E73', '#004780']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Volleyball Hub</Text>
        </View>

        {liveMatch && (
          <View>
            <Text style={styles.sectionTitle}>Live Match</Text>
            <LiveMatchCard match={liveMatch} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        <FlatList
          horizontal
          data={upcomingMatches}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => <MatchFixtureCard match={item} />}
        />

        <Text style={styles.sectionTitle}>Recent Results</Text>
        <FlatList
          horizontal
          data={completedMatches}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => <CompletedMatchCard match={item} />}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet for the Volleyball Screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023E73',
  },
  scrollViewContent: {
    paddingBottom: 50,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  // Live Match Card Styles
  liveCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveStatus: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  liveVenue: {
    color: '#ccc',
    fontSize: 14,
  },
  liveScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  oversText: {
    color: '#ccc',
    fontSize: 14,
  },
  vsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Fixture Card Styles
  fixtureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    width: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  fixtureDate: {
    color: '#fff',
    fontSize: 14,
  },
  fixtureTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fixtureTeamName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fixtureVsText: {
    color: '#ccc',
    marginHorizontal: 5,
  },

  // Completed Match Card Styles
  completedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    width: 250,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  completedTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  completedTeams: {
    color: '#ccc',
    fontSize: 14,
  },
  completedWinner: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 16,
  },
  completedScore: {
    color: '#eee',
    fontSize: 12,
  },
});

export default VolleyballScreen;
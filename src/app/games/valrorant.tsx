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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Sample Data for Valorant Matches & Agents ---
const matches = [
  {
    id: 'v1',
    team1: 'Sentinels',
    team2: 'Cloud9',
    status: 'Live',
    score1: 10,
    score2: 8,
    map: 'Split',
    venue: 'VCT Americas League',
  },
  {
    id: 'v2',
    team1: 'Fnatic',
    team2: 'Loud',
    status: 'Upcoming',
    date: 'SEP 29',
    time: '8:00 PM',
  },
  {
    id: 'v3',
    team1: 'Evil Geniuses',
    team2: 'Paper Rex',
    status: 'Completed',
    winner: 'Evil Geniuses',
    score: '13-7',
    map: 'Ascent',
  },
];

const agents = [
  { id: 'a1', name: 'Jett', role: 'Duelist', image: 'https://cdn.dribbble.com/users/79331/screenshots/11546960/valorant_agents_jett.jpg' },
  { id: 'a2', name: 'Sova', role: 'Initiator', image: 'https://cdn.dribbble.com/users/79331/screenshots/11546960/valorant_agents_sova.jpg' },
  { id: 'a3', name: 'Sage', role: 'Sentinel', image: 'https://cdn.dribbble.com/users/79331/screenshots/11546960/valorant_agents_sage.jpg' },
  { id: 'a4', name: 'Viper', role: 'Controller', image: 'https://cdn.dribbble.com/users/79331/screenshots/11546960/valorant_agents_viper.jpg' },
];

// --- Valorant Screen Component ---
const ValorantScreen = () => {
  const router = useRouter();

  const [liveMatch, setLiveMatch] = useState(matches.find(m => m.status === 'Live'));
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  // Simple live score update (dummy data)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatch(prev => {
        if (!prev || prev.status !== 'Live') return prev;
        const newScore = prev.score1 + 1;
        return { ...prev, score1: newScore };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- UI Components for the Screen ---
  const LiveMatchCard = ({ match }) => (
    <View style={styles.liveCard}>
      <LinearGradient
        colors={['#FF4655', '#E31E2A']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.liveHeader}>
        <Text style={styles.liveStatus}>🔴 LIVE</Text>
        <Text style={styles.liveVenue}>{match.venue}</Text>
      </View>
      <View style={styles.liveScoreContainer}>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{match.team1}</Text>
          <Text style={styles.scoreText}>{match.score1}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{match.team2}</Text>
          <Text style={styles.scoreText}>{match.score2}</Text>
        </View>
      </View>
      <Text style={styles.mapText}>Map: {match.map}</Text>
      <TouchableOpacity onPress={() => {}} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Watch Live</Text>
      </TouchableOpacity>
    </View>
  );

  const AgentCard = ({ agent }) => (
    <View style={styles.agentCard}>
      <Image source={{ uri: agent.image }} style={styles.agentImage} />
      <View style={styles.agentInfo}>
        <Text style={styles.agentName}>{agent.name}</Text>
        <Text style={styles.agentRole}>{agent.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2326" />
      <LinearGradient
        colors={['#1F2326', '#31383A']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Valorant Hub</Text>
        </View>

        {liveMatch && (
          <View>
            <Text style={styles.sectionTitle}>Live Match</Text>
            <LiveMatchCard match={liveMatch} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Agent Roles</Text>
        <Text style={styles.subtitle}>Click on a role to learn more about it!</Text>
        <View style={styles.agentRolesContainer}>
          <TouchableOpacity style={styles.roleButton}><Text style={styles.roleButtonText}>Duelist</Text></TouchableOpacity>
          <TouchableOpacity style={styles.roleButton}><Text style={styles.roleButtonText}>Initiator</Text></TouchableOpacity>
          <TouchableOpacity style={styles.roleButton}><Text style={styles.roleButtonText}>Controller</Text></TouchableOpacity>
          <TouchableOpacity style={styles.roleButton}><Text style={styles.roleButtonText}>Sentinel</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Agents</Text>
        <FlatList
          horizontal
          data={agents}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => <AgentCard agent={item} />}
        />

        <Text style={styles.sectionTitle}>Recent Match Results</Text>
        <FlatList
          horizontal
          data={completedMatches}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View style={styles.completedCard}>
              <Text style={styles.completedTitle}>Final Score</Text>
              <Text style={styles.completedTeams}>{item.team1} vs {item.team2}</Text>
              <Text style={styles.completedWinner}>Winner: {item.winner}</Text>
              <Text style={styles.completedScore}>Score: {item.score}</Text>
              <Text style={styles.completedScore}>Map: {item.map}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet for the Valorant Screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2326',
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
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
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
  vsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapText: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
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
  // Agent Roles
  agentRolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#FF4655',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  roleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Agent Card Styles
  agentCard: {
    backgroundColor: '#383E46',
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    width: 140,
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  agentImage: {
    width: '100%',
    height: 120,
  },
  agentInfo: {
    padding: 10,
    alignItems: 'center',
  },
  agentName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  agentRole: {
    color: '#ccc',
    fontSize: 12,
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

export default ValorantScreen;
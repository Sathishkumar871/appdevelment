import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Linking,
  Alert,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Reanimated for complex animations
import AnimatedReanimated from 'react-native-reanimated';

// --- A Simple Reusable Button Component ---
const Button = ({ onPress, title, style, textStyle, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style, disabled && styles.buttonDisabled]}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

// --- Interface for Tournaments and Teams (remains the same) ---
interface Team {
  name: string;
  points: number;
}

interface Tournament {
  id: number;
  date: string;
  time: string;
  name: string;
  hostedBy: string;
  status: 'Open' | 'Live' | 'Completed' | 'Waiting';
  teamSize: string;
  image: string;
  homeImage?: string;
  liveStreamUrl?: string;
  prizePool: string;
  rules: string[];
  venue: string;
  bookingOpens: string;
  registeredTeams: Team[];
  registeredMembersCount: number;
}

// --- Initial Tournament Data (remains the same) ---
const initialTournaments: Tournament[] = [
  {
    id: 1,
    date: 'SEP 06, 2025',
    time: '12:00 PM',
    name: 'DARK DEMONS',
    hostedBy: 'COSMOS • Ind...',
    status: 'Open',
    teamSize: '1v1',
    image: 'https://ik.imagekit.io/pimx50ija/a10b4aeb2ed3e55021954e9e0c6f46da.jpg?updatedAt=1755529182983',
    homeImage: 'https://ik.imagekit.io/pimx50ija/5741f98c94fcddb5f3df4c1f21d8d411.jpg?updatedAt=1755529107252',
    prizePool: '₹5,000',
    rules: ['1 vs 1 match', 'No hacks allowed', 'Match time: 10 mins', 'Highest kill wins'],
    venue: 'To be Announced',
    bookingOpens: 'AUG 28, 2025',
    registeredTeams: [],
    registeredMembersCount: 0,
  },
  {
    id: 2,
    date: 'AUG 13, 2025',
    time: '07:00 PM',
    name: 'El mejor',
    hostedBy: 'Mccloving Free...',
    status: 'Live',
    teamSize: '1v1',
    image: 'https://ik.imagekit.io/pimx50ija/fa16c1fbedf78148009999701ceb7088.jpg?updatedAt=1755529050548',
    liveStreamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    prizePool: '₹10,000',
    rules: ['1 vs 1 match', 'No hacks allowed', 'Match time: 10 mins', 'Highest kill wins'],
    venue: 'Online',
    bookingOpens: 'AUG 01, 2025',
    registeredTeams: [{ name: 'Team Alpha', points: 150 }, { name: 'Team Beta', points: 120 }],
    registeredMembersCount: 50,
  },
  {
    id: 3,
    date: 'SEP 15, 2025',
    time: '08:30 PM',
    name: 'Pro Game - 2v2',
    hostedBy: 'esports',
    status: 'Open',
    teamSize: '2v2',
    image: 'https://ik.imagekit.io/pimx50ija/989837009ed106b791ed2c448ae2e31c.jpg?updatedAt=1755528995793',
    prizePool: '₹20,000',
    rules: ['2 vs 2 match', 'Team coordination required', 'Match time: 15 mins'],
    venue: 'To be Announced',
    bookingOpens: 'SEP 10, 2025',
    registeredTeams: [],
    registeredMembersCount: 0,
  },
  {
    id: 4,
    date: 'SEP 17, 2025',
    time: '03:00 PM',
    name: 'Squad Battle',
    hostedBy: 'Elite Gamers',
    status: 'Open',
    teamSize: '4v4',
    image: 'https://ik.imagekit.io/pimx50ija/0c6145222ef8a3b420f4e6f7cfb15cb1.jpg?updatedAt=1755528694210',
    prizePool: '₹50,000',
    rules: ['4 vs 4 match', 'Team coordination required'],
    venue: 'To be Announced',
    bookingOpens: 'SEP 10, 2025',
    registeredTeams: [],
    registeredMembersCount: 0,
  },
];

const FreeFireScreen = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'live' | 'ranking' | 'schedule' | 'details' | 'liveStream'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'upload' | 'confirm'>('details');
  const [teamName, setTeamName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentScreenshotUri, setPaymentScreenshotUri] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const notificationAnim = useRef(new Animated.Value(-100)).current;
  const [tournaments] = useState<Tournament[]>(initialTournaments);

  // Background animation setup
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const backgroundColorInterpolate = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1a1a1a', '#2a2a2a'],
  });

  const gradientColors = [
    '#2c3e50',
    '#34495e',
    '#444444',
  ];

  const gradientColorsAnim = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      ['#1a1a1a', '#2a2a2a', '#34495e'],
      ['#2a2a2a', '#34495e', '#1a1a1a'],
    ],
  });

  // Notification animation
  useEffect(() => {
    if (notification) {
      Animated.spring(notificationAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('home');
      setSelectedTournament(null);
      setIsBookingModalOpen(false);
      setIsSupportModalOpen(false);
    }, [])
  );

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleBookClick = (tournament: Tournament) => {
    if (tournament.teamSize !== '1v1') {
      showNotification("Booking for this mode will open after the 1v1 tournament is completed.", 'error');
      return;
    }
    setSelectedTournament(tournament);
    setBookingStep('details');
    setTeamName('');
    setMobileNumber('');
    setPaymentScreenshotUri(null);
    setBookingId('');
    setIsBookingModalOpen(true);
  };

  const handleWatchLiveClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setActiveTab('liveStream');
  };

  const handleViewDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setActiveTab('details');
  };

  const handleProceedToPayment = () => {
    if (!teamName) {
      showNotification("Please enter your team name.", 'error');
      return;
    }
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      showNotification("Please enter a valid 10-digit mobile number.", 'error');
      return;
    }
    setBookingStep('payment');
  };

  const handlePaymentDone = () => {
    setBookingStep('upload');
  };

  const handleScreenshotUpload = async () => {
    Alert.alert("Upload not implemented", "This feature needs a separate library for file uploads.");
    setPaymentScreenshotUri("https://placehold.co/100x100?text=Uploaded");
  };

  const handleSubmitProof = () => {
    if (!paymentScreenshotUri) {
      showNotification("Please upload the payment screenshot.", 'error');
      return;
    }
    const randomId = `${selectedTournament?.name.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(randomId);

    const message = `--- New Tournament Booking ---\nTournament: ${selectedTournament?.name}\nTeam Name: ${teamName}\nMobile: ${mobileNumber}\nBooking ID: ${randomId}\n-----------------------------\nI have uploaded the payment screenshot. Please verify and confirm my slot.`;
    const whatsappUrl = `https://wa.me/918179477995?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl);

    setBookingStep('confirm');
  };

  const handleCustomerSupport = () => {
    setIsSupportModalOpen(true);
  };

  const renderActionButton = (tournament: Tournament) => {
    if (tournament.status === 'Live') {
      return (
        <Button
          title="Watch Live"
          style={styles.ctaButtonLive}
          onPress={(e) => { e.stopPropagation(); handleWatchLiveClick(tournament); }}
        />
      );
    } else if (tournament.status === 'Open') {
      const now = new Date();
      const bookingOpenDate = new Date(tournament.bookingOpens);
      now.setHours(0, 0, 0, 0);
      bookingOpenDate.setHours(0, 0, 0, 0);

      if (now < bookingOpenDate) {
        return (
          <Button
            title={`Booking starts ${tournament.bookingOpens.split(',')[0]}`}
            style={styles.ctaButtonDisabled}
            disabled={true}
          />
        );
      }
      return (
        <Button
          title="Book Now"
          style={styles.ctaButtonBook}
          onPress={(e) => { e.stopPropagation(); handleBookClick(tournament); }}
        />
      );
    } else {
      return null;
    }
  };

  const renderContent = () => {
    const liveTournaments = tournaments.filter(t => t.status === 'Live');
    const upcomingTournaments = tournaments.filter(t => t.status === 'Open' || t.status === 'Waiting');
    const completedTournaments = tournaments.filter(t => t.status === 'Completed');

    if (activeTab === 'liveStream' && selectedTournament) {
      return (
        <ScrollView style={styles.liveStreamPage}>
          <TouchableOpacity onPress={() => setActiveTab('live')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.liveHeader}>
            <Text style={styles.liveStreamTitle}>{selectedTournament.name} - LIVE</Text>
            <View style={styles.liveScoreboard}>
              <Text>{selectedTournament.registeredTeams[0]?.name || 'Team 1'}: 150</Text>
              <Text>{selectedTournament.registeredTeams[1]?.name || 'Team 2'}: 120</Text>
            </View>
          </View>
          <Text style={styles.placeholderText}>Video Player not implemented. Use react-native-webview.</Text>
          <View style={styles.liveInfoPanel}>
            <Text style={styles.liveInfoTitle}>Live Leaderboard</Text>
            <View style={styles.liveLeaderboard}>
              {selectedTournament.registeredTeams.sort((a, b) => b.points - a.points).map((team, index) => (
                <View key={index} style={styles.leaderboardItem}>
                  <Text>{index + 1}. {team.name}</Text>
                  <Text>{team.points} Points</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'details' && selectedTournament) {
      return (
        <ScrollView style={styles.detailsPage}>
          <TouchableOpacity onPress={() => setActiveTab('tournaments')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.detailsHeader}>
            <Image source={{ uri: selectedTournament.image }} style={styles.detailsImage} />
            <View style={styles.detailsHeaderInfo}>
              <Text style={styles.detailsTitle}>{selectedTournament.name}</Text>
              <Text>Hosted by {selectedTournament.hostedBy}</Text>
              <View style={styles.actionButtons}>
                {renderActionButton(selectedTournament)}
              </View>
            </View>
          </View>
          <View style={styles.detailsBody}>
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Prize Pool</Text>
              <Text style={styles.prizePoolText}>{selectedTournament.prizePool}</Text>
            </View>
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Venue</Text>
              <Text>{selectedTournament.venue}</Text>
            </View>
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Tournament Rules</Text>
              {selectedTournament.rules.map((rule, index) => (
                <Text key={index} style={styles.ruleItem}>• {rule}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.homeDashboard}>
            <Text style={styles.sectionTitle}>Live Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentListHorizontal}>
              {liveTournaments.map(t => (
                <TouchableOpacity key={t.id} style={styles.tournamentCardWide} onPress={() => handleWatchLiveClick(t)}>
                  <Image source={{ uri: t.image }} style={styles.cardImageWide} />
                  <Text>{t.name}</Text>
                  <Button title="WATCH LIVE" style={styles.liveButton} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
            <View style={styles.tournamentList}>
              {upcomingTournaments.map(t => (
                <TouchableOpacity key={t.id} style={styles.tournamentCard} onPress={() => handleViewDetails(t)}>
                  <Image source={{ uri: t.homeImage || t.image }} style={styles.cardImage} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{t.name}</Text>
                    <Text>{t.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      case 'tournaments':
        return (
          <ScrollView style={styles.fullTournamentList}>
            <Text style={styles.screenTitle}>Upcoming Tournaments</Text>
            {upcomingTournaments.map(t => (
              <TouchableOpacity key={t.id} style={styles.tournamentCard} onPress={() => handleViewDetails(t)}>
                <Image source={{ uri: t.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{t.name}</Text>
                  <Text>{t.date} @ {t.time}</Text>
                  <Text style={styles.prizePool}>Prize Pool: {t.prizePool}</Text>
                </View>
                {renderActionButton(t)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 'live':
        return (
          <ScrollView style={styles.fullTournamentList}>
            <Text style={styles.screenTitle}>Live Tournaments</Text>
            {liveTournaments.map(t => (
              <TouchableOpacity key={t.id} style={styles.tournamentCard} onPress={() => handleWatchLiveClick(t)}>
                <Image source={{ uri: t.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{t.name}</Text>
                  <Text style={styles.liveText}>LIVE NOW</Text>
                </View>
                {renderActionButton(t)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 'ranking':
        return (
          <ScrollView style={styles.rankingPage}>
            <Text style={styles.screenTitle}>Leaderboards</Text>
            {completedTournaments.map(t => (
              <View key={t.id} style={styles.leaderboardCard}>
                <Text style={styles.leaderboardTitle}>{t.name} - Final Standings</Text>
                <View>
                  {t.registeredTeams.sort((a, b) => b.points - a.points).map((team, index) => (
                    <View key={index} style={[styles.leaderboardItem, index === 0 && styles.firstPlaceItem]}>
                      <Text style={[styles.leaderboardRank, index === 0 && styles.firstPlaceText]}>{index + 1}. {team.name}</Text>
                      <Text style={styles.leaderboardPoints}>{team.points} Points</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        );
      case 'schedule':
        return (
          <ScrollView style={styles.schedulePage}>
            <Text style={styles.screenTitle}>Tournament Schedule</Text>
            <Text style={styles.placeholderText}>Schedule view goes here.</Text>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.appContainer}>
      <Animated.View style={[styles.animatedBackground, { backgroundColor: backgroundColorInterpolate }]}>
        <LinearGradient
          colors={gradientColors}
          start={[0.1, 0.1]}
          end={[0.9, 0.9]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <Animated.View style={[styles.notificationContainer, { transform: [{ translateY: notificationAnim }] }]}>
        {notification && (
          <View style={[styles.notification, styles[notification.type]]}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.freefireApp}>
        <View style={styles.header}>
          <Text style={styles.mainLogo}>FreeFire Esports</Text>
          <TouchableOpacity style={styles.customerSupportBtn} onPress={handleCustomerSupport}>
            <Text style={styles.customerSupportText}>Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity style={[styles.navItem, activeTab === 'home' && styles.navItemActive]} onPress={() => setActiveTab('home')}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, activeTab === 'tournaments' && styles.navItemActive]} onPress={() => setActiveTab('tournaments')}>
            <Text style={styles.navText}>Tournaments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, activeTab === 'live' && styles.navItemActive]} onPress={() => setActiveTab('live')}>
            <Text style={styles.navText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, activeTab === 'ranking' && styles.navItemActive]} onPress={() => setActiveTab('ranking')}>
            <Text style={styles.navText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, activeTab === 'schedule' && styles.navItemActive]} onPress={() => setActiveTab('schedule')}>
            <Text style={styles.navText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.mainContent}>
          {renderContent()}
        </ScrollView>
        
        <View style={styles.policySection}>
          <Text style={styles.policyText}>Our website does not encourage any fraud. You will be disqualified if you make any mistakes.</Text>
        </View>
      </View>

      <Modal visible={isBookingModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {bookingStep === 'details' && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Book Your Slot (Step 1 of 4)</Text>
                <Text style={styles.modalInstruction}>To join, please provide your details. Our team will call you for confirmation.</Text>
                <View style={styles.trustBadge}>
                  <Text style={styles.trustBadgeText}>🎁 <Text style={{ fontWeight: 'bold' }}>Share & Win:</Text> A special gift will be given to the person who shares this tournament the most!</Text>
                </View>
                <View style={styles.formContainer}>
                  <Text style={styles.formLabel}>Your Team Name (or Game Name)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={teamName}
                    onChangeText={setTeamName}
                    placeholder="Enter your team name"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.formLabel}>Your 10-Digit Mobile Number</Text>
                  <TextInput
                    style={styles.formInput}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <View style={styles.modalButtons}>
                    <Button title="Proceed to Payment" style={styles.ctaButton} onPress={handleProceedToPayment} />
                    <Button title="Cancel" style={styles.closeButton} onPress={() => setIsBookingModalOpen(false)} />
                  </View>
                </View>
              </ScrollView>
            )}

            {bookingStep === 'payment' && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Pay Entry Fee (Step 2 of 4)</Text>
                <View style={styles.trustBadge}>
                  <Text style={styles.trustBadgeText}>
                    <Text style={{ fontWeight: 'bold' }}>Note:</Text> After payment, our team will call you to confirm your slot. If you are not satisfied, your money will be fully refunded before the tournament date.
                  </Text>
                </View>
                <Text style={styles.paymentInstructions}>
                  Please scan the QR code below to pay the entry fee of <Text style={{ fontWeight: 'bold' }}>₹50</Text>. The amount is automatically set.
                </Text>
                <Image
                  source={{ uri: "https://ik.imagekit.io/pimx50ija/WhatsApp%20Image%202025-08-19%20at%2012.02.46_5f461ad5.jpg?updatedAt=1755585267709" }}
                  style={styles.qrCode}
                />
                <View style={styles.modalButtons}>
                  <Button title="I have Paid, Next" style={styles.ctaButton} onPress={handlePaymentDone} />
                  <Button title="Back" style={styles.closeButton} onPress={() => setBookingStep('details')} />
                </View>
              </ScrollView>
            )}
            
            {bookingStep === 'upload' && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Upload Payment Proof (Step 3 of 4)</Text>
                <Text style={styles.modalInstruction}>To verify your payment, please upload a screenshot of the successful transaction.</Text>
                <View>
                  <Button title="Select Screenshot" onPress={handleScreenshotUpload} />
                  {paymentScreenshotUri && <Text style={styles.fileName}>Selected: {paymentScreenshotUri.split('/').pop()}</Text>}
                  <View style={styles.modalButtons}>
                    <Button title="Submit Proof & Get Code" style={styles.ctaButton} onPress={handleSubmitProof} />
                    <Button title="Back" style={styles.closeButton} onPress={() => setBookingStep('payment')} />
                  </View>
                </View>
              </ScrollView>
            )}

            {bookingStep === 'confirm' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Booking Submitted! (Step 4 of 4)</Text>
                <Text style={styles.successMessage}>Thank you! Your booking request has been submitted.</Text>
                <Text style={styles.confirmationText}>Please save this confirmation code:</Text>
                <Text style={styles.bookingId}>{bookingId}</Text>
                <Text style={styles.confirmationText}>Our team will verify your payment and call you on <Text style={{ fontWeight: 'bold' }}>{mobileNumber}</Text> to confirm your slot. Please send your screenshot on WhatsApp if prompted.</Text>
                <View style={styles.modalButtons}>
                  <Button title="Close" style={styles.closeButton} onPress={() => setIsBookingModalOpen(false)} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={isSupportModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Customer Support</Text>
            <Text style={styles.modalInstruction}>For immediate assistance, please contact us on WhatsApp.</Text>
            <Button
              title="Contact on WhatsApp"
              style={styles.whatsappButton}
              onPress={() => Linking.openURL("https://wa.me/918179477995")}
            />
            <Button title="Close" style={styles.closeButton} onPress={() => setIsSupportModalOpen(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

// --- StyleSheet and other styles ---
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 50,
    alignItems: 'center',
  },
  notification: {
    padding: 15,
    borderRadius: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: 'green',
  },
  error: {
    backgroundColor: 'red',
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  freefireApp: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerSupportBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customerSupportText: {
    color: '#fff',
    fontSize: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingBottom: 20,
  },
  homeDashboard: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tournamentListHorizontal: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  tournamentCardWide: {
    width: 250,
    height: 150,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  cardImageWide: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  tournamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  prizePool: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  liveText: {
    color: 'red',
    fontWeight: 'bold',
  },
  detailsPage: {
    flex: 1,
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
  },
  detailsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  detailsHeaderInfo: {
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  detailsBody: {
    marginTop: 20,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ruleItem: {
    color: '#ccc',
    marginBottom: 5,
  },
  prizePoolText: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalInstruction: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15,
  },
  trustBadge: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  trustBadgeText: {
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  formLabel: {
    color: '#fff',
    marginBottom: 5,
  },
  formInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  fileName: {
    color: '#ccc',
    marginBottom: 10,
  },
  successMessage: {
    color: 'lightgreen',
    textAlign: 'center',
    marginBottom: 10,
  },
  bookingId: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmationText: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: '#E74C3C',
  },
  closeButton: {
    backgroundColor: '#555',
  },
  ctaButtonBook: {
    backgroundColor: '#E74C3C',
  },
  ctaButtonLive: {
    backgroundColor: 'red',
  },
  ctaButtonDisabled: {
    backgroundColor: '#888',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  fullTournamentList: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rankingPage: {
    flex: 1,
  },
  leaderboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leaderboardRank: {
    color: '#fff',
  },
  leaderboardPoints: {
    color: '#E74C3C',
  },
  firstPlaceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
  },
  firstPlaceText: {
    color: 'gold',
  },
  policySection: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    alignItems: 'center',
  },
  policyText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default FreeFireScreen;
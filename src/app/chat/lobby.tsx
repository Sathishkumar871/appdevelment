import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  getDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/firebasedata';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MemberAvatar = ({ name, avatar, isOwner }) => (
  <View style={styles.memberCard}>
    {isOwner && <FontAwesome name="star" size={14} color="#FFD700" style={styles.ownerCrown} />}
    <Image
      source={{ uri: avatar }}
      style={styles.memberAvatarImg}
    />
    <Text numberOfLines={1} style={styles.memberName}>{name}</Text>
  </View>
);

interface RoomInfo {
  id: string;
  name: string;
  category: string;
  language: string;
  level: 'Any Level' | 'Beginner' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';
  maxMembers: number;
  currentMembers: { name: string; avatar: string; roses: number }[];
  owner: string;
  createdAt: number;
}

const languages = ['All', 'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Spanish', 'French', 'Japanese', 'German'];
const levels: RoomInfo['level'][] = ['Any Level', 'Beginner', 'Intermediate', 'Upper Intermediate', 'Advanced'];
const memberCounts = [4, 6, 8, 10, 12, 15];

const { width } = Dimensions.get('window');
const Lobby = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [tempUserName, setTempUserName] = useState<string>('');
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeLanguage, setActiveLanguage] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomLanguage, setNewRoomLanguage] = useState<string>('English');
  const [newRoomLevel, setNewRoomLevel] = useState<RoomInfo['level']>('Any Level');
  const [newRoomMembers, setNewRoomMembers] = useState<number>(10);
  useEffect(() => {
    const loadUserName = async () => {
      const savedName = await AsyncStorage.getItem('display_name');
      if (savedName) {
        setUserName(savedName);
        setTempUserName(savedName);
      } else {
        setShowNameModal(true);
      }
    };
    loadUserName();
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedRooms: RoomInfo[] = [];
      querySnapshot.forEach(docSnap => {
          fetchedRooms.push({ id: docSnap.id, ...docSnap.data() } as RoomInfo);
      });
      setRooms(fetchedRooms);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const results = rooms.filter(room => {
      const languageMatch = activeLanguage === 'All' || room.language === activeLanguage;
      const searchMatch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.language.toLowerCase().includes(searchTerm.toLowerCase());
      return languageMatch && searchMatch;
    });
    setFilteredRooms(results);
  }, [searchTerm, activeLanguage, rooms]);


  const scheduleInactivityCheck = (roomId: string) => {
    setTimeout(async () => {
      const roomDocRef = doc(db, 'rooms', roomId);
      try {
        const roomSnap = await getDoc(roomDocRef);
        if (roomSnap.exists()) {
          const roomData = roomSnap.data();
          if (roomData.currentMembers && roomData.currentMembers.length === 1) {
            console.log(`Deleting inactive room ${roomId} after 30 seconds.`);
            await deleteDoc(roomDocRef);
          }
        }
      } catch (error) {
        console.error("Error in scheduled inactivity deletion: ", error);
      }
    }, 30000); 
  };

  const handleJoinRoom = (room: RoomInfo) => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }
    if (room.currentMembers.some(member => member.name === userName)) {
      router.push(`/room/${room.id}?user=${userName}`);
      return;
    }
    if (room.currentMembers.length >= room.maxMembers) {
      Alert.alert('Group Full', `Sorry, the group "${room.name}" is full.`);
      return;
    }

    router.push(`/room/${room.id}?user=${userName}`);

    const updateFirestoreAndStorage = async () => {
      try {
        const roomDocRef = doc(db, 'rooms', room.id);
        const newMember = { name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 };
        await updateDoc(roomDocRef, {
          currentMembers: arrayUnion(newMember),
        });
        await AsyncStorage.setItem('current_room_id', room.id);
      } catch (e) {
        console.error('Error joining room in background:', e);
      }
    };
    updateFirestoreAndStorage();
  };
  const createAndNavigate = async (newRoomData) => {
    try {
      const newDocRef = await addDoc(collection(db, 'rooms'), newRoomData);
      const newRoomId = newDocRef.id;
      await AsyncStorage.setItem('current_room_id', newRoomId);
      router.push(`/room/${newRoomId}?user=${userName}`);
      scheduleInactivityCheck(newRoomId);
      
      return true;
    } catch (e) {
      console.error('Error creating room: ', e);
      Alert.alert('Error', 'Failed to create group. Please try again.');
      return false;
    }
  };

  const handleCreateRoomSubmit = async () => {
    if (!newRoomName.trim() || !userName) {
      Alert.alert('Error', 'Please provide a group name.');
      return;
    }
    const newRoom = {
      name: newRoomName.trim(),
      language: newRoomLanguage,
      level: newRoomLevel,
      maxMembers: newRoomMembers,
      currentMembers: [{ name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 }],
      owner: userName,
      createdAt: Date.now(),
    };
    
    const success = await createAndNavigate(newRoom);
    if (success) {
      setShowCreateModal(false);
      setNewRoomName('');
      setNewRoomLevel('Any Level');
      setNewRoomMembers(10);
    }
  };
  const handleAutoCreateRoom = async () => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }
    const randomRoomName = `Fun Hangout #${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoomData = {
      name: randomRoomName,
      language: 'English',
      level: 'Any Level' as RoomInfo['level'],
      maxMembers: 10,
      currentMembers: [{ name: userName, avatar: `https://i.pravatar.cc/150?u=${userName}`, roses: 0 }],
      owner: userName,
      createdAt: Date.now(),
    };
    await createAndNavigate(newRoomData);
  };

  const handleSaveName = async () => {
    if (tempUserName.trim() === '') {
      Alert.alert('Error', 'Display name cannot be empty.');
      return;
    }
    await AsyncStorage.setItem('display_name', tempUserName);
    setUserName(tempUserName);
    setShowNameModal(false);
  };
  
  return (
    <LinearGradient colors={['#1F1C2C', '#121212']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navTop}>
          <Text style={styles.logo}>TalkHive</Text>
          <View style={styles.navLinks}>
            <TouchableOpacity style={styles.autoCreateBtn} onPress={handleAutoCreateRoom}>
              <Text style={styles.autoCreateText}>⚡️ Quick Join</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (userName ? setShowCreateModal(true) : setShowNameModal(true))}>
              <LinearGradient
                colors={['#00F260', '#0575E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createRoomBtn}
              >
                <FontAwesome name="plus" size={14} color="#fff" />
                <Text style={styles.createRoomText}>Create Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.searchAndFiltersContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={16} color="#aaa" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a group or language..."
              placeholderTextColor="#888"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageTagsContainer}>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang}
                style={[styles.languageTag, activeLanguage === lang && styles.activeTag]}
                onPress={() => setActiveLanguage(lang)}
              >
                <Text style={styles.languageTagText}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.roomsList}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <Pressable key={room.id} onPress={() => handleJoinRoom(room)}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.roomCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.roomName} numberOfLines={1}>{room.name}</Text>
                      <Text style={styles.roomLevel}>{room.language} - {room.level}</Text>
                    </View>
                    <View style={styles.membersInfo}>
                      <FontAwesome name="users" size={14} color="#eee" />
                      <Text style={styles.memberCountText}>{room.currentMembers.length}/{room.maxMembers}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.membersList}>
                      {room.currentMembers.slice(0, 5).map((member) => (
                        <MemberAvatar key={member.name} name={member.name} avatar={member.avatar} isOwner={room.owner === member.name} />
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.joinButton, room.currentMembers.length >= room.maxMembers && styles.joinButtonDisabled]}
                      disabled={room.currentMembers.length >= room.maxMembers}
                    >
                      <Text style={styles.joinButtonText}>
                        {room.currentMembers.length >= room.maxMembers ? 'Full' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noRoomsText}>No groups found. Create one to get started! 😊</Text>
          )}
        </View>
      </ScrollView>
      
      <Modal
          animationType="slide"
          transparent={true}
          visible={showCreateModal}
          onRequestClose={() => setShowCreateModal(false)}
      >
          <Pressable style={styles.modalOverlay} onPress={() => setShowCreateModal(false)}>
              <Pressable style={styles.modalContent}>
                  <LinearGradient colors={['#2a2a2e', '#1e1e1e']} style={styles.modalGradient}>
                      <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Create a New Group</Text>
                          <TouchableOpacity style={styles.modalClose} onPress={() => setShowCreateModal(false)}>
                              <FontAwesome name="times" size={20} color="#888" />
                          </TouchableOpacity>
                      </View>
                      
                      <Text style={styles.label}>Group Name</Text>
                      <TextInput
                          style={styles.input}
                          onChangeText={setNewRoomName}
                          value={newRoomName}
                          placeholder="E.g., English Practice Club"
                          placeholderTextColor="#777"
                      />
                      <Text style={styles.label}>Language</Text>
                      <TextInput
                          style={styles.input}
                          value={newRoomLanguage}
                          onChangeText={setNewRoomLanguage}
                      />
                      <Text style={styles.label}>Proficiency Level</Text>
                      <View style={styles.optionSelector}>
                          {levels.map(level => (
                              <TouchableOpacity key={level} style={[styles.optionButton, newRoomLevel === level && styles.optionButtonActive]} onPress={() => setNewRoomLevel(level)}>
                                  <Text style={styles.optionButtonText}>{level}</Text>
                              </TouchableOpacity>
                          ))}
                      </View>
                      <Text style={styles.label}>Max Members</Text>
                       <View style={styles.optionSelector}>
                          {memberCounts.map(count => (
                              <TouchableOpacity key={count} style={[styles.optionButton, newRoomMembers === count && styles.optionButtonActive]} onPress={() => setNewRoomMembers(count)}>
                                  <Text style={styles.optionButtonText}>{count}</Text>
                              </TouchableOpacity>
                          ))}
                      </View>
                      <TouchableOpacity onPress={handleCreateRoomSubmit}>
                           <LinearGradient
                              colors={['#00F260', '#0575E6']}
                              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                              style={styles.submitButton}
                           >
                              <Text style={styles.submitButtonText}>Create Group</Text>
                          </LinearGradient>
                       </TouchableOpacity>
                    </LinearGradient>
                </Pressable>
              </Pressable>
             </Modal>
         <Modal
        animationType="fade"
        transparent={true}
        visible={showNameModal}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.nameModalContent}>
               <Text style={styles.modalTitle}>Welcome to TalkHive!</Text>
                <Text style={styles.label}>Please set your display name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setTempUserName}
                    value={tempUserName}
                    placeholder="Enter your name..."
                    placeholderTextColor="#777"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSaveName}>
                    <Text style={styles.submitButtonText}>Save Name</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 45 : 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1F1C2C',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    navTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    autoCreateBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        marginRight: 10,
    },
    autoCreateText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    createRoomBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    createRoomText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 13,
    },
    mainContent: {
        flex: 1,
    },
    searchAndFiltersContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        color: '#fff',
        fontSize: 15,
    },
    languageTagsContainer: {
        flexDirection: 'row',
    },
    languageTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    activeTag: {
        backgroundColor: '#0575E6',
    },
    languageTagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    roomsList: {
        paddingHorizontal: 20,
    },
    roomCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    roomLevel: {
        fontSize: 13,
        color: '#bbb',
        marginTop: 2,
    },
    membersInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    memberCountText: {
        marginLeft: 6,
        color: '#fff',
        fontWeight: '600',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    membersList: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
    },
    memberCard: {
        alignItems: 'center',
        marginRight: -15, 
        width: 50,
    },
    memberAvatarImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#1F1C2C',
    },
    memberName: {
        fontSize: 10,
        color: '#ddd',
        marginTop: 2,
        width: 40,
        textAlign: 'center',
    },
    ownerCrown: {
        position: 'absolute',
        top: -2,
        left: 2,
        zIndex: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2,
    },
    joinButton: {
        backgroundColor: '#0575E6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    joinButtonDisabled: {
        backgroundColor: '#555',
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    noRoomsText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: width * 0.9,
        borderRadius: 20,
        overflow: 'hidden',
    },
    nameModalContent: {
        width: width * 0.9,
        borderRadius: 20,
        padding: 24,
        backgroundColor: '#1e1e1e'
    },
    modalGradient: {
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalClose: {
        padding: 5,
    },
    label: {
        color: '#ccc',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 16,
        fontSize: 15,
    },
    optionSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    optionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    optionButtonActive: {
        backgroundColor: '#0575E6',
        borderColor: '#00F260',
        borderWidth: 1,
    },
    optionButtonText: {
        color: '#fff',
        fontWeight: '600'
    },
    submitButton: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Lobby;
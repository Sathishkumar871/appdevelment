// app/room/[id].tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/firebasedata'; // Firebase config
import AgoraUIKit from 'agora-rn-uikit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: number;
}

export default function RoomScreen() {
  const router = useRouter();
  const { id: roomId, user: userName } = useLocalSearchParams<{ id: string; user: string }>();

  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);

  const agoraConnectionData = {
    appId: 'YOUR_AGORA_APP_ID', // మీ Agora App ID
    channel: roomId,
    token: null, // Test కోసం null
  };

  const agoraCallbacks = {
    EndCall: () => {
      setIsVideoCall(false);
      router.back();
    },
  };

  // Fetch room & messages
  useEffect(() => {
    if (!roomId) return;

    const roomDocRef = doc(db, 'rooms', roomId);

    const fetchRoom = async () => {
      const docSnap = await getDoc(roomDocRef);
      if (docSnap.exists()) setRoomDetails(docSnap.data());
      else Alert.alert('Error', 'Room not found', [{ text: 'OK', onPress: () => router.back() }]);
    };

    fetchRoom();

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Message[] = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() } as Message));
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Leave room on screen blur
  useFocusEffect(
    useCallback(() => {
      return () => {
        const leaveRoom = async () => {
          if (!roomId || !userName) return;
          const roomDocRef = doc(db, 'rooms', roomId);
          const roomSnap = await getDoc(roomDocRef);
          if (!roomSnap.exists()) return;

          const roomData = roomSnap.data();
          const userToRemove = roomData.currentMembers?.find((m: any) => m.name === userName);
          if (userToRemove) await updateDoc(roomDocRef, { currentMembers: arrayRemove(userToRemove) });

          if (roomData.currentMembers?.length <= 1) {
            // await deleteDoc(roomDocRef); // Uncomment if you want to auto-delete empty room
          }

          await AsyncStorage.removeItem('current_room_id');
        };

        leaveRoom();
      };
    }, [roomId, userName])
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userName) return;

    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesRef, { text: newMessage.trim(), sender: userName, createdAt: Date.now() });
      setNewMessage('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not send message');
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMy = item.sender === userName;
    return (
      <View style={[styles.messageBubble, isMy ? styles.myMessage : styles.otherMessage]}>
        {!isMy && <Text style={styles.senderName}>{item.sender}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (isVideoCall) {
    return <AgoraUIKit connectionData={agoraConnectionData} rtcCallbacks={agoraCallbacks} />;
  }

  return (
    <LinearGradient colors={['#1F1C2C', '#121212']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.roomName} numberOfLines={1}>
            {roomDetails?.name || 'Loading...'}
          </Text>
          <TouchableOpacity onPress={() => setIsVideoCall(true)} style={styles.callButton}>
            <FontAwesome name="video-camera" size={22} color="#00F260" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.chatArea}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <FontAwesome name="paper-plane" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#1F1C2C' },
  roomName: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  callButton: { padding: 5 },
  chatArea: { flex: 1, paddingHorizontal: 10 },
  messageBubble: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  myMessage: { backgroundColor: '#0575E6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#3a3a3c', alignSelf: 'flex-start' },
  senderName: { color: '#ccc', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  messageText: { color: '#fff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: '#1F1C2C' },
  textInput: { flex: 1, height: 45, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 25, paddingHorizontal: 20, color: '#fff', fontSize: 16, marginRight: 10 },
  sendButton: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#0575E6', justifyContent: 'center', alignItems: 'center' },
});

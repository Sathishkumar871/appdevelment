import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Type Definitions ---
type BikeItem = {
  id: string;
  make: string;
  model: string;
  type: 'Cruiser' | 'Sport' | 'Scooter' | 'Naked';
  engineCapacity: number;
  photos: string[];
  pricePerDay: number;
  rating: number;
  reviews: number;
  addons: {
    helmet: boolean;
    phoneMount: boolean;
  };
};

// --- Mock Data ---
const sharedBikePhotos = [
  "https://ik.imagekit.io/your_imagekit_id/bike1.jpg", // Replace with your bike photos
  "https://ik.imagekit.io/your_imagekit_id/bike2.jpg",
  "https://ik.imagekit.io/your_imagekit_id/bike3.jpg",
];

const mockBikeResults: BikeItem[] = [
  {
    id: "B1",
    make: "Royal Enfield",
    model: "Classic 350",
    type: "Cruiser",
    engineCapacity: 350,
    photos: sharedBikePhotos,
    pricePerDay: 800,
    rating: 4.6,
    reviews: 250,
    addons: { helmet: true, phoneMount: true },
  },
  {
    id: "B2",
    make: "Honda",
    model: "Activa 6G",
    type: "Scooter",
    engineCapacity: 110,
    photos: sharedBikePhotos,
    pricePerDay: 400,
    rating: 4.8,
    reviews: 550,
    addons: { helmet: true, phoneMount: false },
  },
  {
    id: "B3",
    make: "Bajaj",
    model: "Pulsar NS200",
    type: "Naked",
    engineCapacity: 200,
    photos: sharedBikePhotos,
    pricePerDay: 650,
    rating: 4.3,
    reviews: 180,
    addons: { helmet: true, phoneMount: true },
  },
  {
    id: "B4",
    make: "Yamaha",
    model: "R15 V4",
    type: "Sport",
    engineCapacity: 155,
    photos: sharedBikePhotos,
    pricePerDay: 900,
    rating: 4.7,
    reviews: 300,
    addons: { helmet: true, phoneMount: true },
  },
  {
    id: "B5",
    make: "KTM",
    model: "Duke 390",
    type: "Naked",
    engineCapacity: 373,
    photos: sharedBikePhotos,
    pricePerDay: 1100,
    rating: 4.9,
    reviews: 420,
    addons: { helmet: true, phoneMount: true },
  },
];

const BikesScreen: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<BikeItem[]>(mockBikeResults);
  const [selectedBike, setSelectedBike] = useState<BikeItem | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropoffPicker, setShowDropoffPicker] = useState(false);
  const [isHelmetSelected, setIsHelmetSelected] = useState(false);
  const [isPhoneMountSelected, setIsPhoneMountSelected] = useState(false);

  const onDateChange = (event: any, selectedDate: Date | undefined, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setShowPickupPicker(false);
      setPickupDate(selectedDate || pickupDate);
    } else {
      setShowDropoffPicker(false);
      setDropoffDate(selectedDate || dropoffDate);
    }
  };

  const confirmBooking = () => {
    if (!selectedBike || !pickupDate || !dropoffDate) {
      Alert.alert('Missing Details', 'Please select pickup and drop-off dates.');
      return;
    }

    const pickupDateString = pickupDate.toISOString().split('T')[0];
    const dropoffDateString = dropoffDate.toISOString().split('T')[0];
    const ref = `B-${Date.now().toString().slice(-6)}`;

    let confirmationMessage = `Your bike rental booking reference is: ${ref}\nBike: ${selectedBike.make} ${selectedBike.model}\nPickup: ${pickupDateString}\nDrop-off: ${dropoffDateString}`;

    if (isHelmetSelected) confirmationMessage += `\nAdd-on: Helmet`;
    if (isPhoneMountSelected) confirmationMessage += `\nAdd-on: Phone Mount`;

    Alert.alert('Booking Confirmed!', confirmationMessage);
    setSelectedBike(null);
  };

  const renderBikeItem = ({ item }: { item: BikeItem }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.resultCard}
      onPress={() => setSelectedBike(item)}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.bikeImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.make} {item.model}</Text>
        <Text style={styles.cardSub}>{item.type}, {item.engineCapacity}cc</Text>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews} reviews)
          </Text>
        </View>
      </View>
      <View style={styles.priceWrap}>
        <Text style={styles.price}>₹ {item.pricePerDay}</Text>
        <Text style={styles.bookNow}>/ day</Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedBike) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#B2EBF2" />
        <LinearGradient
          colors={['#E0F7FA', '#B2EBF2']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedBike(null)} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#111827' }]}>Bike Details</Text>
          </View>

          {/* --- Images Carousel --- */}
          <FlatList
            horizontal
            pagingEnabled
            data={selectedBike.photos}
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.bikeDetailImage} />
            )}
            style={styles.imageCarousel}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalHotelTitle}>{selectedBike.make} {selectedBike.model}</Text>
            <Text style={styles.modalDim}>{selectedBike.type}, {selectedBike.engineCapacity}cc</Text>
            <View style={styles.ratingContainerModal}>
              <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingTextModal}>
                {selectedBike.rating} / 5 ({selectedBike.reviews} reviews)
              </Text>
            </View>

            {/* --- Dates --- */}
            <Text style={styles.modalSectionTitle}>Dates</Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                onPress={() => setShowPickupPicker(true)}
                style={styles.datePickerBtn}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#2563EB" />
                <Text style={styles.datePickerTxt}>
                  Pickup: {pickupDate ? pickupDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showPickupPicker && (
                <DateTimePicker
                  value={pickupDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => onDateChange(event, date, 'pickup')}
                />
              )}
              <TouchableOpacity
                onPress={() => setShowDropoffPicker(true)}
                style={styles.datePickerBtn}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#2563EB" />
                <Text style={styles.datePickerTxt}>
                  Drop-off: {dropoffDate ? dropoffDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showDropoffPicker && (
                <DateTimePicker
                  value={dropoffDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => onDateChange(event, date, 'dropoff')}
                />
              )}
            </View>

            {/* --- Premium Add-ons --- */}
            <Text style={styles.modalSectionTitle}>Premium Add-ons</Text>
            <View style={styles.packageDetails}>
              {selectedBike.addons.helmet && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setIsHelmetSelected(!isHelmetSelected)}
                >
                  <MaterialCommunityIcons
                    name="motorbike-helmet"
                    size={20}
                    color={isHelmetSelected ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>Helmet (Included)</Text>
                  {isHelmetSelected && (
                    <MaterialCommunityIcons name="check" size={20} color="#34D399" />
                  )}
                </TouchableOpacity>
              )}
              {selectedBike.addons.phoneMount && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setIsPhoneMountSelected(!isPhoneMountSelected)}
                >
                  <MaterialCommunityIcons
                    name="cellphone-marker"
                    size={20}
                    color={isPhoneMountSelected ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>Phone Mount</Text>
                  {isPhoneMountSelected && (
                    <MaterialCommunityIcons name="check" size={20} color="#34D399" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalPrice}>Total: ₹ {selectedBike.pricePerDay}/day</Text>

            <TouchableOpacity style={styles.payBtn} onPress={confirmBooking}>
              <MaterialCommunityIcons
                name="credit-card-check"
                size={20}
                color="#fff"
              />
              <Text style={styles.payTxt}>Confirm & Pay (Demo)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B2EBF2" />
      <LinearGradient
        colors={['#E0F7FA', '#B2EBF2']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#111827' }]}>Bike Rentals in Rajahmundry</Text>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={[styles.sectionTitle, { color: '#111827' }]}>Available Bikes</Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderBikeItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  bikeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 16,
  },
  cardSub: {
    color: '#4B5563',
    marginTop: 2,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#4B5563',
    fontSize: 12,
    marginLeft: 4,
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: 'bold',
    color: '#34D399',
    fontSize: 18,
  },
  bookNow: {
    marginTop: 4,
    color: '#60A5FA',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Details View Styles
  modalContent: {
    paddingHorizontal: 25,
  },
  bikeDetailImage: {
    width: 300,
    height: 200,
    borderRadius: 15,
    marginRight: 10,
    resizeMode: 'cover',
  },
  imageCarousel: {
    height: 200,
    marginBottom: 15,
    paddingHorizontal: 25,
  },
  modalHotelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  ratingContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingTextModal: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 15,
    marginBottom: 10,
  },
  modalDim: {
    color: '#6B7280',
    fontSize: 14,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    gap: 8,
  },
  datePickerTxt: {
    color: '#111827',
    fontWeight: '600',
  },
  packageDetails: {
    marginTop: 10,
  },
  addFeatureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    gap: 10,
  },
  addFeatureTxt: {
    flex: 1,
    color: '#111827',
    fontWeight: 'bold',
  },
  modalPrice: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#10B981',
    fontSize: 20,
    textAlign: 'center',
  },
  payBtn: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 20,
  },
  payTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BikesScreen;
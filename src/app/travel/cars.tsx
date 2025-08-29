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
type CarItem = {
  id: string;
  make: string;
  model: string;
  type: 'SUV' | 'Sedan' | 'Hatchback';
  seatingCapacity: number;
  photos: string[];
  pricePerDay: number;
  rating: number;
  reviews: number;
  features: string[];
  addons: {
    gps: boolean;
    childSeat: boolean;
    extraDriver: boolean;
  };
};

// --- Mock Data ---
const sharedCarPhotos = [
  "https://ik.imagekit.io/your_imagekit_id/car1.jpg", // Replace with your car photos
  "https://ik.imagekit.io/your_imagekit_id/car2.jpg",
  "https://ik.imagekit.io/your_imagekit_id/car3.jpg",
];

const mockCarResults: CarItem[] = [
  {
    id: "C1",
    make: "Maruti",
    model: "Dzire",
    type: "Sedan",
    seatingCapacity: 5,
    photos: sharedCarPhotos,
    pricePerDay: 1200,
    rating: 4.5,
    reviews: 350,
    features: ["Automatic Transmission", "AC", "Bluetooth"],
    addons: { gps: true, childSeat: true, extraDriver: false },
  },
  {
    id: "C2",
    make: "Mahindra",
    model: "XUV300",
    type: "SUV",
    seatingCapacity: 5,
    photos: sharedCarPhotos,
    pricePerDay: 1800,
    rating: 4.7,
    reviews: 510,
    features: ["Automatic Transmission", "AC", "Touchscreen Display"],
    addons: { gps: true, childSeat: true, extraDriver: true },
  },
  {
    id: "C3",
    make: "Tata",
    model: "Tiago",
    type: "Hatchback",
    seatingCapacity: 4,
    photos: sharedCarPhotos,
    pricePerDay: 850,
    rating: 4.1,
    reviews: 190,
    features: ["Manual Transmission", "AC"],
    addons: { gps: false, childSeat: true, extraDriver: false },
  },
  {
    id: "C4",
    make: "Honda",
    model: "City",
    type: "Sedan",
    seatingCapacity: 5,
    photos: sharedCarPhotos,
    pricePerDay: 1500,
    rating: 4.6,
    reviews: 420,
    features: ["Automatic Transmission", "Sunroof", "Cruise Control"],
    addons: { gps: true, childSeat: false, extraDriver: true },
  },
  {
    id: "C5",
    make: "Hyundai",
    model: "Creta",
    type: "SUV",
    seatingCapacity: 5,
    photos: sharedCarPhotos,
    pricePerDay: 2000,
    rating: 4.8,
    reviews: 650,
    features: ["Automatic Transmission", "Premium Audio", "360 Camera"],
    addons: { gps: true, childSeat: true, extraDriver: true },
  },
];

const CarsScreen: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<CarItem[]>(mockCarResults);
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropoffPicker, setShowDropoffPicker] = useState(false);
  const [isGpsSelected, setIsGpsSelected] = useState(false);
  const [isChildSeatSelected, setIsChildSeatSelected] = useState(false);
  const [isExtraDriverSelected, setIsExtraDriverSelected] = useState(false);

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
    if (!selectedCar || !pickupDate || !dropoffDate) {
      Alert.alert('Missing Details', 'Please select pickup and drop-off dates.');
      return;
    }

    const pickupDateString = pickupDate.toISOString().split('T')[0];
    const dropoffDateString = dropoffDate.toISOString().split('T')[0];
    const ref = `C-${Date.now().toString().slice(-6)}`;

    let confirmationMessage = `Your car rental booking reference is: ${ref}\nCar: ${selectedCar.make} ${selectedCar.model}\nPickup: ${pickupDateString}\nDrop-off: ${dropoffDateString}`;

    if (isGpsSelected) confirmationMessage += `\nAdd-on: GPS`;
    if (isChildSeatSelected) confirmationMessage += `\nAdd-on: Child Seat`;
    if (isExtraDriverSelected) confirmationMessage += `\nAdd-on: Extra Driver`;

    Alert.alert('Booking Confirmed!', confirmationMessage);
    setSelectedCar(null);
  };

  const renderCarItem = ({ item }: { item: CarItem }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.resultCard}
      onPress={() => setSelectedCar(item)}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.carImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.make} {item.model}</Text>
        <Text style={styles.cardSub}>{item.type}, {item.seatingCapacity} seats</Text>
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

  if (selectedCar) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#B2EBF2" />
        <LinearGradient
          colors={['#E0F7FA', '#B2EBF2']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedCar(null)} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#111827' }]}>Car Details</Text>
          </View>

          {/* --- Images Carousel --- */}
          <FlatList
            horizontal
            pagingEnabled
            data={selectedCar.photos}
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carDetailImage} />
            )}
            style={styles.imageCarousel}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalHotelTitle}>{selectedCar.make} {selectedCar.model}</Text>
            <Text style={styles.modalDim}>{selectedCar.type}, {selectedCar.seatingCapacity} seats</Text>
            <View style={styles.ratingContainerModal}>
              <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingTextModal}>
                {selectedCar.rating} / 5 ({selectedCar.reviews} reviews)
              </Text>
            </View>

            {/* --- Features --- */}
            <Text style={styles.modalSectionTitle}>Features</Text>
            <View style={styles.featureContainer}>
              {selectedCar.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialCommunityIcons name="check" size={16} color="#34D399" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
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
              {selectedCar.addons.gps && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setIsGpsSelected(!isGpsSelected)}
                >
                  <MaterialCommunityIcons
                    name="map-marker-path"
                    size={20}
                    color={isGpsSelected ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>GPS Navigation</Text>
                  {isGpsSelected && (
                    <MaterialCommunityIcons name="check" size={20} color="#34D399" />
                  )}
                </TouchableOpacity>
              )}
              {selectedCar.addons.childSeat && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setIsChildSeatSelected(!isChildSeatSelected)}
                >
                  <MaterialCommunityIcons
                    name="baby-carriage"
                    size={20}
                    color={isChildSeatSelected ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>Child Seat</Text>
                  {isChildSeatSelected && (
                    <MaterialCommunityIcons name="check" size={20} color="#34D399" />
                  )}
                </TouchableOpacity>
              )}
              {selectedCar.addons.extraDriver && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setIsExtraDriverSelected(!isExtraDriverSelected)}
                >
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={20}
                    color={isExtraDriverSelected ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>Extra Driver</Text>
                  {isExtraDriverSelected && (
                    <MaterialCommunityIcons name="check" size={20} color="#34D399" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalPrice}>Total: ₹ {selectedCar.pricePerDay}/day</Text>

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
          <Text style={[styles.headerTitle, { color: '#111827' }]}>Car Rentals in Rajahmundry</Text>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={[styles.sectionTitle, { color: '#111827' }]}>Available Cars</Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderCarItem}
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
  carImage: {
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
  carDetailImage: {
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
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    color: '#111827',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default CarsScreen;
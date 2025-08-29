import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
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
type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  photos: string[];
  price: number;
  extra?: string;
  rating: number;
  reviews: number;
  package?: {
    foodDelivery: boolean;
    amenities: string[];
  };
  features: {
    shuttleService: boolean;
    bikeRental: boolean;
    foodPackage: 'Free' | 'Paid' | 'Not Available';
  };
};

type Review = {
  id: string;
  hotelId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

// --- Mock Data ---
const sharedPhotos = [
  "https://ik.imagekit.io/pimx50ija/technician-5508210_1280.jpg?updatedAt=1752219015752",
  "https://ik.imagekit.io/pimx50ija/woman-7048766_1280.jpg?updatedAt=1752219015840",
  "https://ik.imagekit.io/pimx50ija/camera-7726802_1280.jpg?updatedAt=1752219011515",
];

const mockHotelResults: SearchItem[] = [
  {
    id: "H1",
    title: "Grand Residency",
    subtitle: "City Center",
    photos: sharedPhotos,
    price: 1899,
    extra: "Breakfast included",
    rating: 4.5,
    reviews: 1245,
    package: {
      foodDelivery: true,
      amenities: ["Free Wi-Fi", "Swimming Pool", "Gym", "24/7 Room Service"],
    },
    features: {
      shuttleService: true,
      bikeRental: false,
      foodPackage: 'Free',
    },
  },
  {
    id: "H2",
    title: "Sathish Hotels & Resorts",
    subtitle: "Near Airport",
    photos: sharedPhotos,
    price: 1399,
    extra: "Free cancellation",
    rating: 4.2,
    reviews: 890,
    package: {
      foodDelivery: false,
      amenities: ["Free Wi-Fi", "Complimentary Breakfast", "Pet-friendly"],
    },
    features: {
      shuttleService: true,
      bikeRental: true,
      foodPackage: 'Paid',
    },
  },
  {
    id: "H3",
    title: "Palm Exotica Boutique Resort",
    subtitle: "River View",
    photos: sharedPhotos,
    price: 2500,
    extra: "Premium Suite Offer",
    rating: 4.8,
    reviews: 2100,
    package: {
      foodDelivery: true,
      amenities: [
        "Free Wi-Fi",
        "Infinity Pool",
        "Spa & Wellness Center",
        "Lush Gardens",
      ],
    },
    features: {
      shuttleService: false,
      bikeRental: true,
      foodPackage: 'Free',
    },
  },
  {
    id: "H4",
    title: "Rajahmundry Regency",
    subtitle: "Heart of the City",
    photos: sharedPhotos,
    price: 1650,
    extra: "Flexible Check-in",
    rating: 4.1,
    reviews: 750,
    package: {
      foodDelivery: false,
      amenities: ["Free Wi-Fi", "Business Center", "Airport Shuttle"],
    },
    features: {
      shuttleService: true,
      bikeRental: false,
      foodPackage: 'Not Available',
    },
  },
  {
    id: "H5",
    title: "Riverfront Residency",
    subtitle: "On Godavari Banks",
    photos: sharedPhotos,
    price: 2200,
    extra: "Scenic Views Guaranteed",
    rating: 4.6,
    reviews: 1550,
    package: {
      foodDelivery: true,
      amenities: [
        "Free Wi-Fi",
        "River View Rooms",
        "Fine Dining Restaurant",
        "Boating Access",
      ],
    },
    features: {
      shuttleService: true,
      bikeRental: true,
      foodPackage: 'Free',
    },
  },
  {
    id: "H6",
    title: "Sai Krishna Inn",
    subtitle: "Near Railway Station",
    photos: sharedPhotos,
    price: 1100,
    extra: "Complimentary coffee",
    rating: 3.9,
    reviews: 512,
    package: {
      foodDelivery: true,
      amenities: ["Free Wi-Fi", "Laundry Service"],
    },
    features: {
      shuttleService: false,
      bikeRental: false,
      foodPackage: 'Paid',
    },
  },
  {
    id: "H7",
    title: "Hotel Aditya Palace",
    subtitle: "Main Road",
    photos: sharedPhotos,
    price: 1500,
    extra: "Family package offer",
    rating: 4.3,
    reviews: 980,
    package: {
      foodDelivery: true,
      amenities: ["Free Wi-Fi", "Children's Play Area"],
    },
    features: {
      shuttleService: true,
      bikeRental: false,
      foodPackage: 'Free',
    },
  },
  {
    id: "H8",
    title: "Manjeera Sarovar Premiere",
    subtitle: "Near City Outskirts",
    photos: sharedPhotos,
    price: 2800,
    extra: "Exclusive spa access",
    rating: 4.9,
    reviews: 2500,
    package: {
      foodDelivery: true,
      amenities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Lounge Bar"],
    },
    features: {
      shuttleService: true,
      bikeRental: true,
      foodPackage: 'Free',
    },
  },
  {
    id: "H9",
    title: "Hotel Shelton Rajamahendri",
    subtitle: "Downtown",
    photos: sharedPhotos,
    price: 1750,
    extra: "Pet-friendly rooms",
    rating: 4.0,
    reviews: 650,
    package: {
      foodDelivery: false,
      amenities: ["Free Wi-Fi", "Complimentary Breakfast"],
    },
    features: {
      shuttleService: false,
      bikeRental: false,
      foodPackage: 'Not Available',
    },
  },
  {
    id: "H10",
    title: "Siva Krishna Inn",
    subtitle: "Beside Bus Station",
    photos: sharedPhotos,
    price: 950,
    extra: "Budget-friendly deal",
    rating: 3.5,
    reviews: 420,
    package: {
      foodDelivery: true,
      amenities: ["Free Wi-Fi"],
    },
    features: {
      shuttleService: false,
      bikeRental: false,
      foodPackage: 'Paid',
    },
  },
];

const mockReviews: Review[] = [
  { id: 'R1', hotelId: 'H1', user: 'Anand V.', rating: 5, comment: 'Excellent stay! The staff was very helpful and the breakfast was delicious.', date: '2025-08-20' },
  { id: 'R2', hotelId: 'H1', user: 'Priya K.', rating: 4, comment: 'Clean rooms and great location. The pool was a bit crowded but overall a good experience.', date: '2025-08-19' },
  { id: 'R3', hotelId: 'H2', user: 'Ramesh S.', rating: 4, comment: 'Perfect for a business trip. Quiet and comfortable.', date: '2025-08-18' },
  { id: 'R4', hotelId: 'H3', user: 'Swetha P.', rating: 5, comment: 'Absolutely beautiful resort! The river view from the room was breathtaking.', date: '2025-08-21' },
  { id: 'R5', hotelId: 'H8', user: 'Vishnu B.', rating: 5, comment: 'Luxury at its best. The spa service was top-notch.', date: '2025-08-22' },
];

const hotelOffers = [
  {
    id: 'ho1',
    title: 'Luxury Suite Special',
    subtitle: 'Book a suite, get 1 night free!',
    color: '#F43F5E',
  },
  {
    id: 'ho2',
    title: 'Weekend Getaway',
    subtitle: 'Flat 20% off on all weekend stays',
    color: '#3B82F6',
  },
  {
    id: 'ho3',
    title: 'Corporate Offer',
    subtitle: 'Book 3 rooms, get the 4th free!',
    color: '#22C55E',
  },
];

const foodOptions = ['Breakfast', 'Lunch', 'Dinner'];

const HotelsScreen: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<SearchItem[]>(mockHotelResults);
  const [selected, setSelected] = useState<SearchItem | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedBikeRental, setSelectedBikeRental] = useState(false);
  const [bikeUserDetails, setBikeUserDetails] = useState('');
  const [selectedShuttle, setSelectedShuttle] = useState(false);
  const [shuttleLocation, setShuttleLocation] = useState('');

  const hotelReviews = useMemo(() => {
    if (!selected) return [];
    return mockReviews.filter(review => review.hotelId === selected.id);
  }, [selected]);

  const otherHotels = useMemo(() => {
    if (!selected) return [];
    return mockHotelResults.filter(hotel => hotel.id !== selected.id);
  }, [selected]);

  const onDateChange = (event: any, selectedDate: Date | undefined, type: 'in' | 'out') => {
    if (type === 'in') {
      setShowCheckInPicker(false);
      setCheckInDate(selectedDate || checkInDate);
    } else {
      setShowCheckOutPicker(false);
      setCheckOutDate(selectedDate || checkOutDate);
    }
  };

  const sendReviewRequest = () => {
    Alert.alert(
      "Review Request",
      "Thank you for your stay! Please share your feedback to help us improve.",
      [
        { text: "Later", style: "cancel" },
        { text: "Review Now", onPress: () => console.log("User wants to review") }
      ]
    );
  };

  const confirmBooking = () => {
    if (!selected || !checkInDate || !checkOutDate) {
      Alert.alert(
        'Missing Details',
        'Please select check-in and check-out dates.'
      );
      return;
    }

    if (selectedBikeRental && !bikeUserDetails) {
      Alert.alert('Missing Details', 'Please provide your full name for bike rental.');
      return;
    }

    const checkInString = checkInDate.toISOString().split('T')[0];
    const checkOutString = checkOutDate.toISOString().split('T')[0];
    const ref = `H-${Date.now().toString().slice(-6)}`;

    let confirmationMessage = `Your booking reference is: ${ref}\nCheck-in: ${checkInString}\nCheck-out: ${checkOutString}`;
    if (selectedFood) {
      confirmationMessage += `\nFood: ${selectedFood}`;
    }
    if (selectedShuttle) {
      confirmationMessage += `\nShuttle Service to: ${shuttleLocation}`;
    }
    if (selectedBikeRental) {
      confirmationMessage += `\nBike Rental for: ${bikeUserDetails}`;
    }

    Alert.alert(
      'Booking Confirmed!',
      confirmationMessage,
      [
        { text: 'Check-out', onPress: () => handleCheckout() }
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      "Thank You!",
      "You have successfully checked out of your hotel.",
      [
        { text: "OK", onPress: () => sendReviewRequest() }
      ]
    );
    // Reset state to show main list again
    setSelected(null);
    setCheckInDate(null);
    setCheckOutDate(null);
    setSelectedFood(null);
    setSelectedBikeRental(false);
    setBikeUserDetails('');
    setSelectedShuttle(false);
    setShuttleLocation('');
  };

  const renderHotelItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.resultCard}
      onPress={() => setSelected(item)}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.hotelImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {!!item.subtitle && <Text style={styles.cardSub}>{item.subtitle}</Text>}
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews} reviews)
          </Text>
        </View>
        {!!item.extra && <Text style={styles.cardMeta}>{item.extra}</Text>}
      </View>
      <View style={styles.priceWrap}>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.bookNow}>View Details</Text>
      </View>
    </TouchableOpacity>
  );

  const renderOtherHotelItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.otherHotelCard}
      onPress={() => setSelected(item)}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.otherHotelImage} />
      <Text style={styles.otherHotelTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Conditional Rendering
  if (selected) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hotel Details</Text>
          </View>

          {/* --- Images Carousel --- */}
          <Text style={styles.modalSectionTitle}>Photos</Text>
          <FlatList
            horizontal
            pagingEnabled
            data={selected.photos}
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.modalImage} />
            )}
            style={styles.imageCarousel}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalHotelTitle}>{selected.title}</Text>
            {!!selected.subtitle && (
              <Text style={styles.modalDim}>{selected.subtitle}</Text>
            )}
            <View style={styles.ratingContainerModal}>
              <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingTextModal}>
                {selected.rating} / 5 ({selected.reviews} reviews)
              </Text>
            </View>

            {/* --- Reviews Section --- */}
            <Text style={styles.modalSectionTitle}>Guest Reviews</Text>
            {hotelReviews.length > 0 ? (
              hotelReviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <View style={styles.reviewRating}>
                      <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.reviewNoReviews}>No reviews yet. Be the first!</Text>
            )}

            {/* --- Dates --- */}
            <Text style={styles.modalSectionTitle}>Dates</Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                onPress={() => setShowCheckInPicker(true)}
                style={styles.datePickerBtn}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#2563EB" />
                <Text style={styles.datePickerTxt}>
                  Check-in: {checkInDate ? checkInDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showCheckInPicker && (
                <DateTimePicker
                  value={checkInDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => onDateChange(event, date, 'in')}
                />
              )}
              <TouchableOpacity
                onPress={() => setShowCheckOutPicker(true)}
                style={styles.datePickerBtn}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#2563EB" />
                <Text style={styles.datePickerTxt}>
                  Check-out: {checkOutDate ? checkOutDate.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showCheckOutPicker && (
                <DateTimePicker
                  value={checkOutDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => onDateChange(event, date, 'out')}
                />
              )}
            </View>
            
            {/* --- Food Menu --- */}
            <Text style={styles.modalSectionTitle}>Food Menu</Text>
            <View style={styles.foodMenuContainer}>
              {foodOptions.map((food) => (
                <TouchableOpacity
                  key={food}
                  style={[
                    styles.foodMenuItem,
                    selectedFood === food && styles.foodMenuItemSelected,
                  ]}
                  onPress={() => setSelectedFood(food)}
                >
                  <Text
                    style={[
                      styles.foodMenuText,
                      selectedFood === food && styles.foodMenuTextSelected,
                    ]}
                  >
                    {food}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* --- Premium Add-ons --- */}
            <Text style={styles.modalSectionTitle}>Premium Add-ons</Text>
            <View style={styles.packageDetails}>
              {selected.features.shuttleService && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setSelectedShuttle(!selectedShuttle)}
                >
                  <MaterialCommunityIcons
                    name="car-side"
                    size={20}
                    color={selectedShuttle ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>
                    Shuttle Service
                  </Text>
                  {selectedShuttle && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#34D399"
                    />
                  )}
                </TouchableOpacity>
              )}
              {selectedShuttle && (
                <View style={styles.shuttleInputContainer}>
                  <Text style={styles.modalLabel}>Pickup/Drop-off Location</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g., Rajahmundry Airport"
                    placeholderTextColor="#9CA3AF"
                    value={shuttleLocation}
                    onChangeText={setShuttleLocation}
                  />
                </View>
              )}

              {selected.features.bikeRental && (
                <TouchableOpacity
                  style={styles.addFeatureBtn}
                  onPress={() => setSelectedBikeRental(!selectedBikeRental)}
                >
                  <MaterialCommunityIcons
                    name="bike"
                    size={20}
                    color={selectedBikeRental ? '#34D399' : '#111827'}
                  />
                  <Text style={styles.addFeatureTxt}>
                    Bike Rental
                  </Text>
                  {selectedBikeRental && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#34D399"
                    />
                  )}
                </TouchableOpacity>
              )}
              {selectedBikeRental && (
                <View style={styles.shuttleInputContainer}>
                  <Text style={styles.modalLabel}>Full Name (Required)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter full name for security"
                    placeholderTextColor="#9CA3AF"
                    value={bikeUserDetails}
                    onChangeText={setBikeUserDetails}
                  />
                </View>
              )}
            </View>

            {/* --- Package Details --- */}
            <Text style={styles.modalSectionTitle}>Package Details</Text>
            <View style={styles.packageDetails}>
              {selected.package?.amenities.map((amenity, index) => (
                <View key={index} style={styles.packageItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#34D399"
                  />
                  <Text style={styles.packageText}>{amenity}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.modalPrice}>Total: ₹ {selected.price}</Text>

            <TouchableOpacity style={styles.payBtn} onPress={confirmBooking}>
              <MaterialCommunityIcons
                name="credit-card-check"
                size={20}
                color="#fff"
              />
              <Text style={styles.payTxt}>Confirm & Pay (Demo)</Text>
            </TouchableOpacity>

            {/* --- Other Hotels Section --- */}
            <Text style={[styles.modalSectionTitle, { marginTop: 40 }]}>Other Hotels You Might Like</Text>
            <FlatList
              horizontal
              data={otherHotels}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={renderOtherHotelItem}
              contentContainerStyle={styles.otherHotelsContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If no hotel is selected, render the main list view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hotels in Rajahmundry</Text>
        </View>

        {/* --- Offers Section --- */}
        <Text style={styles.sectionTitle}>Exclusive Hotel Offers</Text>
        <FlatList
          horizontal
          data={hotelOffers}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <LinearGradient
              colors={['#3B82F6', item.color]}
              style={styles.offerCard}
            >
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
            </LinearGradient>
          )}
        />
        <View style={styles.spacer} />

        {/* --- Hotel Listings (Using FlatList) --- */}
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Available Hotels</Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderHotelItem}
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
    backgroundColor: '#1F2937',
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
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  offerCard: {
    width: 280,
    height: 120,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  spacer: {
    height: 20,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    gap: 12,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  cardSub: {
    color: '#D1D5DB',
    marginTop: 2,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
  },
  cardMeta: {
    color: '#9CA3AF',
    marginTop: 2,
    fontSize: 10,
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
  // Modal Styles
  modalContent: {
    paddingHorizontal: 25,
  },
  modalHeader: {
    padding: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  imageCarousel: {
    height: 200,
    marginBottom: 15,
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 15,
    marginRight: 10,
    resizeMode: 'cover',
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
  foodMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  foodMenuItem: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    alignItems: 'center',
  },
  foodMenuItemSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#3B82F6',
  },
  foodMenuText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  foodMenuTextSelected: {
    color: '#111827',
  },
  packageDetails: {
    marginTop: 10,
  },
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  packageText: {
    marginLeft: 10,
    color: '#111827',
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
  shuttleInputContainer: {
    marginBottom: 15,
  },
  modalLabel: {
    marginBottom: 5,
    color: '#111827',
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    color: '#111827',
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
  // Review Styles
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#1F2937',
    fontSize: 14,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    color: '#1F2937',
    fontSize: 12,
    marginLeft: 4,
  },
  reviewComment: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 5,
  },
  reviewDate: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'right',
  },
  reviewNoReviews: {
    fontStyle: 'italic',
    color: '#6B7280',
    textAlign: 'center',
  },
  // Other Hotels
  otherHotelsContainer: {
    paddingVertical: 10,
  },
  otherHotelCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otherHotelImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  otherHotelTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    padding: 5,
  },
});

export default HotelsScreen;
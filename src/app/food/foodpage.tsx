import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// --- Type Definitions ---
type Category = {
  id: string;
  name: string;
  icon: string;
};

type Restaurant = {
  id: string;
  name: string;
  rating: number;
  time: string;
  offer: string;
  image: string;
  cuisine: string;
  type: string;
  featured: boolean;
};

type FoodItem = {
  id: string;
  name: string;
  restaurantId: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
};

type Offer = {
  id: string;
  title: string;
  subtitle: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
};

// --- Mock Data ---
const categories: Category[] = [
  { id: "1", name: "Biryani", icon: "🍗" },
  { id: "2", name: "Pizza", icon: "🍕" },
  { id: "3", name: "Desserts", icon: "🍰" },
  { id: "4", name: "Healthy", icon: "🥗" },
  { id: "5", name: "Drinks", icon: "🥤" },
  { id: "6", name: "Indian", icon: "🍛" },
  { id: "7", name: "Fast Food", icon: "🍔" },
];

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Paradise Biryani",
    rating: 4.5,
    time: "30 min",
    offer: "20% OFF on all items",
    image: "https://res.cloudinary.com/dlkborjdl/image/upload/v1700000001/biryani.jpg",
    cuisine: "Indian",
    type: "Dine-in, Takeaway, Delivery",
    featured: true,
  },
  {
    id: "2",
    name: "Dominos Pizza",
    rating: 4.2,
    time: "25 min",
    offer: "Flat ₹100 OFF on orders > ₹500",
    image: "https://res.cloudinary.com/dlkborjdl/image/upload/v1700000002/pizza.jpg",
    cuisine: "Italian",
    type: "Dine-in, Delivery",
    featured: false,
  },
  {
    id: "3",
    name: "Sweet Magic",
    rating: 4.7,
    time: "20 min",
    offer: "Buy 1 Get 1 Free on selected sweets",
    image: "https://res.cloudinary.com/dlkborjdl/image/upload/v1700000003/dessert.jpg",
    cuisine: "Desserts",
    type: "Takeaway, Delivery",
    featured: true,
  },
  {
    id: "4",
    name: "The Gorumet's Kitchen",
    rating: 4.8,
    time: "40 min",
    offer: "Free Cold Coffee with any main course",
    image: "https://res.cloudinary.com/dlkborjdl/image/upload/v1700000004/healthy.jpg",
    cuisine: "Healthy",
    type: "Dine-in",
    featured: true,
  },
  {
    id: "5",
    name: "Cafe Coffee Day",
    rating: 4.1,
    time: "15 min",
    offer: "Get 25% OFF on all Beverages",
    image: "https://res.cloudinary.com/dlkborjdl/image/upload/v1700000005/cafe.jpg",
    cuisine: "Drinks",
    type: "Dine-in, Takeaway",
    featured: false,
  },
];

const foodRecommendations: FoodItem[] = [
  { id: 'f1', name: 'Chicken Biryani Combo', restaurantId: '1', timeOfDay: 'afternoon' },
  { id: 'f2', name: 'Veg Sandwich & Coffee', restaurantId: '5', timeOfDay: 'morning' },
  { id: 'f3', name: 'Paneer Butter Masala', restaurantId: '4', timeOfDay: 'evening' },
  { id: 'f4', name: 'Burger with Fries', restaurantId: '2', timeOfDay: 'afternoon' },
  { id: 'f5', name: 'Cold Coffee & Pastry', restaurantId: '3', timeOfDay: 'evening' },
];

const timeBasedOffers: Offer[] = [
  { id: 'o1', title: 'Morning Breakfast Deals', subtitle: 'Flat 50% OFF on all breakfast items', timeOfDay: 'morning' },
  { id: 'o2', title: 'Lunch Combo Offers', subtitle: 'Order a combo and get a drink free', timeOfDay: 'afternoon' },
  { id: 'o3', title: 'Dinner Delights', subtitle: 'Get a free dessert on orders above ₹600', timeOfDay: 'evening' },
];

const getGreetingTime = (hour: number): 'morning' | 'afternoon' | 'evening' => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
};

// --- Main Component ---
const FoodScreen = () => {
  const [search, setSearch] = useState("");
  const [selectedChefDate, setSelectedChefDate] = useState<Date | null>(null);
  const [showChefDatePicker, setShowChefDatePicker] = useState(false);
  const [chefGuests, setChefGuests] = useState("2");
  const [chefCuisine, setChefCuisine] = useState("");
  const [isChefServiceModalVisible, setIsChefServiceModalVisible] = useState(false);
  const [timePeriod, setTimePeriod] = useState(getGreetingTime(new Date().getHours()));

  useEffect(() => {
    const updateTimePeriod = () => {
      setTimePeriod(getGreetingTime(new Date().getHours()));
    };
    const interval = setInterval(updateTimePeriod, 60 * 60 * 1000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const handleChefBooking = () => {
    if (!selectedChefDate || !chefGuests || !chefCuisine) {
      Alert.alert("Missing Details", "Please fill in all details.");
      return;
    }
    const message = `Booking a chef for:\n\nDate: ${selectedChefDate.toLocaleDateString()}\nGuests: ${chefGuests}\nCuisine: ${chefCuisine}`;
    Alert.alert("Booking Confirmed!", message);
    setIsChefServiceModalVisible(false);
  };

  const filteredRestaurants = useMemo(() => {
    if (!search) {
      return restaurants;
    }
    const lowercasedSearch = search.toLowerCase();
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(lowercasedSearch) ||
        restaurant.cuisine.toLowerCase().includes(lowercasedSearch)
    );
  }, [search]);

  const recommendedItem = useMemo(() => {
    const item = foodRecommendations.find(f => f.timeOfDay === timePeriod);
    const restaurant = restaurants.find(r => r.id === item?.restaurantId);
    if (item && restaurant) {
      return `${item.name} from ${restaurant.name}.`;
    }
    return 'We have a variety of delicious food for you!';
  }, [timePeriod]);

  const renderSectionHeader = (title: string) => (
    <Text style={styles.title}>{title}</Text>
  );

  const renderFeaturedRestaurants = () => (
    <View style={styles.section}>
      {renderSectionHeader("Featured Restaurants")}
      <FlatList
        horizontal
        data={restaurants.filter(r => r.featured)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.featuredCard}>
            <Image source={{ uri: item.image }} style={styles.featuredImg} />
            <Text style={styles.featuredName}>{item.name}</Text>
            <Text style={styles.featuredRating}>⭐ {item.rating}</Text>
            <Text style={styles.featuredTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#555" />
        <TextInput
          placeholder="Search for food or restaurants"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <Ionicons name="mic" size={22} color="#fe6f61" />
      </View>

      {/* 🏷 Categories */}
      <View style={styles.section}>
        {renderSectionHeader("Categories")}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 🏡 Cook at Home Section */}
      <View style={styles.section}>
        {renderSectionHeader("Cook at Home")}
        <View style={styles.cookHomeCard}>
          <FontAwesome5 name="concierge-bell" size={30} color="#fe6f61" />
          <Text style={styles.cookHomeText}>
            Get a professional chef to cook a special meal for you at home!
          </Text>
          <TouchableOpacity
            style={styles.cookHomeBtn}
            onPress={() => setIsChefServiceModalVisible(true)}
          >
            <Text style={styles.cookHomeBtnText}>Book a Chef</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📢 Time-Based Offers */}
      <View style={styles.section}>
        {renderSectionHeader("Exclusive Deals")}
        <FlatList
          horizontal
          data={timeBasedOffers}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
            </View>
          )}
        />
      </View>

      {/* ❤️ AI-Based Recommendation */}
      <View style={styles.section}>
        {renderSectionHeader(`Recommended For You (${timePeriod})`)}
        <Text style={styles.aiText}>
          🍴 Based on your location and time, we recommend **{recommendedItem}**
        </Text>
      </View>

      {renderFeaturedRestaurants()}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.restaurantCard}>
            <Image source={{ uri: item.image }} style={styles.restaurantImg} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.resName}>{item.name}</Text>
              <Text>⭐ {item.rating} · {item.time}</Text>
              <Text style={styles.offer}>{item.offer}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={renderHeader}
      />

      {/* 🛒 Cart Button */}
      <TouchableOpacity style={styles.cartBtn}>
        <MaterialIcons name="shopping-cart" size={24} color="white" />
        <Text style={styles.cartText}>Go to Cart</Text>
      </TouchableOpacity>

      {/* --- Chef Service Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChefServiceModalVisible}
        onRequestClose={() => setIsChefServiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chefModal}>
            <View style={styles.chefModalHeader}>
              <Text style={styles.chefModalTitle}>Book a Chef</Text>
              <TouchableOpacity onPress={() => setIsChefServiceModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.chefLabel}>Select Date & Time</Text>
              <TouchableOpacity
                onPress={() => setShowChefDatePicker(true)}
                style={styles.chefInputBtn}
              >
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.chefInputText}>
                  {selectedChefDate ? selectedChefDate.toLocaleString() : "Select Date & Time"}
                </Text>
              </TouchableOpacity>
              {showChefDatePicker && (
                <DateTimePicker
                  value={selectedChefDate || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={(event, date) => {
                    setShowChefDatePicker(false);
                    setSelectedChefDate(date);
                  }}
                />
              )}

              <Text style={styles.chefLabel}>Number of Guests</Text>
              <TextInput
                style={styles.chefInput}
                keyboardType="numeric"
                value={chefGuests}
                onChangeText={setChefGuests}
                placeholder="e.g., 4"
              />

              <Text style={styles.chefLabel}>Preferred Cuisine</Text>
              <TextInput
                style={styles.chefInput}
                value={chefCuisine}
                onChangeText={setChefCuisine}
                placeholder="e.g., North Indian, Italian"
              />
            </ScrollView>
            <TouchableOpacity style={styles.chefBtn} onPress={handleChefBooking}>
              <Text style={styles.chefBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  input: { flex: 1, padding: 8, fontSize: 16 },
  section: { marginVertical: 10, paddingHorizontal: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  // Categories
  categoryCard: {
    backgroundColor: "#fce4ec",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    width: 85,
    height: 85,
    justifyContent: 'center',
  },
  categoryIcon: { fontSize: 28, textAlign: 'center' },
  categoryText: { marginTop: 5, fontWeight: "600", fontSize: 12, textAlign: 'center' },
  // Restaurants
  restaurantCard: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 10,
  },
  restaurantImg: { width: 80, height: 80, borderRadius: 10 },
  restaurantInfo: { marginLeft: 10, flex: 1, justifyContent: "center" },
  resName: { fontSize: 16, fontWeight: "bold" },
  offer: { color: "green", fontWeight: "bold" },
  // Featured Restaurants
  featuredCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 12,
    paddingBottom: 10,
  },
  featuredImg: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  featuredRating: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  featuredTime: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  // Extra Features
  aiText: {
    fontSize: 15,
    color: "#444",
    marginTop: 5,
    marginHorizontal: 10,
  },
  cookHomeCard: {
    backgroundColor: '#f0f4f7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cookHomeText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    color: '#333',
  },
  cookHomeBtn: {
    backgroundColor: '#fe6f61',
    padding: 10,
    borderRadius: 8,
  },
  cookHomeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Offers
  offerCard: {
    width: 250,
    height: 100,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    marginRight: 10,
    padding: 15,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b45309',
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#b45309',
  },
  // Cart
  cartBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fe6f61",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 30,
    elevation: 5,
  },
  cartText: { color: "white", fontSize: 16, marginLeft: 10, fontWeight: "bold" },
  // Chef Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chefModal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  chefModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chefModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chefLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  chefInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  chefInputBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  chefInputText: {
    marginLeft: 10,
  },
  chefBtn: {
    backgroundColor: '#fe6f61',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  chefBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
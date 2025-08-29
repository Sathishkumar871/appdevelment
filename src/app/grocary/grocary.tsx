import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Type Definitions ---
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  category: string;
};

type Offer = {
  id: string;
  title: string;
  image: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

// --- Mock Data ---
const categories: Category[] = [
  { id: '1', name: 'Vegetables', icon: '🥕' },
  { id: '2', name: 'Fruits', icon: '🍎' },
  { id: '3', name: 'Dairy', icon: '🥛' },
  { id: '4', name: 'Snacks', icon: '🍟' },
  { id: '5', name: 'Beverages', icon: '🥤' },
  { id: '6', name: 'Staples', icon: '🍚' },
];

const offers: Offer[] = [
  { id: 'o1', title: 'Fresh Fruits', image: 'https://ik.imagekit.io/your_imagekit_id/offers_fruit.jpg' },
  { id: 'o2', title: 'Dairy Deals', image: 'https://ik.imagekit.io/your_imagekit_id/offers_dairy.jpg' },
  { id: 'o3', title: 'Snack Packs', image: 'https://ik.imagekit.io/your_imagekit_id/offers_snacks.jpg' },
];

const products: Product[] = [
  { id: 'p1', name: 'Tomato', price: 25, unit: '500g', category: 'Vegetables', image: 'https://ik.imagekit.io/your_imagekit_id/tomato.jpg' },
  { id: 'p2', name: 'Potato', price: 30, unit: '1kg', category: 'Vegetables', image: 'https://ik.imagekit.io/your_imagekit_id/potato.jpg' },
  { id: 'p3', name: 'Onion', price: 40, unit: '1kg', category: 'Vegetables', image: 'https://ik.imagekit.io/your_imagekit_id/onion.jpg' },
  { id: 'p4', name: 'Apple', price: 150, unit: '500g', category: 'Fruits', image: 'https://ik.imagekit.io/your_imagekit_id/apple.jpg' },
  { id: 'p5', name: 'Banana', price: 60, unit: '1 dozen', category: 'Fruits', image: 'https://ik.imagekit.io/your_imagekit_id/banana.jpg' },
  { id: 'p6', name: 'Milk', price: 28, unit: '500ml', category: 'Dairy', image: 'https://ik.imagekit.io/your_imagekit_id/milk.jpg' },
  { id: 'p7', name: 'Bread', price: 35, unit: '400g', category: 'Dairy', image: 'https://ik.imagekit.io/your_imagekit_id/bread.jpg' },
  { id: 'p8', name: 'Chips', price: 20, unit: '1 packet', category: 'Snacks', image: 'https://ik.imagekit.io/your_imagekit_id/chips.jpg' },
  { id: 'p9', name: 'Coca-Cola', price: 40, unit: '1.25L', category: 'Beverages', image: 'https://ik.imagekit.io/your_imagekit_id/cocacola.jpg' },
  { id: 'p10', name: 'Rice', price: 60, unit: '1kg', category: 'Staples', image: 'https://ik.imagekit.io/your_imagekit_id/rice.jpg' },
  { id: 'p11', name: 'Detergent', price: 120, unit: '1kg', category: 'Staples', image: 'https://ik.imagekit.io/your_imagekit_id/detergent.jpg' },
];

const GrocaryScreen = () => {
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState(0);

  const filteredProducts = useMemo(() => {
    if (!search) {
      return products;
    }
    const lowercasedSearch = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.category.toLowerCase().includes(lowercasedSearch)
    );
  }, [search]);

  const handleAddToCart = () => {
    setCartItems(cartItems + 1);
    Alert.alert('Added to Cart', 'Item has been added to your cart.');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productUnit}>{item.unit}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView stickyHeaderIndices={[0]} style={styles.container}>
        {/* Header and Search Bar */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#fe6f61" />
            <Text style={styles.locationText}>Rajahmundry</Text>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={22} color="#555" />
            <TextInput
              placeholder="Search for groceries"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Quick Delivery Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: 'https://ik.imagekit.io/your_imagekit_id/delivery_banner.jpg' }}
              style={styles.deliveryBanner}
            />
            <View style={styles.deliveryTextOverlay}>
              <Text style={styles.deliveryTitle}>Delivered in 10-20 mins</Text>
              <Text style={styles.deliverySubtitle}>Fresh groceries, fast!</Text>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.title}>Shop by Category</Text>
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

          {/* Offers */}
          <View style={styles.section}>
            <Text style={styles.title}>Exclusive Offers</Text>
            <FlatList
              horizontal
              data={offers}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.offerCard}>
                  <Image source={{ uri: item.image }} style={styles.offerImage} />
                  <Text style={styles.offerTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Product Grid */}
          <View style={styles.section}>
            <Text style={styles.title}>All Products</Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderProductItem}
              numColumns={2}
              columnWrapperStyle={styles.productGrid}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>

      {/* Cart Button */}
      {cartItems > 0 && (
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart" size={24} color="white" />
          <Text style={styles.cartText}>View Cart ({cartItems})</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default GrocaryScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  bannerContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    height: 120,
  },
  deliveryBanner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deliveryTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  deliveryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryCard: {
    width: 80,
    height: 80,
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  offerCard: {
    width: 250,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  productGrid: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productUnit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34D399',
  },
  addButton: {
    backgroundColor: '#fe6f61',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fe6f61',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 30,
    elevation: 5,
  },
  cartText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
// File: app/category.tsx

import React, { useEffect, useState, ReactElement } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5
} from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

// --- Interface for the service data ---
interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
}

// --- Sample Data (Simulating a database) ---
const allServices: Service[] = [
    { _id: 'app1', name: 'AC Repair', description: 'Expert repair for all AC models.', category: 'Appliances' },
    { _id: 'app2', name: 'Washing Machine', description: 'Quick and reliable service.', category: 'Appliances' },
    { _id: 'fur1', name: 'Sofa Assembly', description: 'Professional assembly service.', category: 'Furniture' },
    { _id: 'elec1', name: 'Wiring & Fixtures', description: 'Safe and certified electricians.', category: 'Electrical service' },
    { _id: 'fit1', name: 'Personal Trainer', description: 'Get fit with a dedicated coach.', category: 'Fitness' },
    { _id: 'beau1', name: 'Home Salon', description: 'Beauty services at your doorstep.', category: 'Beauty & Grooming' },
    { _id: 'gad1', name: 'Mobile Screen Repair', description: 'Fast screen replacement.', category: 'Gadget Repair' },
    { _id: 'car1', name: 'Car Wash & Detailing', description: 'Get your car shining like new.', category: 'Vehicle Services' },
    { _id: 'photo1', name: 'Wedding Photography', description: 'Capture your special moments.', category: 'Photography' },
    { _id: 'plum1', name: 'Leak Repair', description: '24/7 emergency plumbing service.', category: 'Plumbing' },
    { _id: 'plum2', name: 'Pipe Installation', description: 'Expert installation services.', category: 'Plumbing' },
];

// --- Icon Map using @expo/vector-icons ---
const iconMap: Record<string, ReactElement> = {
  'Appliances': <MaterialIcons name="kitchen" size={28} />,
  'Furniture': <FontAwesome5 name="couch" size={28} />,
  'Electrical service': <MaterialIcons name="electrical-services" size={28} />,
  'Fitness': <MaterialIcons name="fitness-center" size={28} />,
  'Beauty & Grooming': <FontAwesome5 name="spa" size={28} />,
  'Gadget Repair': <FontAwesome name="laptop" size={28} />,
  'Vehicle Services': <FontAwesome5 name="car-crash" size={28} />,
  'Interior & Furniture': <FontAwesome5 name="couch" size={28} />,
  'Marriage Match': <FontAwesome5 name="user-friends" size={28} />,
  'Event Services': <MaterialIcons name="event" size={28} />,
  'Medical Services': <MaterialIcons name="medical-services" size={28} />,
  'Document Services': <FontAwesome name="file-text" size={28} />,
  'Job Support': <FontAwesome5 name="building" size={28} />,
  'Education': <MaterialIcons name="school" size={28} />,
  'Security Services': <MaterialIcons name="security" size={28} />,
  'Photography': <FontAwesome name="camera" size={28} />,
  'Home Services': <MaterialIcons name="miscellaneous-services" size={28} />,
  'Plumbing': <MaterialIcons name="plumbing" size={28} />,
  'Tools': <FontAwesome5 name="tools" size={28} />,
  'Engineering': <MaterialIcons name="engineering" size={28} />,
};

const CategoryScreen: React.FC = () => {
  const [categories] = useState<string[]>([
    'Appliances','Furniture','Electrical service','Fitness','Beauty & Grooming',
    'Gadget Repair','Vehicle Services','Photography','Plumbing','Tools','Engineering'
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Effect to fetch services when category changes ---
  useEffect(() => {
    setLoading(true);
    // Simulate an API call to fetch data
    const timer = setTimeout(() => {
      const filteredServices = allServices.filter(s => s.category === selectedCategory);
      setServices(filteredServices.length > 0 ? filteredServices : [{ _id: 'none', name: 'No Services Available', description: 'Check back later for services in this category.', category: selectedCategory }]);
      setLoading(false);
    }, 500); // 0.5-second delay to show loading indicator

    return () => clearTimeout(timer); // Cleanup timer
  }, [selectedCategory]);

  // --- Render a single service card ---
  const renderServiceCard = ({ item, index }: { item: Service, index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }}
      style={styles.serviceCard}
    >
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      {item._id !== 'none' && (
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}
    </MotiView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoryLayout}>
        {/* --- Left Animated Sidebar --- */}
        <View style={styles.sidebarContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical: 20}}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryIconItem}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <MotiView
                    style={styles.iconCircle}
                    animate={{ 
                      backgroundColor: isActive ? '#4A90E2' : '#f0f0f0',
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  >
                    {React.cloneElement(
                      iconMap[cat] || <MaterialIcons name="miscellaneous-services" size={28} />,
                      { color: isActive ? '#fff' : '#333' }
                    )}
                  </MotiView>
                  <Text style={[styles.iconLabel, isActive && styles.activeIconLabel]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- Right Main Area with Animated Content --- */}
        <View style={styles.servicesArea}>
          <Text style={styles.servicesHeader}>{selectedCategory}</Text>
          <AnimatePresence>
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
              </View>
            ) : (
              <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                renderItem={renderServiceCard}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </AnimatePresence>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  categoryLayout: { flex: 1, flexDirection: 'row' },
  sidebarContainer: {
    width: 95, // Slightly smaller size
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  categoryIconItem: { alignItems: 'center', marginBottom: 25 },
  iconCircle: {
    borderRadius: 28, // More circular
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeIconLabel: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  servicesArea: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  servicesHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  serviceName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 8,
  },
  bookButton: {
    marginTop: 12,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CategoryScreen;
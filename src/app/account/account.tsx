import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Animated, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- 1. Animation Component: Reusable for a premium feel on all buttons ---
const AnimatedPressable = ({ children, onPress, style }: { children: React.ReactNode, onPress?: () => void, style?: any }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

// --- Color Palette for the new theme ---
const colors = {
  background: '#0D0D1A', // Deep space blue/purple
  surface: 'rgba(30, 30, 48, 0.7)', // Semi-transparent glass surface
  primary: '#D1A3FF', // Lighter, more vibrant purple
  text: '#F0F0F8',
  textSecondary: '#A0A0B3',
  border: 'rgba(209, 163, 255, 0.2)', // Subtle purple border
  auroraPurple: 'rgba(176, 106, 252, 0.15)',
  auroraBlue: 'rgba(56, 178, 255, 0.15)',
};

const AccountPage: React.FC = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- 4. Updated Features (Wallet removed, new ones added) ---
  const quickActions = [
    { label: "Orders", icon: "cube-outline", route: "/current-orders" },
    { label: "Addresses", icon: "location-outline", route: "/addresses" },
    { label: "Support", icon: "help-buoy-outline", route: "/support" },
  ];
  
  const menuItems = [
    { label: "My Subscriptions", icon: "calendar-outline", route: "/subscriptions" },
    { label: "Past Orders", icon: "receipt-outline", route: "/past-orders" },
    { label: "Notifications", icon: "notifications-outline", route: "/notifications" },
    { label: "Login & Security", icon: "lock-closed-outline", route: "/security" },
    { label: "Privacy Policy", icon: "shield-checkmark-outline", route: "/policy" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- 2. Aurora Background Effect --- */}
      <View style={[styles.auroraCircle, styles.auroraPurple]} />
      <View style={[styles.auroraCircle, styles.auroraBlue]} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Account</Text>
        
        {/* --- 3. Editable Profile Card with Animation --- */}
        <AnimatedPressable onPress={() => router.push('/edit-profile')}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={32} color={colors.primary} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.userName}>User Name</Text>
              <Text style={styles.userEmail}>user.name@example.com</Text>
            </View>
            <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
          </View>
        </AnimatedPressable>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <AnimatedPressable key={action.label} style={styles.quickActionItem} onPress={() => router.push(action.route)}>
               <Ionicons name={action.icon as any} size={26} color={colors.primary} />
               <Text style={styles.quickActionLabel}>{action.label}</Text>
            </AnimatedPressable>
          ))}
        </View>

        <View style={styles.menuListContainer}>
          {/* --- Dark Mode Toggle Feature --- */}
          <View style={[styles.menuItem, { paddingVertical: 10 }]}>
            <Ionicons name="contrast-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.menuItemLabel}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
              onValueChange={() => setIsDarkMode(previousState => !previousState)}
              value={isDarkMode}
            />
          </View>

          {menuItems.map((item) => (
             <AnimatedPressable key={item.label} onPress={() => router.push(item.route)}>
              <View style={styles.menuItem}>
                <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward-outline" size={22} color={colors.textSecondary} />
              </View>
            </AnimatedPressable>
          ))}
        </View>

        <AnimatedPressable style={styles.logoutButton}>
           <Text style={styles.logoutButtonText}>Logout</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  // --- 2. Aurora Background Styles ---
  auroraCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  auroraPurple: {
    backgroundColor: colors.auroraPurple,
    top: -100,
    left: -150,
  },
  auroraBlue: {
    backgroundColor: colors.auroraBlue,
    bottom: -150,
    right: -200,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(209, 163, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionItem: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  quickActionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 8,
  },
  menuListContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 20,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: 'rgba(209, 163, 255, 0.1)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountPage;
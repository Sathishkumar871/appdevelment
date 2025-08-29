// app/policy.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PolicyPage: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>AtoZServo.xyz Comprehensive Privacy Policy</Text>
        <Text style={styles.date}>Effective Date: July 7, 2025</Text>

        <Text style={styles.paragraph}>
          This Privacy Policy describes how AtoZServo.xyz collects, uses, and protects
          your information when you use our services...
        </Text>

        {/* Example section */}
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide to us such as name, email, phone number,
          and usage data...
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>Last updated: July 7, 2025</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fe6f61",
    padding: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#333" },
  date: { fontSize: 14, color: "#666", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 10 },
  footer: { fontSize: 12, color: "#999", marginTop: 20, textAlign: "center" },
});

export default PolicyPage;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, Ionicons } from "@expo/vector-icons";
import Fuse from "fuse.js";
import axios from "axios";

type Service = {
  name: string;
  image: string;
};

const SearchBar = ({ navigation }: any) => {
  const [keyword, setKeyword] = useState("");
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [results, setResults] = useState<Service[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // ✅ Load services
  useEffect(() => {
    axios
      .get("https://your-api-url.com/api/services")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const validServices = res.data.filter(
            (item): item is Service =>
              typeof item.name === "string" && typeof item.image === "string"
          );
          setAllServices(validServices);
        }
      })
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

  // ✅ Search logic
  useEffect(() => {
    if (keyword.trim()) {
      const fuse = new Fuse(allServices, {
        keys: ["name"],
        threshold: 0.4,
      });
      const matches = fuse.search(keyword).map((res) => res.item);
      setResults(matches);
      setShowSuggestions(true);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  }, [keyword]);

  // ✅ Clear input
  const clearInput = () => {
    setKeyword("");
    setResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // ✅ Voice Search (Placeholder)
  const handleVoiceSearch = () => {
    console.log("🎤 Voice search clicked (add react-native-voice here)");
  };

  return (
    <>
      <View style={styles.wrapper}>
        <BlurView intensity={40} tint="light" style={styles.searchBar}>
          <Feather
            name="search"
            size={16}
            color="#280646ff"
            style={styles.icon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search services..."
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {keyword ? (
            <TouchableOpacity onPress={clearInput}>
              <Ionicons name="close" size={20} color="#ff335f" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVoiceSearch}>
              <Feather name="mic" size={18} color="#ff335f" />
            </TouchableOpacity>
          )}
        </BlurView>
      </View>

      {showSuggestions && (
        <View style={styles.dropdown}>
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() =>
                    navigation?.navigate("ServiceDetails", {
                      serviceName: item.name,
                    })
                  }
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noResults}>❌ No matching services.</Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    marginTop: 8 + 60, // adjust for sticky bar height
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: "#5d5d81",
  },
  noResults: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#ff335f",
    fontSize: 14,
  },
});

export default SearchBar;

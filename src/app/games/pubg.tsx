// app/pubg.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PubgScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PUBG Screen</Text>
      {/* మీరు ఈ పేజీకి సంబంధించిన డిజైన్‌ను ఇక్కడ యాడ్ చేయవచ్చు */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        color: '#fff',
    }
});

export default PubgScreen;
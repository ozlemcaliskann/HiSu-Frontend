import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FENS() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mühendislik ve Doğa Bilimleri Fakültesi</Text>
      <Text style={styles.content}>Bu sayfa yakında eklenecektir.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002B5C',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
}); 
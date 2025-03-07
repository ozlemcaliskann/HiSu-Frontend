import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function CampusMap() {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Kampüs Haritası</Text>
        <Text style={styles.comingSoonText}>Yakında Eklenecek</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 10,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B5C',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
  },
}); 
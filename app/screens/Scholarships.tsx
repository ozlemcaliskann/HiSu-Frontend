import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ScholarshipScreen = () => {
  const scholarshipUrl = 'https://www.sabanciuniv.edu/tr/lisans-programlari-burs-ve-ucretleri';

  const openScholarshipPage = async () => {
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(scholarshipUrl);
    if (canOpen) {
      await Linking.openURL(scholarshipUrl);
    } else {
      console.error("Cannot open URL");
      // You could show an error message to the user here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.hisuText}>HiSU</Text>
        </Text>
        <Text style={styles.appTagline}>app for all of us</Text>
        <Text style={styles.scholarshipTitle}>Scholarships</Text>
      </View>

      <View style={styles.contentContainer}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png' }} 
          style={styles.scholarshipIcon} 
        />
        
        <Text style={styles.infoText}>
          View information about Sabancı University's undergraduate program scholarships,
          application requirements, and tuition fees.
        </Text>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={openScholarshipPage}
        >
          <Text style={styles.viewButtonText}>VIEW SCHOLARSHIPS</Text>
        </TouchableOpacity>
        
        <Text style={styles.noteText}>
          This will open the scholarships page in your device's web browser.
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  hisuText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72', // Dark blue
  },
  appTagline: {
    fontSize: 16,
    color: '#4B7BEC', // Blue for the app tagline
    marginTop: -5,
  },
  scholarshipTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scholarshipIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ScholarshipScreen;
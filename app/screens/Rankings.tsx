import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const RankingScreen = () => {
  const rankingUrl = 'https://www.sabanciuniv.edu/tr/2023-taban-puan-siralama-2023-2024-kontenjanlar';

  const openRankingsPage = async () => {
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(rankingUrl);
    if (canOpen) {
      await Linking.openURL(rankingUrl);
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
        <Text style={styles.rankingsTitle}>Rankings</Text>
      </View>

      <View style={styles.contentContainer}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3004/3004584.png' }} 
          style={styles.rankingIcon} 
        />
        
        <Text style={styles.infoText}>
          View Sabancı University's latest ranking information, including base points, 
          placement rankings, and quotas for the 2023-2024 academic year.
        </Text>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={openRankingsPage}
        >
          <Text style={styles.viewButtonText}>VIEW RANKINGS</Text>
        </TouchableOpacity>
        
        <Text style={styles.noteText}>
          This will open the rankings page in your device's web browser.
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
  rankingsTitle: {
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
  rankingIcon: {
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

export default RankingScreen;
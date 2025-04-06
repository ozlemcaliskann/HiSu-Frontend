import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Sample instructor data for FMAN with image URLs
const FMAN_INSTRUCTORS = [
  {
    id: 1,
    name: "Serkan Kaplan",
    image: "https://randomuser.me/api/portraits/men/33.jpg", // Professional woman with folder
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    image: "https://randomuser.me/api/portraits/women/54.jpg", // Another professional woman
  },
];

// Instructor Component
interface InstructorCardProps {
  name: string;
  image: string;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ name, image }) => {
  return (
    <View style={styles.instructorContainer}>
      <Image 
        source={{ uri: image }} 
        style={styles.instructorImage} 
        defaultSource={{ uri: 'https://via.placeholder.com/120' }} // Fallback
      />
      <View style={styles.instructorButtonsContainer}>
        <TouchableOpacity style={styles.instructorButton}>
          <Text style={styles.instructorButtonText}>{name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instructorButton}>
          <Text style={styles.instructorButtonText}>Office info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instructorButton}>
          <Text style={styles.instructorButtonText}>mail</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

// FMAN Screen Component
const FMANScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            FMAN <Text style={styles.hisuText}>HiSU</Text>
          </Text>
          <Text style={styles.appTagline}>app for all of us</Text>
          <Text style={styles.facultyTitle}>FMAN</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About FMAN</Text>
          <Text style={styles.description}>
            Sabancı University's Faculty of Management (FMAN) provides education and research in 
            business administration, economics, finance, and related disciplines. It offers programs 
            designed to prepare students for leadership roles in business and management.
          </Text>
        </View>

        <View style={styles.instructorsSection}>
          <Text style={styles.sectionTitle}>Instructors</Text>
          {FMAN_INSTRUCTORS.map((instructor) => (
            <InstructorCard 
              key={instructor.id} 
              name={instructor.name} 
              image={instructor.image} 
            />
          ))}
          <TouchableOpacity style={styles.instructorCountButton}>
            <Text style={styles.instructorCountText}>
              90 instructors
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Progress Bar removed */}
      
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
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72', // Dark blue
  },
  hisuText: {
    color: '#27AE60', // Green for FMAN
  },
  appTagline: {
    fontSize: 16,
    color: '#27AE60', // Green for FMAN
    marginTop: -5,
  },
  facultyTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72',
    marginTop: 10,
  },
  aboutSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002D72',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  instructorsSection: {
    padding: 20,
  },
  instructorContainer: {
    marginBottom: 20,
  },
  instructorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  instructorButtonsContainer: {
    marginLeft: 130,
    marginTop: -120,
  },
  instructorButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  instructorButtonText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  instructorCountButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  instructorCountText: {
    fontSize: 16,
    color: '#333',
  },
  progressBarContainer: {
    position: 'absolute',
    right: 20,
    top: 200,
    bottom: 200,
    width: 20,
    justifyContent: 'center',
  },
  progressBar: {
    width: 20,
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#27AE60', // Green for FMAN
    position: 'relative',
  },
  progressIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#002D72',
    position: 'absolute',
    top: '50%',
    left: -10,
  },
});

export default FMANScreen;
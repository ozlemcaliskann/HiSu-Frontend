import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpTHvSKUzEiTbMW_EbcChHvXrNAIA4E3c",
  authDomain: "hisu-a8493.firebaseapp.com",
  projectId: "hisu-a8493",
  storageBucket: "hisu-a8493.firebasestorage.app",
  messagingSenderId: "792408514806",
  appId: "1:792408514806:web:82ad3d3fbad419b3740cd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Instructor Component
interface InstructorCardProps {
  name: string;
  image: string;
  field: string;
  email: string;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ name, image, field, email }) => {
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
          <Text style={styles.instructorButtonText}>{field || "Specialization"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.instructorButton}>
          <Text style={styles.instructorButtonText}>{email}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

// Type for Teacher data
interface Teacher {
  id: string;
  name?: string;
  imageUrl?: string;
  title?: string;
  email?: string;
  field?: string;
  faculty?: string;
}

// FASS Screen Component
const FASSScreen = () => {
  const [instructors, setInstructors] = useState<Teacher[]>([]);
  const [instructorCount, setInstructorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Get data from the "teachers" collection
        const teachersCollection = collection(db, "teachers");
        const teachersSnapshot = await getDocs(teachersCollection);
        const teachersList = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teacher[];
        
        // Filter for FASS faculty
        const fassFaculty = teachersList.filter(teacher => 
          teacher.faculty === "Faculty of Arts and Social Sciences"
        );
        
        setInstructors(fassFaculty);
        setInstructorCount(fassFaculty.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers: ", error);
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            FASS <Text style={styles.hisuText}>HiSU</Text>
          </Text>
          <Text style={styles.appTagline}>app for all of us</Text>
          <Text style={styles.facultyTitle}>FASS</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About FASS</Text>
          <Text style={styles.description}>
            Sabancı University's Faculty of Arts and Social Sciences (FASS) offers programs in 
            humanities, social sciences, cultural studies, and related fields. It emphasizes 
            interdisciplinary education and research.
          </Text>
        </View>

        <View style={styles.instructorsSection}>
          <Text style={styles.sectionTitle}>Instructors</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#8E44AD" />
          ) : (
            <>
              {instructors.map((instructor) => (
                <InstructorCard 
                  key={instructor.id} 
                  name={instructor.name || "Unknown Name"}
                  image={instructor.imageUrl || 'https://via.placeholder.com/120'}
                  field={instructor.field || "No field information"}
                  email={instructor.email || "No email available"}
                />
              ))}
              <TouchableOpacity style={styles.instructorCountButton}>
                <Text style={styles.instructorCountText}>
                  {instructorCount} instructors
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      
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
    color: '#8E44AD', // Purple for FASS
  },
  appTagline: {
    fontSize: 16,
    color: '#8E44AD', // Purple for FASS
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
});

export default FASSScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ProgramInfoScreen = () => {
  const programInfoUrl = 'https://www.sabanciuniv.edu/tr/lisans-programlari-bilgileri';
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const programCategories = [
    {
      id: 'engineering',
      title: 'Engineering Programs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3022/3022299.png',
      programs: ['Computer Science & Engineering', 'Electronics Engineering', 'Industrial Engineering', 'Mechatronics Engineering', 'Materials Science & Engineering'],
    },
    {
      id: 'science',
      title: 'Science Programs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3254/3254075.png',
      programs: ['Mathematics', 'Physics', 'Molecular Biology, Genetics & Bioengineering'],
    },
    {
      id: 'arts',
      title: 'Arts & Social Sciences',
      icon: 'https://cdn-icons-png.flaticon.com/512/2302/2302834.png',
      programs: ['Economics', 'Visual Arts & Visual Communication Design', 'Cultural Studies', 'International Studies', 'Psychology'],
    },
    {
      id: 'management',
      title: 'Management Programs',
      icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281342.png',
      programs: ['Business Analytics', 'Finance', 'Business Administration', 'Management'],
    },
  ];

  const openProgramInfoPage = async () => {
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(programInfoUrl);
    if (canOpen) {
      await Linking.openURL(programInfoUrl);
    } else {
      console.error("Cannot open URL");
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.hisuText}>HiSU</Text>
        </Text>
        <Text style={styles.appTagline}>app for all of us</Text>
        <Text style={styles.pageTitle}>Program Info</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2436/2436874.png' }} 
            style={styles.mainIcon} 
          />
          
          <Text style={styles.infoText}>
            Explore Sabancı University's undergraduate programs across various disciplines.
          </Text>
          
          <View style={styles.programCategoriesContainer}>
            {programCategories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.expandIcon}>{expandedCategory === category.id ? '−' : '+'}</Text>
                </TouchableOpacity>
                
                {expandedCategory === category.id && (
                  <View style={styles.programsContainer}>
                    {category.programs.map((program, index) => (
                      <Text key={index} style={styles.programText}>• {program}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={openProgramInfoPage}
          >
            <Text style={styles.viewButtonText}>VIEW DETAILED PROGRAM INFO</Text>
          </TouchableOpacity>
          
          <Text style={styles.noteText}>
            For complete program details, application requirements, and curriculum information, visit the official program information page.
          </Text>
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
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002D72',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  mainIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
    color: '#333',
  },
  programCategoriesContainer: {
    width: '100%',
    marginBottom: 30,
  },
  categoryContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#002D72',
  },
  expandIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B7BEC',
  },
  programsContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  programText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    paddingLeft: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});

export default ProgramInfoScreen;

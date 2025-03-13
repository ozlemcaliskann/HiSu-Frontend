import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Linking } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from "@/constants/firebase";

interface SideMenuProps {
  onClose: () => void;
}

export default function SideMenu({ onClose }: SideMenuProps) {
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("🚪 User logged out");
      router.replace('/(auth)/LoginScreen' as any);
    });
  };

  const navigateToScreen = (screen: string) => {
    router.push(screen as any);
    onClose();
  };

  const menuItems = [
    {
      id: 'about',
      icon: <Ionicons name="information-circle-outline" size={24} color="#002B5C" />,
      title: 'Hakkımızda',
      onPress: () => navigateToScreen('/about')
    },
    {
      id: 'clubs',
      icon: <Ionicons name="people-outline" size={24} color="#002B5C" />,
      title: 'Kulüp Aktiviteleri',
      onPress: () => navigateToScreen('/clubs')
    },
    {
      id: 'programs',
      icon: <FontAwesome5 name="graduation-cap" size={20} color="#002B5C" />,
      title: 'Program Bilgileri',
      onPress: () => navigateToScreen('/programs')
    }
  ];

  const faculties = [
    {
      id: 'fens',
      title: 'Mühendislik ve Doğa Bilimleri',
      onPress: () => navigateToScreen('/faculties/FENS')
    },
    {
      id: 'fass',
      title: 'Sanat ve Sosyal Bilimler',
      onPress: () => navigateToScreen('/faculties/FASS')
    },
    {
      id: 'fman',
      title: 'Yönetim Bilimleri',
      onPress: () => navigateToScreen('/faculties/FMAN')
    }
  ];

  const additionalItems = [
    {
      id: 'rankings',
      icon: <MaterialIcons name="bar-chart" size={24} color="#002B5C" />,
      title: 'Taban Puanlar ve Sıralamalar',
      onPress: () => {
        Linking.openURL('https://www.sabanciuniv.edu/tr/2023-taban-puan-siralama-2023-2024-kontenjanlar');
        onClose();
      }
    },
    {
      id: 'scholarships',
      icon: <MaterialIcons name="attach-money" size={24} color="#002B5C" />,
      title: 'Burslar ve Ücretler',
      onPress: () => {
        Linking.openURL('https://www.sabanciuniv.edu/en/node/179');
        onClose();
      }
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HiSU</Text>
        <Text style={styles.subtitle}>Sabancı Üniversitesi</Text>
        <Image 
          source={require('../../assets/images/sabanci-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.facultiesSection}>
          <Text style={styles.sectionTitle}>Fakülteler</Text>
          {faculties.map(faculty => (
            <TouchableOpacity
              key={faculty.id}
              style={styles.facultyItem}
              onPress={faculty.onPress}
            >
              <Text style={styles.facultyText}>{faculty.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {additionalItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#002B5C',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  scrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 16,
    color: '#002B5C',
    marginLeft: 15,
  },
  facultiesSection: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  facultyItem: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  facultyText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF3B30',
  },
}); 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert, Image, Platform, SafeAreaView, Animated, Modal } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from "@/constants/firebase";
import CampusMap from './components/CampusMap';

interface Location {
  id: string;
  name: string;
  likes: number;
  hours: string;
  weekendHours?: string;
  location: string;
  phone: string;
  hasComments?: boolean;
}

const locations: Location[] = [
  { 
    id: '1', 
    name: 'Akkol', 
    likes: 0,
    hours: '07:30-10:40 Kahvaltı, 11:30-20:30 Öğle Yemeği - Akşam Yemeği',
    location: 'Üniversite Merkezi',
    phone: '9472-3648-2031',
    hasComments: true
  },
  { 
    id: '2', 
    name: 'Akbank', 
    likes: 0,
    hours: '08:30 - 12:30, 13:00 - 16:30 (Hafta İçi)',
    weekendHours: 'Kapalı (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '9461,9449,2042',
    hasComments: true
  },
  { 
    id: '3', 
    name: 'Coffy', 
    likes: 0,
    hours: '07:30-23:00 (Hafta içi)',
    weekendHours: '09:30-18:00 (Hafta sonu)',
    location: 'Bilgi Merkezi',
    phone: '7879',
    hasComments: true
  },
  {
    id: '4',
    name: 'Copy Center - Merkom',
    likes: 0,
    hours: '08:30 -16:45 (Hafta içi)',
    weekendHours: 'Haftasonu (Pazar)',
    location: 'Üniversite Merkezi',
    phone: '9460',
    hasComments: true
  },
  {
    id: '5',
    name: 'Espressolab',
    likes: 0,
    hours: '09:00 - 24:30 (Hafta İçi)',
    weekendHours: '14:00 - 23:30 (Hafta Sonu)',
    location: 'Kampüs',
    phone: '4328-4335',
    hasComments: true
  },
  {
    id: '6',
    name: 'Era Kuaför',
    likes: 0,
    hours: '08:30-19:00 (Hafta İçi)',
    weekendHours: '08:30-17:00 (Cumartesi), Kapalı (Pazar)',
    location: 'Satınalma ve Destek Hizmetler',
    phone: '9913',
    hasComments: true
  },
  {
    id: '7',
    name: 'Fasshane',
    likes: 0,
    hours: '08:00 - 16:00 (Hafta içi)',
    weekendHours: '09:00 - 17:00 (Hafta sonu)',
    location: 'Sanat ve Sosyal Bilimler Fakültesi',
    phone: '3090',
    hasComments: true
  },
  {
    id: '8',
    name: 'Gift Shop',
    likes: 0,
    hours: '08:30 - 16:30 (Hafta içi)',
    location: 'Üniversite Merkezi',
    phone: '2050',
    hasComments: true
  },
  {
    id: '9',
    name: 'Gürsel Turizm',
    likes: 0,
    hours: '08:30-23:00 (Tüm hafta)',
    location: 'Shuttle Servis Alanı',
    phone: '9492',
    hasComments: true
  },
  {
    id: '10',
    name: 'Haberleşme Merkezi',
    likes: 0,
    hours: '08:30 - 16:50 (Hafta içi)',
    weekendHours: '08:30 - 15:45 (Cumartesi), Kapalı (Pazar)',
    location: 'Sosyal Hizmetler Binası (D2)',
    phone: '9915',
    hasComments: true
  },
  {
    id: '11',
    name: 'Homer Kitabevi - Kırtasiye',
    likes: 0,
    hours: '08:30 - 16:45 (Hafta İçi)',
    weekendHours: 'Kapalı (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '9467 - 9454',
    hasComments: true
  },
  {
    id: '12',
    name: 'Köpüklü Kahve',
    likes: 0,
    hours: '09:00 - 02:30',
    location: 'Kampüs',
    phone: '9942',
    hasComments: true
  },
  {
    id: '13',
    name: 'Küçük Ev',
    likes: 0,
    hours: '09:00 - 19:00 (Hafta İçi)',
    weekendHours: '11:00 - 19:00 (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '7585',
    hasComments: true
  },
  {
    id: '14',
    name: 'Piazza Cafe',
    likes: 0,
    hours: '08:00-02:00 (Hafta İçi)',
    weekendHours: '14:00-00:00 (Hafta Sonu)',
    location: 'Kampüs',
    phone: '0534 593 48 43',
    hasComments: true
  },
  {
    id: '15',
    name: 'Pizzabulls',
    likes: 0,
    hours: '11:00-03:00 (Hafta İçi)',
    location: 'Shuttle Servis Alanı',
    phone: '7878',
    hasComments: true
  },
  {
    id: '16',
    name: 'Suclub',
    likes: 0,
    hours: '09:00-16:00 (Hafta İçi)',
    weekendHours: 'Kapalı (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '2038',
    hasComments: true
  },
  {
    id: '17',
    name: 'Sağlık Merkezi',
    likes: 0,
    hours: '08.45-18.00/19.30-23.30 (Hergün)',
    weekendHours: 'Acil 7/24',
    location: 'Kampüs',
    phone: '9923-Emergency 6666',
    hasComments: true
  },
  {
    id: '18',
    name: 'Simit Sarayı',
    likes: 0,
    hours: '08:00-18:00 (Hafta içi)',
    weekendHours: 'Kapalı',
    location: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    phone: 'Belirtilmemiş',
    hasComments: true
  },
  {
    id: '19',
    name: 'Starbucks',
    likes: 0,
    hours: '07:00-00:00 (Hafta İçi)',
    weekendHours: '10:30-19:00 (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '3759',
    hasComments: true
  },
  {
    id: '20',
    name: 'Subway',
    likes: 0,
    hours: '11:00 - 23:00 (Tüm Hafta)',
    location: 'Shuttle Servis Alanı',
    phone: '0216 568 76 76',
    hasComments: true
  },
  {
    id: '21',
    name: 'Tepe Servis - Peyzaj',
    likes: 0,
    hours: '09:00 - 12:00/12:30 - 16:00 (Haftaiçi ofis)',
    location: 'Kampüs',
    phone: '7587',
    hasComments: true
  },
  {
    id: '22',
    name: 'Tepe Servis Yönetim A.Ş.',
    likes: 0,
    hours: '08:00-16:00 (Hafta içi - Ofis)',
    weekendHours: '08:00-16:00 (Cumartesi - Ofis)',
    location: 'Sosyal Hizmetler Binası (D2)',
    phone: '9922 - 3509',
    hasComments: true
  },
  {
    id: '23',
    name: 'Çetin Özel Güvenlik Hizmetleri A.Ş.',
    likes: 0,
    hours: '08:30 - 17:00 (Ofis Hafta içi)',
    weekendHours: '24 Saat (Diğer birimler – Her gün)',
    location: 'Üniversite İşletme Merkezi',
    phone: '9459 - 3565',
    hasComments: true
  },
  {
    id: '24',
    name: 'İlk Beş Anaokulu',
    likes: 0,
    hours: '07:45 - 17:45 (Hafta içi)',
    weekendHours: 'Kapalı (Hafta Sonu)',
    location: 'Kampüs',
    phone: '9473 - 3668',
    hasComments: true
  },
  {
    id: '25',
    name: 'Şok Market',
    likes: 0,
    hours: '08:00 - 22:00 (Hafta İçi)',
    weekendHours: '08:00 - 22:00 (Hafta Sonu)',
    location: 'Üniversite Merkezi',
    phone: '9477',
    hasComments: true
  }
];

export default function MainPage() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = new Animated.Value(-300); // Start from -300 (off-screen left)
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : -300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("🚪 User logged out");
      router.replace("/LoginScreen");
    });
  };

  const DrawerContent = () => (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>HiSU</Text>
        <Text style={styles.drawerSubtitle}>Sabancı Üniversitesi</Text>
        <Image 
          source={require('../assets/images/sabanci-logo.png')}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.drawerScroll}>
        <TouchableOpacity style={styles.drawerItem}>
          <Ionicons name="information-circle-outline" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Hakkımızda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem}>
          <Ionicons name="people-outline" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Kulüp Aktiviteleri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem}>
          <FontAwesome5 name="graduation-cap" size={20} color="#002B5C" />
          <Text style={styles.drawerText}>Program Bilgileri</Text>
        </TouchableOpacity>

        <View style={styles.facultiesSection}>
          <Text style={styles.facultiesTitle}>Fakülteler</Text>
          <TouchableOpacity style={styles.facultyItem}>
            <Text style={styles.facultyText}>Mühendislik ve Doğa Bilimleri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.facultyItem}>
            <Text style={styles.facultyText}>Sanat ve Sosyal Bilimler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.facultyItem}>
            <Text style={styles.facultyText}>Yönetim Bilimleri</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.drawerItem}>
          <MaterialIcons name="bar-chart" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Taban Puanlar ve Sıralamalar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem}>
          <MaterialIcons name="attach-money" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Burslar ve Ücretler</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const CommentsModal = () => (
    <Modal
      visible={isCommentsModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsCommentsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedLocation?.name} - Yorumlar</Text>
            <TouchableOpacity onPress={() => setIsCommentsModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.commentsList}>
            <Text style={styles.noCommentsText}>Henüz yorum yapılmamış.</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <Ionicons name="menu" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WELCOME TO</Text>
        <Text style={styles.hisuTitle}>HiSU</Text>
        <Text style={styles.subtitle}>app for all of us</Text>
      </View>

      {isDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity 
            style={styles.drawerBackground}
            onPress={() => setIsDrawerOpen(false)}
          />
          <Animated.View 
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <DrawerContent />
          </Animated.View>
        </View>
      )}

      <ScrollView style={styles.contentContainer}>
        <CampusMap />
        <View style={styles.sectionTitle}>
          <Ionicons name="business-outline" size={24} color="#002B5C" />
          <Text style={styles.sectionTitleText}>Kampüs Hizmetleri</Text>
        </View>
        <View style={styles.locationsList}>
          {locations.map((location) => (
            <View key={location.id} style={styles.locationItem}>
              <View style={styles.locationHeader}>
                <Text style={styles.locationName}>{location.name}</Text>
                <View style={styles.likesContainer}>
                  <Ionicons name="thumbs-up-outline" size={20} color="#007AFF" />
                  <Text style={styles.likesCount}>{location.likes}</Text>
                </View>
              </View>
              <View style={styles.locationDetails}>
                <View style={styles.infoContainer}>
                  <View style={styles.hoursContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.hoursText}>{location.hours}</Text>
                  </View>
                  {location.weekendHours && (
                    <Text style={styles.weekendHoursText}>{location.weekendHours}</Text>
                  )}
                  <View style={styles.locationInfoContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.locationText}>{location.location}</Text>
                  </View>
                  <View style={styles.phoneContainer}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text style={styles.phoneText}>{location.phone}</Text>
                  </View>
                </View>
                {location.hasComments && (
                  <TouchableOpacity 
                    style={styles.commentsButton}
                    onPress={() => {
                      setSelectedLocation(location);
                      setIsCommentsModalVisible(true);
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.commentsText}>Yorumlar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <CommentsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 60,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  hisuTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#002B5C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002B5C',
    marginLeft: 10,
  },
  locationsList: {
    padding: 20,
  },
  locationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007AFF',
  },
  locationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    marginLeft: 5,
    color: '#666',
  },
  weekendHoursText: {
    marginLeft: 21,
    color: '#666',
    fontSize: 12,
  },
  locationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  phoneText: {
    marginLeft: 5,
    color: '#666',
  },
  commentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsText: {
    marginLeft: 5,
    color: '#666',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    backgroundColor: '#002B5C',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  drawerSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  drawerLogo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  drawerText: {
    fontSize: 16,
    color: '#002B5C',
    marginLeft: 15,
  },
  facultiesSection: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
  },
  facultiesTitle: {
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
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  drawerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  commentsList: {
    flex: 1,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

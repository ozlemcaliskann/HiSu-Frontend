import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { DrawerLayout } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from "@/constants/firebase";

interface Location {
  id: string;
  name: string;
  likes: number;
  hours: string;
  hasComments?: boolean;
}

const locations: Location[] = [
  { id: '1', name: 'Starbucks', likes: 152, hours: '07:00 - 00:00' },
  { id: '2', name: 'Fasshane', likes: 97, hours: '07:00 - 00:00', hasComments: true },
  { id: '3', name: 'Coff', likes: 364, hours: '07:00 - 00:00', hasComments: true },
];

export default function MainPage() {
  const router = useRouter();
  const [drawerRef, setDrawerRef] = useState<DrawerLayout | null>(null);
  const [selectedDot, setSelectedDot] = useState(0);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("🚪 User logged out");
      router.replace("/LoginScreen");
    });
  };

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <Text style={styles.menuTitle}>MENU</Text>
      
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerText}>Club Activities</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.drawerItem}>
          <Text style={styles.drawerText}>Program Information</Text>
        </TouchableOpacity>
        <View style={styles.subMenu}>
          <Text style={styles.subMenuTitle}>Faculties</Text>
          <TouchableOpacity style={styles.subMenuItem}>
            <Text style={styles.subMenuText}>Fens</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subMenuItem}>
            <Text style={styles.subMenuText}>Fass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subMenuItem}>
            <Text style={styles.subMenuText}>Fman</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerText}>Minimum Scores, Rankings Quotas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerText}>Scholarships and School Fees</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayout
      ref={(ref) => setDrawerRef(ref)}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => drawerRef?.openDrawer()}
          >
            <Ionicons name="menu" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>WELCOME TO</Text>
          <Text style={styles.hisuTitle}>HiSU</Text>
          <Text style={styles.subtitle}>app for all of us</Text>
        </View>

        <View style={styles.mapSection}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#E5E7EB',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#666', fontSize: 16 }}>Campus Map</Text>
          </View>
          <View style={styles.dotIndicators}>
            {[0, 1, 2, 3].map((dot) => (
              <TouchableOpacity
                key={dot}
                onPress={() => setSelectedDot(dot)}
                style={[
                  styles.dot,
                  selectedDot === dot && styles.dotSelected
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView style={styles.locationsList}>
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
                <View style={styles.hoursContainer}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.hoursText}>{location.hours}</Text>
                </View>
                {location.hasComments && (
                  <TouchableOpacity style={styles.commentsButton}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.commentsText}>comments</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
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
  mapSection: {
    height: 300,
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  dotIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotSelected: {
    backgroundColor: '#002B5C',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationsList: {
    flex: 1,
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
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
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
    paddingTop: 60,
  },
  menuTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002B5C',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerText: {
    fontSize: 18,
    color: '#002B5C',
  },
  subMenu: {
    paddingLeft: 30,
    backgroundColor: '#F8F9FA',
  },
  subMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 10,
  },
  subMenuItem: {
    paddingVertical: 8,
  },
  subMenuText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    position: 'absolute',
    bottom: 20,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF3B30',
  },
});

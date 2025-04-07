import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Sabancı Üniversitesi kampüs koordinatları
const CAMPUS_COORDINATES = {
  latitude: 40.8911,
  longitude: 29.3780,
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

// Kampüs içindeki hizmet noktaları
const SERVICE_POINTS = [
  { id: '1', name: 'Akkol', latitude: 40.8910633, longitude: 29.3800095, color: '#e67e22', description: 'Yemekhane' },
  { id: '2', name: 'Akbank', latitude: 40.8918737, longitude: 29.3796166, color: '#3498db', description: 'Banka Şubesi' },
  { id: '3', name: 'Coffy', latitude: 40.8903156, longitude: 29.3773989, color: '#795548', description: 'Kafeterya' },
  { id: '4', name: 'Copy Center', latitude: 40.8914187, longitude: 29.3798939, color: '#9e9e9e', description: 'Fotokopi Merkezi' },
  { id: '5', name: 'EspressoLab', latitude: 40.8914583, longitude: 29.3814643, color: '#8e44ad', description: 'Kafeterya' },
  { id: '6', name: 'Era Kuaför', latitude: 40.8918512, longitude: 29.3829297, color: '#e91e63', description: 'Kuaför Salonu' },
  { id: '7', name: 'Fasshane', latitude: 40.8904792, longitude: 29.3785660, color: '#f39c12', description: 'Kafeterya' },
  { id: '8', name: 'Haberleşme Merkezi', latitude: 40.8918701, longitude: 29.3825625, color: '#607d8b', description: 'İletişim Merkezi' },
  { id: '9', name: 'Köpüklü Kahve', latitude: 40.8917212, longitude: 29.3816610, color: '#795548', description: 'Kafeterya' },
  { id: '10', name: 'Küçük Ev', latitude: 40.8910446, longitude: 29.3802500, color: '#ff5722', description: 'Kafeterya' },
  { id: '11', name: 'Piazza', latitude: 40.8919671, longitude: 29.3813932, color: '#4caf50', description: 'Kafeterya' },
  { id: '12', name: 'Pizzabulls', latitude: 40.8887403, longitude: 29.3786923, color: '#f44336', description: 'Pizza Restaurant' },
  { id: '13', name: 'Suclub', latitude: 40.8914353, longitude: 29.3799357, color: '#2196f3', description: 'İçecek Mağazası' },
  { id: '14', name: 'Sağlık Merkezi', latitude: 40.8917984, longitude: 29.3827121, color: '#e74c3c', description: 'Sağlık Hizmetleri' },
  { id: '15', name: 'Simit Sarayı', latitude: 40.8906440, longitude: 29.3791800, color: '#ff9800', description: 'Simit Kafeterya' },
  { id: '16', name: 'Starbucks', latitude: 40.8915388, longitude: 29.3800904, color: '#4CAF50', description: 'Kafeterya' },
  { id: '17', name: 'Subway', latitude: 40.8887930, longitude: 29.3787098, color: '#8BC34A', description: 'Sandviç Restaurant' },
  { id: '18', name: 'Şok Market', latitude: 40.8920577, longitude: 29.3795941, color: '#FF9800', description: 'Market' }
];

// Fakülte ve önemli binalar
const CAMPUS_BUILDINGS = [
  {
    id: 'b1',
    name: 'FENS - Mühendislik ve Doğa Bilimleri Fakültesi',
    description: 'Mühendislik ve Doğa Bilimleri Fakültesi Binası',
    latitude: 40.8915,
    longitude: 29.3790,
    color: '#e67e22'
  },
  {
    id: 'b2',
    name: 'FASS - Sanat ve Sosyal Bilimler Fakültesi',
    description: 'Sanat ve Sosyal Bilimler Fakültesi Binası',
    latitude: 40.8908, 
    longitude: 29.3790,
    color: '#3498db'
  },
  {
    id: 'b3',
    name: 'FMAN - Yönetim Bilimleri Fakültesi',
    description: 'Yönetim Bilimleri Fakültesi Binası',
    latitude: 40.8921,
    longitude: 29.3797,
    color: '#9b59b6'
  },
  {
    id: 'b4',
    name: 'IC - Bilgi Merkezi',
    description: 'Kütüphane ve Bilgi Merkezi',
    latitude: 40.8903,
    longitude: 29.3772,
    color: '#2ecc71'
  },
  {
    id: 'b5',
    name: 'UC - Üniversite Merkezi',
    description: 'Yeme/İçme Alanları, Dükkanlar ve Etkinlik Alanları',
    latitude: 40.8919,
    longitude: 29.3797,
    color: '#e74c3c'
  },
  {
    id: 'b6',
    name: 'Yurtlar',
    description: 'Öğrenci Yurtları',
    latitude: 40.8923,
    longitude: 29.3819,
    color: '#f1c40f'
  }
];

export default function CampusMap() {
  const router = useRouter();
  const [locationPermission, setLocationPermission] = useState(false);
  const [showServicePoints, setShowServicePoints] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Konum İzni Gerekli',
            'Konumunuzu haritada göstermek için izin vermeniz gerekmektedir.',
            [{ text: 'Tamam' }]
          );
          setLocationPermission(false);
        } else {
          setLocationPermission(true);
        }
      } catch (err) {
        console.error("Konum izni hatası:", err);
        setLocationPermission(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002B5C" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Kampüs Haritası</Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, showServicePoints && styles.filterButtonActive]}
            onPress={() => setShowServicePoints(!showServicePoints)}
          >
            <Text style={[styles.filterButtonText, showServicePoints && styles.filterButtonTextActive]}>Hizmetler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, showBuildings && styles.filterButtonActive]}
            onPress={() => setShowBuildings(!showBuildings)}
          >
            <Text style={[styles.filterButtonText, showBuildings && styles.filterButtonTextActive]}>Binalar</Text>
          </TouchableOpacity>
        </View>
        
        <MapView
          style={styles.map}
          initialRegion={CAMPUS_COORDINATES}
          showsUserLocation={locationPermission}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          {/* Kampüs merkez marker */}
          <Marker
            coordinate={{
              latitude: CAMPUS_COORDINATES.latitude,
              longitude: CAMPUS_COORDINATES.longitude,
            }}
            title="Sabancı Üniversitesi"
            description="Ana Kampüs"
          />

          {/* Hizmet noktaları için marker'lar */}
          {showServicePoints && SERVICE_POINTS.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.name}
              description={point.description}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{point.name}</Text>
                  <Text style={styles.calloutDescription}>{point.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
          
          {/* Fakülteler ve binalar için marker'lar */}
          {showBuildings && CAMPUS_BUILDINGS.map((building) => (
            <Marker
              key={building.id}
              coordinate={{
                latitude: building.latitude,
                longitude: building.longitude,
              }}
              title={building.name}
              description={building.description}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{building.name}</Text>
                  <Text style={styles.calloutDescription}>{building.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => router.push('/screens/MapView')}
          >
            <Text style={styles.expandButtonText}>Büyüt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B5C',
    margin: 10,
    marginLeft: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    zIndex: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#002B5C',
    borderColor: '#002B5C',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  expandButton: {
    backgroundColor: '#002B5C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  expandButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
  },
  loadingContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#002B5C',
  },
}); 
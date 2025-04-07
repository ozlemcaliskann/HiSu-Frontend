import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, SafeAreaView, Alert, TextInput } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Sabancı Üniversitesi kampüs koordinatları
const CAMPUS_COORDINATES = {
  latitude: 40.8911,
  longitude: 29.3790,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
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
    latitude: 40.890899934394774,
    longitude: 29.379077584764005,
    color: '#e67e22'
  },
  {
    id: 'b2',
    name: 'FASS - Sanat ve Sosyal Bilimler Fakültesi',
    description: 'Sanat ve Sosyal Bilimler Fakültesi Binası',
    latitude: 40.89029975146207, 
    longitude: 29.37818709138422,
    color: '#3498db'
  },
  {
    id: 'b3',
    name: 'FMAN - Yönetim Bilimleri Fakültesi',
    description: 'Yönetim Bilimleri Fakültesi Binası',
    latitude: 40.89219760861098,
    longitude: 29.378466041117647,
    color: '#9b59b6'
  },
  {
    id: 'b4',
    name: 'IC - Bilgi Merkezi',
    description: 'Kütüphane ve Bilgi Merkezi',
    latitude: 40.8903078620785,
    longitude: 29.37729659800444,
    color: '#2ecc71'
  },
  {
    id: 'b5',
    name: 'UC - Üniversite Merkezi',
    description: 'Yeme/İçme Alanları, Dükkanlar ve Etkinlik Alanları',
    latitude: 40.891910606212654,
    longitude: 29.37977947507857,
    color: '#e74c3c'
  },
  {
    id: 'b6',
    name: 'Yurtlar',
    description: 'Öğrenci Yurtları',
    latitude: 40.8923987972233,
    longitude: 29.38197984710079,
    color: '#f1c40f'
  },
  {
    id: 'b7',
    name: 'Gösteri Merkezi',
    description: 'Performans Sanatları ve Etkinlik Merkezi',
    latitude: 40.89266872585152,
    longitude: 29.375200811570764,
    color: '#8e44ad'
  }
];

export default function FullCampusMap() {
  const router = useRouter();
  const [locationPermission, setLocationPermission] = useState(false);
  const [showServicePoints, setShowServicePoints] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'service' | 'shop'>('all');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<(typeof SERVICE_POINTS[0] | typeof CAMPUS_BUILDINGS[0])[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Servis noktalarını kategorilere ayırma
  const categories: Record<'all' | 'food' | 'service' | 'shop', string> = {
    all: 'Tümü',
    food: 'Yeme-İçme',
    service: 'Hizmetler',
    shop: 'Alışveriş'
  };

  // Kategorilere göre filtreleme
  const getCategoryPoints = () => {
    if (selectedCategory === 'all') return SERVICE_POINTS;
    
    const categoryMapping: Record<'food' | 'service' | 'shop', string[]> = {
      food: ['Akkol', 'Coffy', 'EspressoLab', 'Fasshane', 'Köpüklü Kahve', 'Küçük Ev', 'Piazza', 'Pizzabulls', 'Simit Sarayı', 'Starbucks', 'Subway'],
      service: ['Akbank', 'Copy Center', 'Era Kuaför', 'Haberleşme Merkezi', 'Sağlık Merkezi'],
      shop: ['Suclub', 'Şok Market']
    };
    
    return SERVICE_POINTS.filter(point => 
      categoryMapping[selectedCategory].includes(point.name)
    );
  };

  // Pinleri arama fonksiyonu
  const searchPins = (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerText = text.toLowerCase().trim();
    
    // Servis noktalarında arama
    const filteredServicePoints = SERVICE_POINTS.filter(point => 
      point.name.toLowerCase().includes(lowerText) || 
      point.description.toLowerCase().includes(lowerText)
    );
    
    // Binalarda arama
    const filteredBuildings = CAMPUS_BUILDINGS.filter(building => 
      building.name.toLowerCase().includes(lowerText) || 
      building.description.toLowerCase().includes(lowerText)
    );
    
    // Sonuçları birleştir
    const results = [...filteredServicePoints, ...filteredBuildings];
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Bir sonuca tıklandığında haritayı o konuma taşı
  const goToLocation = (item: typeof SERVICE_POINTS[0] | typeof CAMPUS_BUILDINGS[0]) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }, 1000);
    }
    setSearchText('');
    setShowSearchResults(false);
  };

  const mapRef = React.useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Konum İzni Gerekli',
            'Konumunuzu haritada göstermek için izin vermeniz gerekmektedir.',
            [{ text: 'Tamam' }]
          );
          setLocationPermission(false);
          return;
        }
        
        setLocationPermission(true);
      } catch (err) {
        console.error("Konum izni hatası:", err);
        setLocationPermission(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#002B5C" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kampüs Haritası</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pin ara..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchPins(text);
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchText('');
                setShowSearchResults(false);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        {showSearchResults && (
          <View style={styles.searchResults}>
            {searchResults.map((item, index) => (
              <TouchableOpacity 
                key={`${item.id}-${index}`}
                style={styles.resultItem}
                onPress={() => goToLocation(item)}
              >
                <Text style={styles.resultItemTitle}>{item.name}</Text>
                <Text style={styles.resultItemDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
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
      
      {showServicePoints && (
        <View style={styles.categoryContainer}>
          {Object.entries(categories).map(([key, label]) => (
            <TouchableOpacity 
              key={key}
              style={[styles.categoryButton, selectedCategory === key && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(key as 'all' | 'food' | 'service' | 'shop')}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === key && styles.categoryButtonTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={CAMPUS_COORDINATES}
          showsUserLocation={locationPermission}
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
          {showServicePoints && getCategoryPoints().map((point) => (
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
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Haritada gezinmek için parmağınızı kaydırın, yakınlaştırmak için iki parmağınızı kullanın
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#002B5C',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002B5C',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 5,
    maxHeight: 200,
    overflow: 'scroll',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  resultItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#002B5C',
    borderColor: '#002B5C',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#002B5C',
    borderColor: '#002B5C',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
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
  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 
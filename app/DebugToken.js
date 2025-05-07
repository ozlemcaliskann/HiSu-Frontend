import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { auth } from '@/constants/firebase';
import dayjs from 'dayjs';

export default function DebugToken() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Kullanıcı oturum açmamış!');
        setLoading(false);
        return;
      }
      
      // Token bilgisini ve detaylarını al
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      
      // Süre hesaplamaları
      const now = dayjs();
      const expiryTime = dayjs(tokenResult.expirationTime);
      const remainingMinutes = expiryTime.diff(now, 'minute');
      
      setTokenInfo({
        token: tokenResult.token,
        claims: tokenResult.claims,
        issuedAt: tokenResult.issuedAtTime,
        expiresAt: tokenResult.expirationTime,
        remainingMinutes,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
        }
      });
    } catch (err) {
      console.error('Token alma hatası:', err);
      setError(`Token alma hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const formatTime = (timeString) => {
    return dayjs(timeString).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Token Bilgileri</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => getToken(false)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Tokeni Yenile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.forceButton]} 
          onPress={() => getToken(true)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Zorla Yenile</Text>
        </TouchableOpacity>
      </View>
      
      {loading && <Text style={styles.loading}>Yükleniyor...</Text>}
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {tokenInfo && (
        <ScrollView style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
          <Text style={styles.label}>UID: <Text style={styles.value}>{tokenInfo.user.uid}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.value}>{tokenInfo.user.email}</Text></Text>
          <Text style={styles.label}>İsim: <Text style={styles.value}>{tokenInfo.user.displayName || 'Yok'}</Text></Text>
          
          <Text style={styles.sectionTitle}>Token Detayları</Text>
          <Text style={styles.label}>Oluşturulma: <Text style={styles.value}>{formatTime(tokenInfo.issuedAt)}</Text></Text>
          <Text style={styles.label}>Son Kullanma: <Text style={styles.value}>{formatTime(tokenInfo.expiresAt)}</Text></Text>
          <Text style={styles.label}>Kalan Süre: <Text style={styles.value}>{tokenInfo.remainingMinutes} dakika</Text></Text>
          
          <Text style={styles.sectionTitle}>Claims (Roller):</Text>
          {Object.entries(tokenInfo.claims).map(([key, value]) => (
            <Text key={key} style={styles.claim}>
              {key}: <Text style={styles.claimValue}>{JSON.stringify(value)}</Text>
            </Text>
          ))}
          
          <Text style={styles.sectionTitle}>Token:</Text>
          <Text selectable={true} style={styles.token}>{tokenInfo.token}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  forceButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffeeee',
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  value: {
    fontWeight: 'bold',
    color: '#333',
  },
  claim: {
    fontSize: 14,
    marginBottom: 3,
    color: '#555',
  },
  claimValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  token: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    fontFamily: 'monospace',
  },
}); 
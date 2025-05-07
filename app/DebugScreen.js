import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { auth } from '@/constants/firebase';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { debugToken, testNetworkConnection, testApiServer } from './debug';

export default function DebugScreen() {
  const [logs, setLogs] = useState([]);
  const [isNetworkOk, setIsNetworkOk] = useState(null);
  const [isApiOk, setIsApiOk] = useState(null);
  const [apiUrl, setApiUrl] = useState(process.env.EXPO_PUBLIC_API_BASE_URL || '');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Kullanıcı durumunu izle
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Log fonksiyonunu yeniden tanımlıyoruz
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  // Log fonksiyonlarını override et
  useEffect(() => {
    console.log = (...args) => {
      const logText = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { type: 'info', text: logText, time: new Date() }]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      const logText = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { type: 'error', text: logText, time: new Date() }]);
      originalConsoleError(...args);
    };

    return () => {
      // Eski fonksiyonları geri yükle
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  // Firebase token testi
  const handleTokenTest = async (forceRefresh = false) => {
    setIsLoading(true);
    clearLogs();
    try {
      await debugToken(forceRefresh);
    } catch (error) {
      console.error("Token test hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ağ bağlantı testi
  const handleNetworkTest = async () => {
    setIsLoading(true);
    clearLogs();
    try {
      const result = await testNetworkConnection();
      setIsNetworkOk(result);
    } catch (error) {
      console.error("Ağ testi hatası:", error);
      setIsNetworkOk(false);
    } finally {
      setIsLoading(false);
    }
  };

  // API sunucu testi
  const handleApiTest = async () => {
    setIsLoading(true);
    clearLogs();
    try {
      const result = await testApiServer(apiUrl);
      setIsApiOk(result);
    } catch (error) {
      console.error("API testi hatası:", error);
      setIsApiOk(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcı çıkışı
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      Alert.alert("Çıkış Başarılı", "Hesabınızdan çıkış yaptınız.");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      Alert.alert("Çıkış Hatası", error.message);
    }
  };

  // Logları temizle
  const clearLogs = () => {
    setLogs([]);
  };

  // Saati formatla
  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'HiSu Hata Ayıklama',
          headerStyle: { backgroundColor: '#002B5C' },
          headerTintColor: 'white'
        }} 
      />

      <View style={styles.userInfo}>
        {user ? (
          <View style={styles.userDetails}>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.notSignedIn}>Oturum açılmamış</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ağ Bağlantısı</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Durum:</Text>
            {isNetworkOk === null ? (
              <Text style={styles.statusPending}>Test edilmedi</Text>
            ) : isNetworkOk ? (
              <Text style={styles.statusSuccess}>Bağlantı Var</Text>
            ) : (
              <Text style={styles.statusError}>Bağlantı Yok</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNetworkTest}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>İnternet Bağlantısını Test Et</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Sunucusu</Text>
          <View style={styles.apiUrlContainer}>
            <Text style={styles.statusLabel}>API URL:</Text>
            <TextInput
              style={styles.apiUrlInput}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="API URL girin"
            />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Durum:</Text>
            {isApiOk === null ? (
              <Text style={styles.statusPending}>Test edilmedi</Text>
            ) : isApiOk ? (
              <Text style={styles.statusSuccess}>Erişilebilir</Text>
            ) : (
              <Text style={styles.statusError}>Erişilemiyor</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleApiTest}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>API Sunucusunu Test Et</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firebase Token</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Durum:</Text>
            {!user ? (
              <Text style={styles.statusError}>Oturum açılmamış</Text>
            ) : (
              <Text style={styles.statusPending}>Test edilecek</Text>
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, { flex: 1 }]} 
              onPress={() => handleTokenTest(false)}
              disabled={isLoading || !user}
            >
              <Text style={styles.buttonText}>Token Kontrol</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.buttonForce, { flex: 1 }]} 
              onPress={() => handleTokenTest(true)}
              disabled={isLoading || !user}
            >
              <Text style={styles.buttonText}>Zorla Yenile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logSection}>
          <View style={styles.logHeader}>
            <Text style={styles.sectionTitle}>Loglar</Text>
            <TouchableOpacity onPress={clearLogs} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.clearText}>Temizle</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.logContainer}>
            {logs.length === 0 ? (
              <Text style={styles.noLogs}>Log yok. Test çalıştırarak log oluşturun.</Text>
            ) : (
              logs.map((log, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.logItem, 
                    log.type === 'error' ? styles.errorLog : styles.infoLog
                  ]}
                >
                  <Text style={styles.logTime}>{formatTime(log.time)}</Text>
                  <Text 
                    style={[
                      styles.logText, 
                      log.type === 'error' ? styles.errorLogText : styles.infoLogText
                    ]}
                  >
                    {log.text}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  userInfo: {
    backgroundColor: '#002B5C',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userEmail: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  notSignedIn: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  signOutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#555',
  },
  statusPending: {
    fontSize: 16,
    color: '#007AFF',
  },
  statusSuccess: {
    fontSize: 16,
    color: '#4CD964',
    fontWeight: '500',
  },
  statusError: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  buttonForce: {
    backgroundColor: '#FF9500',
  },
  apiUrlContainer: {
    marginBottom: 12,
  },
  apiUrlInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 4,
  },
  logSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    color: '#FF3B30',
    marginLeft: 4,
    fontSize: 14,
  },
  logContainer: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F8F8F8',
  },
  noLogs: {
    color: '#999',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  logItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  infoLog: {
    backgroundColor: '#E3F2FD',
  },
  errorLog: {
    backgroundColor: '#FFEBEE',
  },
  logTime: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  logText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  infoLogText: {
    color: '#0D47A1',
  },
  errorLogText: {
    color: '#C62828',
  },
}); 
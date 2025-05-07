import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert, Image, Platform, SafeAreaView, Animated, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLikeStatus, toggleLike } from '../api/likes';
import { getComments, postComment, Comment as APIComment } from '../api/comments';
import { http } from '../lib/http';
import { serviceProviders as allServiceProviders, ServiceProvider } from './data/serviceProviders';
import { auth } from '@/constants/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserById, getUsersByIds, UserProfile } from '../api/user';
import { getValidToken } from '../lib/http';
import CampusMap from './components/CampusMap';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Location tipi tanımı
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

// Fallback olarak tüm servis sağlayıcı listesini kullan
const fallbackLocations = allServiceProviders;

// Backend verisini uyumlu hale getiren adaptör
const adaptServiceProvider = (data: any): Location[] => {
  try {
    if (!data || !Array.isArray(data)) {
      console.log("[API] Adaptör hatası: Gelen veri array değil:", typeof data);
      return fallbackLocations;
    }
    
    return data.map(item => ({
      id: item.id?.toString() || item._id?.toString() || Math.random().toString(),
      name: item.name || item.title || "İsimsiz Hizmet",
      likes: typeof item.likes === 'number' ? item.likes : 0,
      hours: item.hours || "Çalışma saatleri belirtilmemiş",
      weekendHours: item.weekendHours || undefined,
      location: item.location || "Konum belirtilmemiş",
      phone: item.phone || "Telefon belirtilmemiş",
      hasComments: item.hasComments !== undefined ? item.hasComments : true
    }));
  } catch (error) {
    console.error("[API] Adaptör hatası:", error);
    return fallbackLocations;
  }
};

// Backend'den lokasyonları çeken fonksiyon
const fetchLocations = async (): Promise<Location[]> => {
  try {
    console.log("[API] Servis sağlayıcılar fetch ediliyor");
    // API çağrısı yaparken zaman aşımını azalt
    const response = await http.get('/serviceProviders', {
      timeout: 5000 // 5 saniye zaman aşımı
    });
    console.log("[API] Servis data alındı:", response.data.length, "kayıt");
    console.log("[API] Alınan veri formatı:", JSON.stringify(response.data).substring(0, 200) + "...");
    
    // Backend verisini uyumlu formata dönüştür
    const adaptedData = adaptServiceProvider(response.data);
    console.log("[API] Adaptör sonrası veri:", adaptedData.length, "kayıt");
    
    return adaptedData;
  } catch (error) {
    console.error('[API] Servis sağlayıcıları çekerken hata:', error);
    console.log("[API] Offline moda geçiliyor - statik verileri kullanıyoruz");
    
    // Fallback olarak statik servis sağlayıcı verisini kullan
    return fallbackLocations;
  }
};

// Comment type tanımını API ve UI'a uygun hale getiriyoruz
type CommentType = {
  id: string;
  userId: string;  // API'dan gelen alan
  user?: string;   // UI template'inde kullanılan alan 
  content: string; // API'dan gelen alan
  comment?: string; // UI template'inde kullanılan alan
  createdAt: string; // API'dan gelen alan
  createdDate?: string; // UI template'inde kullanılan alan
  targetId?: string;
  userEmail?: string | null;
};

// Servis kartı bileşeni - useQuery hooks'ları map içinde kullanmak yerine bileşene taşıyoruz
const ServiceCard = ({ location, onCommentsPress }: { location: Location, onCommentsPress: (location: Location) => void }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Beğeni durumunu çek
  const { data: likeStatus, isLoading: isLikeLoading } = useQuery({
    queryKey: ['like', location.id],
    queryFn: () => fetchLikeStatus(location.id),
    enabled: true, // Kimlik olsun olmasın herkese göster, API gerekirse ilgili yerde kontrol eder
    retry: 1, // Hata durumunda sadece 1 kez daha dene
    staleTime: 30000 // 30 saniye boyunca veriler taze kabul edilir
  });
  
  // Yorum sayısını çek
  const { data: comments = [], isLoading: isLoadingComments } = useQuery<CommentType[], Error>({
    queryKey: ['comments', location.id],
    queryFn: () => getComments(location.id),
    enabled: !!location.hasComments,
    staleTime: 30000,
    retry: 1
  });

  // Beğeni toggle mutasyonu
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(location.id, likeStatus?.hasLiked ?? false),
    onSuccess: () => {
      console.log("Like operation successful");
      queryClient.invalidateQueries({ queryKey: ['like', location.id] });
    },
    onError: (error: any) => {
      console.error('Like operation failed:', error);
      // Auth hatası ise login sayfasına yönlendir
      if (error.response && error.response.status === 401) {
        Alert.alert(
          'Giriş Gerekli', 
          'Bu işlemi yapmak için giriş yapmalısınız.',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Giriş Yap', onPress: () => router.replace('/LoginScreen') }
          ]
        );
      } else {
        Alert.alert('Hata', 'Beğeni işlemi başarısız oldu. Lütfen tekrar deneyin.');
      }
    }
  });

  // Kullanıcı giriş yapmadıysa login ekranına yönlendir
  const handleAuthAction = (action: string) => {
    if (!auth.currentUser) {
      Alert.alert(
        'Giriş Gerekli', 
        `Bu işlemi yapabilmek için giriş yapmanız gerekiyor.`, 
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => router.replace('/LoginScreen') }
        ]
      );
      return false;
    }
    return true;
  };

  return (
    <View key={location.id} style={styles.locationItem}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationName}>{location.name}</Text>
        <TouchableOpacity 
          style={styles.likesContainer}
          onPress={() => {
            // Direkt olarak beğeni fonksiyonunu çağırıyoruz, auth kontrolünü API'de yapıyoruz
            likeMutation.mutate();
          }}
          disabled={likeMutation.isPending}
        >
          {isLikeLoading || likeMutation.isPending ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <>
              <Ionicons 
                name={likeStatus?.hasLiked ? "thumbs-up" : "thumbs-up-outline"} 
                size={20} 
                color="#007AFF" 
              />
              <Text style={styles.likesCount}>{likeStatus?.totalLikes ?? 0}</Text>
            </>
          )}
        </TouchableOpacity>
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
              // Direkt olarak yorumlar modalını aç, yetki kontrolünü modal içinde yapılacak
              onCommentsPress(location);
            }}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.commentsText}>Yorumlar</Text>
            {!isLoadingComments && (
              <View style={styles.commentCountBadge}>
                <Text style={styles.commentCountText}>{comments.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function MainPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // useRef ile slideAnim değeri render'lar arasında korunur
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [modalState, setModalState] = useState({
    isCommentsModalVisible: false,
    selectedLocation: null as Location | null,
    commentText: ''
  });
  
  // İsLoading durumu için override mekanizması
  const [isLoadingOverride, setIsLoadingOverride] = useState(false);
  
  // TextInput state'ini modaldan ayır - reset sorununu çözmek için
  const textInputRef = useRef<TextInput>(null);
  const [commentText, setCommentText] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  
  // Önceki isCommentsModalVisible state kullanımlarını değiştir
  const isCommentsModalVisible = modalState.isCommentsModalVisible;
  const selectedLocation = modalState.selectedLocation;
  
  // Service providers çek
  const { data: locations = fallbackLocations, isLoading: isQueryLoading, isError, error, refetch } = useQuery<Location[], Error>({
    queryKey: ['serviceProviders'],
    queryFn: fetchLocations,
    retry: 2
  });
  
  // İsLoading durumunu override mekanizması
  const isLoading = isLoadingOverride ? false : isQueryLoading;

  // Debug için veri durumunu izle
  useEffect(() => {
    console.log("[DEBUG] Data durumu:", {
      yükleniyor: isQueryLoading,
      override: isLoadingOverride, 
      etkinYükleniyor: isLoading,
      hataVar: isError,
      veriUzunluğu: locations?.length,
      fallbackKullanıldı: locations === fallbackLocations
    });
    
    if (locations?.length > 0) {
      console.log("[DEBUG] İlk kayıt örneği:", JSON.stringify(locations[0]));
      
      // Eğer veriler varsa ve yükleme hala devam ediyorsa, override devreye girer
      if (isQueryLoading && !isLoadingOverride) {
        console.log("[DEBUG] Veriler yüklendi ama isLoading true, override yapılıyor");
        setTimeout(() => setIsLoadingOverride(true), 1000);
      }
    }
  }, [locations, isQueryLoading, isError, isLoadingOverride]);

  // Yorumları çek - güncellendi ve optimize edildi
  const { data: comments = [], isLoading: commentsLoading, error: commentsError, refetch: refetchComments } = useQuery<CommentType[], Error>({
    queryKey: ['comments', selectedLocation?.id],
    queryFn: async () => {
      try {
        if (!selectedLocation) return [];
        console.log("[Comments] Fetching comments for:", selectedLocation.name);
        
        // API'dan yorumları çek
        const apiComments = await getComments(selectedLocation.id);
        
        // API'dan gelen yapıyı UI yapısına dönüştür
        return apiComments.map(comment => ({
          id: comment.id,
          userId: comment.userId,
          user: comment.userId, // UI template için alan uygunluğu
          content: comment.content,
          comment: comment.content, // UI template için alan uygunluğu
          createdAt: comment.createdAt,
          createdDate: comment.createdAt, // UI template için alan uygunluğu
          userEmail: comment.userEmail
        }));
      } catch (error) {
        console.error("[Comments] Yorumları çekerken hata:", error);
        return [];
      }
    },
    enabled: !!selectedLocation && isCommentsModalVisible,
  });

  // Yorumlar değiştiğinde kullanıcı profillerini çek
  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (comments && comments.length > 0) {
        // Yorumların kullanıcı ID'lerini çıkar
        const userIds = comments.map(comment => comment.userId);
        // Bu kullanıcıların profillerini çek
        try {
          const profiles = await getUsersByIds(userIds);
          setUserProfiles(profiles);
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };

    fetchUserProfiles();
  }, [comments]);

  // Yorum ekle mutasyonu - optimize edildi
  const commentMutation = useMutation({
    mutationFn: (newCommentText: string) => {
      if (!selectedLocation || !newCommentText.trim()) {
        return Promise.reject('Yorum veya lokasyon eksik');
      }
      
      // Konsola tam olarak ne gönderildiğini yazdır
      console.log("[Comments] Sending comment:", {
        targetId: selectedLocation.id,
        content: newCommentText.trim(),
        auth: !!auth.currentUser
      });
      
      // Güvenlik kontrolü
      if (!auth.currentUser) {
        return Promise.reject('Kullanıcı girişi yapılmamış');
      }
      
      return postComment(selectedLocation.id, newCommentText.trim());
    },
    onSuccess: (data) => {
      console.log("[Comments] Comment posted successfully:", data);
      // Yorum başarıyla eklendiğinde yorumları yeniden çek
      queryClient.invalidateQueries({ queryKey: ['comments', selectedLocation?.id] });
      // Başarı mesajı göster
      Alert.alert('Başarılı', 'Yorumunuz başarıyla eklendi.');
      // Yorum kutusunu temizle ama modalı kapatma
      setCommentText('');
    },
    onError: (error: any) => {
      console.error('[Comments] Error adding comment:', error);
      let errorMessage = 'Yorum eklenirken bir hata oluştu.';
      
      // API'den gelen hata mesajını göster
      if (error.response) {
        console.error('[Comments] API Error details:', error.response.data);
        errorMessage = `API Hatası: ${error.response.status} - ${error.response.data.message || errorMessage}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Hata', errorMessage + ' Lütfen tekrar deneyin.');
    }
  });
  
  // Yorumu gönder - state ve ref odaklı yaklaşımla yenilendi
  const handleAddComment = useCallback(() => {
    if (!auth.currentUser) {
      Alert.alert(
        'Giriş Gerekli', 
        'Yorum yapabilmek için giriş yapmalısınız.', 
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => router.replace('/LoginScreen') }
        ]
      );
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Hata', 'Yorum boş olamaz.');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Hata', 'Yorum yapılacak hizmet bulunamadı.');
      return;
    }

    // Yorum yapmadan önce token'ı yenile
    getValidToken()
      .then(() => {
        // Mevcut commentText state'ini kullan - daha kararlı
        commentMutation.mutate(commentText);
      })
      .catch(error => {
        console.error('[Comments] Token yenileme hatası:', error);
        Alert.alert('Hata', 'Oturum doğrulanamadı. Lütfen tekrar giriş yapın.');
      });
  }, [commentText, commentMutation, router, selectedLocation]);

  // Modal kapandığında yorumları temizle
  useEffect(() => {
    if (!isCommentsModalVisible) {
      // Modal kapandığında, state'leri sıfırla ama asenkron yap
      setTimeout(() => {
        setCommentText('');
        // Yorum modal kapandıktan sonra seçili lokasyonu sıfırlama
        // setSelectedLocation(null);
      }, 300); // Modal animasyonu bittikten sonra
    }
  }, [isCommentsModalVisible]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : -300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen, slideAnim]);

  // Firebase token değişimini dinle
  useEffect(() => {
    console.log("[Auth] Firebase token değişimini dinleme başlatıldı");
    
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı giriş yaptı veya token yenilendi
        try {
          console.log("[Auth] Token değişimi algılandı - token önbelleği ısıtılıyor");
          // Token önbelleğini ısıt - http.ts'teki cachedToken'ı güncelleyecek
          await getValidToken();
          // Tüm sorguları yenile
          console.log("[Auth] Tüm sorguları yeniliyorum");
          queryClient.invalidateQueries();
        } catch (error) {
          console.error("[Auth] Token önbelleği ısıtma hatası:", error);
        }
      } else {
        // Kullanıcı çıkış yaptı
        console.log("[Auth] Oturum kapandı - cache temizleniyor");
        queryClient.clear(); // Cache'i tamamen temizle
      }
    });
    
    return () => {
      console.log("[Auth] Token dinleyicisi kaldırıldı");
      unsubscribe();
    };
  }, [queryClient]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("🚪 User logged out");
      router.replace("/LoginScreen");
    });
  };

  // Navigate to different screens
  const navigateTo = (route: string) => {
    router.push(route as any);
    setIsDrawerOpen(false);
  };

  // Comment modal açma işlemini düzelt
  const handleCommentsPress = useCallback((location: Location) => {
    console.log("Yorumlar açılıyor:", location.name);
    
    // Modal'ı aç ve seçili lokasyonu ayarla - tek bir state güncellemesi
    setModalState({
      isCommentsModalVisible: true,
      selectedLocation: location,
      commentText: ''
    });
    
    // State güncellemesi sonrası yorumları yenile
    setTimeout(() => {
      if (location?.id) {
        console.log("Yorumlar yenileniyor:", location.id);
        queryClient.invalidateQueries({ queryKey: ['comments', location.id] });
      }
    }, 100);
  }, [queryClient]);
  
  // Modal'ı kapatma işlemini düzelt
  const closeCommentsModal = useCallback(() => {
    console.log("Yorumlar kapatılıyor");
    setModalState(prev => ({
      ...prev,
      isCommentsModalVisible: false
    }));
    
    // Input içeriğini temizle
    setCommentText('');
  }, []);

  // Yorumda gösterilecek kullanıcı adını belirle
  const getDisplayName = (userId: string, comment?: any) => {
    // Kullanıcı email'i varsa onu göster
    if (comment?.userEmail) {
      return comment.userEmail;
    }
    
    // UserProfile içinden display name'i kontrol et
    const userProfile = userProfiles[userId]; // doğrudan erişim, find() yerine
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }
    
    // UserProfile yoksa userId'yi kısaltarak göster
    if (userId && userId.length > 8) {
      return `${userId.substring(0, 4)}...${userId.substring(userId.length - 4)}`;
    }
    
    return "Misafir";
  };
  
  // Kullanıcı ID'sini okunabilir formata dönüştür
  const formatUserId = (userId: string): string => {
    if (!userId) return "Bilinmeyen Kullanıcı";
    // ID'nin ilk 6 karakterini al ve email formatında göster
    return `${userId.substring(0, 6)}...@kullanici.com`;
  };

  // Tarih formatını düzelt
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Tarih yok";
    
    try {
      // Firebase timestamp objesi olabilir mi diye kontrol et
      if (typeof dateString === 'object') {
        // Firebase timestamp formatı: {seconds: number, nanos: number}
        const timestamp = dateString as any;
        if (timestamp.seconds && timestamp.nanos !== undefined) {
          console.log("Firebase timestamp formatı tespit edildi, dönüştürülüyor");
          // seconds * 1000 ile milisaniyeye çevir ve Date objesi oluştur
          const date = new Date(timestamp.seconds * 1000);
          
          // Tarih ve saat formatı
          return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(date);
        }
      }
      
      // ISO formatında tarih kontrolü yap
      const date = new Date(dateString);
      
      // Geçerli bir tarih kontrolü
      if (isNaN(date.getTime())) {
        console.log("Geçersiz tarih formatı:", dateString);
        return "Tarih yok";
      }
      
      // Tarih ve saat formatı
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Tarih formatlarken hata:", error, "Tarih:", dateString);
      return "Tarih yok";
    }
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
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/screens/AboutUs')}
        >
          <Ionicons name="information-circle-outline" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Hakkımızda</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/screens/ClubActivities')}
        >
          <Ionicons name="people-outline" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Kulüp Aktiviteleri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/screens/ProgramInfo')}
        >
          <FontAwesome5 name="graduation-cap" size={20} color="#002B5C" />
          <Text style={styles.drawerText}>Program Bilgileri</Text>
        </TouchableOpacity>

        <View style={styles.facultiesSection}>
          <Text style={styles.facultiesTitle}>Fakülteler</Text>
          <TouchableOpacity 
            style={styles.facultyItem}
            onPress={() => navigateTo('/screens/faculties/FENS')}
          >
            <Text style={styles.facultyText}>Mühendislik ve Doğa Bilimleri</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.facultyItem}
            onPress={() => navigateTo('/screens/faculties/FASS')}
          >
            <Text style={styles.facultyText}>Sanat ve Sosyal Bilimler</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.facultyItem}
            onPress={() => navigateTo('/screens/faculties/FMAN')}
          >
            <Text style={styles.facultyText}>Yönetim Bilimleri</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/screens/Rankings')}
        >
          <MaterialIcons name="bar-chart" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Taban Puanlar ve Sıralamalar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/screens/Scholarships')}
        >
          <MaterialIcons name="attach-money" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Burslar ve Ücretler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigateTo('/debug')}
        >
          <Ionicons name="bug" size={24} color="#002B5C" />
          <Text style={styles.drawerText}>Hata Ayıklama</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Kullanıcı giriş yapmadıysa ve bir auth hatası varsa
  if (isAuthError) {
    return (
      <View style={styles.authErrorContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#002B5C" />
        <Text style={styles.authErrorTitle}>Giriş Yapmanız Gerekiyor</Text>
        <Text style={styles.authErrorText}>Bu sayfayı görüntülemek için lütfen giriş yapın.</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.replace("/LoginScreen")}
        >
          <Text style={styles.loginButtonText}>Giriş Sayfasına Git</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Kampüs verileri yükleniyor...</Text>
      </View>
    );
  }

  if (isError && !locations.length) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Veri yüklenirken bir hata oluştu.</Text>
        <Text style={styles.errorSubtext}>
          {error instanceof Error ? error.message : "Bilinmeyen hata"}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <ScrollView style={styles.contentContainer}>
        <CampusMap />
        <View style={styles.sectionTitle}>
          <Ionicons name="business-outline" size={24} color="#002B5C" />
          <Text style={styles.sectionTitleText}>Kampüs Hizmetleri</Text>
        </View>
        <View style={styles.locationsList}>
          {locations.map((location) => (
            <ServiceCard 
              key={location.id} 
              location={location}
              onCommentsPress={handleCommentsPress}
            />
          ))}
        </View>
      </ScrollView>
      
      {/* Drawer overlay */}
      {isDrawerOpen && (
        <View style={[styles.drawerOverlay, { zIndex: 10 }]}>
          <TouchableOpacity 
            style={styles.drawerBackground}
            onPress={() => setIsDrawerOpen(false)}
            activeOpacity={1}
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

      {/* Comments Modal - z-index sorununu çözmek için Portal içinde render et */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentsModalVisible}
        onRequestClose={closeCommentsModal}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedLocation?.name || ''} Yorumları
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeCommentsModal}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Comments list */}
              <ScrollView 
                style={styles.commentsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ 
                  padding: 10,
                  flexGrow: comments.length === 0 ? 1 : 0,
                }}
              >
                {commentsLoading ? (
                  <View style={styles.loadingCommentsContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingCommentsText}>Yorumlar yükleniyor...</Text>
                  </View>
                ) : comments.length === 0 ? (
                  <View style={styles.noCommentsContainer}>
                    <Ionicons name="chatbubble-outline" size={48} color="#CCCCCC" />
                    <Text style={styles.noCommentsText}>Henüz yorum yok</Text>
                    <Text style={styles.noCommentsSubtext}>İlk yorumu sen yap!</Text>
                  </View>
                ) : (
                  comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {getDisplayName(comment.userId, comment)}
                        </Text>
                        <Text style={styles.commentDate}>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                      <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              
              {/* Comment input area - fixed at bottom */}
              <View style={styles.commentInputContainer}>
                <View style={styles.commentInputWrapper}>
                  <TextInput
                    ref={textInputRef}
                    style={styles.commentInput}
                    placeholder="Yorum yaz..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline={true}
                    maxLength={250}
                  />
                  <Text style={styles.characterCount}>
                    {commentText.length}/250
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.addCommentButton,
                    { opacity: commentMutation.isPending || !commentText.trim() ? 0.7 : 1 }
                  ]}
                  onPress={handleAddComment}
                  disabled={!commentText.trim() || commentMutation.isPending}
                >
                  {commentMutation.isPending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.sendButtonText}>Gönder</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  loadingIndicator: {
    margin: 20,
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  authErrorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002B5C',
    marginTop: 16,
    marginBottom: 8,
  },
  authErrorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#002B5C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    minWidth: 50,
    justifyContent: 'flex-end',
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
    padding: 5,
  },
  commentsText: {
    marginLeft: 5,
    color: '#666',
    marginRight: 5,
  },
  commentCountBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 3,
  },
  commentCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  commentItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150,
  },
  noCommentsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    marginTop: 8,
  },
  commentInputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 80,
    position: 'relative',
  },
  commentInput: {
    fontSize: 14,
    maxHeight: 70,
    paddingRight: 40,
  },
  characterCount: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    color: '#888',
    fontSize: 12,
  },
  addCommentButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    width: 80,
    height: 40,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    zIndex: 10,
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
    zIndex: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    padding: 8,
  },
  loadingCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCommentsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});
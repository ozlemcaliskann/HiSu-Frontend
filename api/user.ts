import { http } from "../lib/http";
import { auth } from "@/constants/firebase";

// Kullanıcı profili tipi
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

// Kullanıcı cache'i - performans için
const userCache: Record<string, UserProfile> = {};

// Giriş yapan kullanıcının bilgilerini al
export const getCurrentUserProfile = (): UserProfile | null => {
  const user = auth.currentUser;
  if (!user) return null;
  
  return {
    id: user.uid,
    email: user.email || "Bilinmeyen E-posta",
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

// Kullanıcı ID'sine göre kullanıcı bilgilerini getir (backend'den)
export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Önce cache'e bak
    if (userCache[userId]) {
      return userCache[userId];
    }
    
    // Mevcut kullanıcı ise kendi bilgilerini kullan
    if (auth.currentUser?.uid === userId) {
      const currentUser = getCurrentUserProfile();
      if (currentUser) {
        userCache[userId] = currentUser;
        return currentUser;
      }
    }
    
    try {
      // Cache'de yoksa API çağrısı yap - ancak backend hazır değilse hata fırlatabilir
      const response = await http.get<UserProfile>(`/users/${userId}`);
      const userProfile = response.data;
      
      // Cache'e kaydet
      userCache[userId] = userProfile;
      
      return userProfile;
    } catch (error) {
      // API'den alınamadıysa userId'yi kullanan basit bir profil oluştur
      const defaultProfile: UserProfile = {
        id: userId,
        email: `${userId.substring(0, 8)}@kullanici.com`,
        displayName: null,
        photoURL: null
      };
      
      // Cache'e kaydet
      userCache[userId] = defaultProfile;
      return defaultProfile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    // Tamamen hata durumunda userId'yi kullanan basit bir profil
    return {
      id: userId,
      email: `${userId.substring(0, 8)}@kullanici.com`,
      displayName: null,
      photoURL: null
    };
  }
};

// Çoklu kullanıcı bilgisi çekme (örn. yorum listesindeki tüm kullanıcılar için)
export const getUsersByIds = async (userIds: string[]): Promise<Record<string, UserProfile>> => {
  const uniqueIds = [...new Set(userIds)]; // Duplicate'leri kaldır
  const result: Record<string, UserProfile> = {};
  
  await Promise.all(
    uniqueIds.map(async (id) => {
      const user = await getUserById(id);
      if (user) {
        result[id] = user;
      }
    })
  );
  
  return result;
}; 
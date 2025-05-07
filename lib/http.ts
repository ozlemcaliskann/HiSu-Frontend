import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { auth } from '@/constants/firebase';
import dayjs from 'dayjs';

// API URL ortam değişkeninden al veya varsayılan olarak localhost kullan
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
console.log("API URL:", API_URL);

// Token yönetimi için değişkenler
let cachedToken: string | null = null;
let cachedExp: number | null = null;  // unix seconds

// Token'ın hala taze olup olmadığını kontrol et
function tokenIsFresh() {
  if (!cachedToken || !cachedExp) return false;
  // Gerçek süre dolumundan 5 dakika önce yenile
  return dayjs.unix(cachedExp).subtract(5, "minute").isAfter(dayjs());
}

// Geçerli token al - gerekliyse yenile (dışa aktarıldı)
export async function getValidToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  if (tokenIsFresh()) {
    console.log("[HTTP] Önbellekteki token hala taze, yeniden kullanılıyor");
    return cachedToken!;
  }

  try {
    console.log("[HTTP] Token yenileniyor (zorunlu yenileme: false)");
    // Sadece gerekliyse refresh yap
    const { token, expirationTime } = await user.getIdTokenResult(false);
    cachedToken = token;
    cachedExp = Math.floor(Number(expirationTime) / 1000); // ms → s
    console.log(`[HTTP] Token başarıyla alındı, son kullanma: ${dayjs.unix(cachedExp).format('HH:mm:ss')}`);
    return token;
  } catch (error) {
    console.error("[HTTP] Token alırken hata:", error);
    return null;
  }
}

// Ana axios instance'ını oluştur
export const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Beklemede olan istekler için kuyruk
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

// İstek öncesi token ekle
http.interceptors.request.use(
  async (config) => {
    console.log(`[HTTP] ${config.method?.toUpperCase()} isteği gönderiliyor: ${config.url}`);
    
    try {
      // GET istekleri için token gerekmiyor (backend değişikliği sonrası)
      if (config.method?.toLowerCase() === 'get') {
        console.log("[HTTP] GET isteği için token eklenmedi (public endpoint)");
        return config;
      }
      
      const token = await getValidToken();
      if (token) {
        console.log("[HTTP] Geçerli token isteğe eklendi");
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("[HTTP] Token yok, anonim istek gönderiliyor");
      }
    } catch (error) {
      console.error("[HTTP] Token alma hatası:", error);
    }
    
    return config;
  },
  (error) => {
    console.error("[HTTP] İstek gönderme hatası:", error);
    return Promise.reject(error);
  }
);

// Cevap işleme ve token yenileme
http.interceptors.response.use(
  (response) => {
    console.log(`[HTTP] Başarılı cevap: ${response.config.url} (${response.status})`);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as any;
    
    if (!config) {
      console.error("[HTTP] Orijinal istek bulunamadı:", error);
      return Promise.reject(error);
    }
    
    // 401 hatası için token yenileme - ancak tekrar denenmemişse ve POST/DELETE/PUT gibi mutasyon istekleri için
    if (error.response?.status === 401 && !config._retry && 
        ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      console.log("[HTTP] 401 hatası algılandı, token yenileme denenecek");
      
      // Tekrar deneme işaretini ekle
      config._retry = true;
      
      // Token zaten yenileniyorsa kuyruğa ekle
      if (isRefreshing) {
        console.log("[HTTP] Token zaten yenileniyor, isteği kuyruğa ekliyorum");
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(http(config));
            } else {
              reject(error);
            }
          });
        });
      }
      
      // Token yenileme işlemini başlat
      isRefreshing = true;
      
      try {
        console.log("[HTTP] Token zorunlu olarak yenileniyor...");
        const user = auth.currentUser;
        if (!user) {
          throw new Error("Kullanıcı oturum açmamış");
        }
        
        // Token'ı zorla yenile (force refresh)
        const newToken = await user.getIdToken(true);
        cachedToken = newToken;
        console.log("[HTTP] Token başarıyla zorla yenilendi");
        
        // Kuyruktaki istekleri işle
        pendingQueue.forEach((callback) => callback(newToken));
        
        // Orijinal isteği yeni token ile tekrar dene
        config.headers.Authorization = `Bearer ${newToken}`;
        return http(config);
      } catch (refreshError) {
        console.error("[HTTP] Token yenileme hatası, çıkış yapılıyor:", refreshError);
        
        // Kuyruktaki istekleri başarısız olarak işaretle
        pendingQueue.forEach((callback) => callback(null));
        
        // Token yenilenmezse kullanıcı oturumunu sonlandır
        try {
          await auth.signOut();
          console.log("[HTTP] Kullanıcı oturumu sonlandırıldı");
        } catch (signOutError) {
          console.error("[HTTP] Oturum kapatma hatası:", signOutError);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        pendingQueue = [];
      }
    }
    
    // 403 hatası durumunda kullanıcı dostu mesaj
    if (error.response?.status === 403) {
      console.error(`[HTTP] Yetkilendirme hatası (403): ${config.url}`);
      // React Query tarafından yakalanabilecek özel hata oluştur
      const customError = new Error('Bu işlem için yetkiniz bulunmuyor.') as any;
      customError.isAuthError = true;
      return Promise.reject(customError);
    }
    
    console.error(`[HTTP] Hata: ${error.message} (${error.response?.status}) URL: ${config.url}`);
    return Promise.reject(error);
  }
);

// API bağlantısını test et
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log("[HTTP] API bağlantısı test ediliyor...");
    const response = await http.get('/test/status');
    console.log("[HTTP] API bağlantısı başarılı:", response.data);
    return true;
  } catch (error) {
    console.error("[HTTP] API bağlantısı başarısız:", error);
    return false;
  }
}; 
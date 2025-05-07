import { auth } from '@/constants/firebase';

/**
 * Firebase token bilgilerini debug konsola yazdırır
 * 
 * @param {boolean} forceRefresh - Token'ı zorla yenilemek için true, değilse false
 * @returns {Promise<void>}
 */
export async function debugToken(forceRefresh = false) {
  try {
    console.log('===== FIREBASE TOKEN DEBUG =====');
    const user = auth.currentUser;
    
    if (!user) {
      console.log('❌ Oturum açılmamış - token yok');
      return;
    }
    
    console.log(`👤 Kullanıcı: ${user.email} (${user.uid})`);
    console.log(`📱 Doğrulanmış: ${user.emailVerified ? 'Evet' : 'Hayır'}`);
    
    // Token bilgilerini al
    try {
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      
      const now = new Date();
      const expiresAt = new Date(tokenResult.expirationTime);
      const remainingMinutes = Math.floor((expiresAt - now) / (1000 * 60));
      
      console.log(`🔑 Token Alındı: ${forceRefresh ? '(zorla yenileme)' : '(önbellekten)'}`);
      console.log(`⏰ Son Kullanma: ${expiresAt.toLocaleString()} (${remainingMinutes} dakika kaldı)`);
      
      // Rolleri kontrol et
      console.log('👮 Claims/Roller:');
      const claims = tokenResult.claims;
      Object.keys(claims).forEach(key => {
        if (key.includes('role') || key === 'admin' || key === 'private') {
          console.log(`   - ${key}: ${claims[key]}`);
        }
      });
      
      // Token'ın ilk karakterleri
      const tokenPreview = tokenResult.token.substring(0, 15) + '...';
      console.log(`🔐 Token: ${tokenPreview}`);
      
      return tokenResult;
    } catch (error) {
      console.error('❌ Token alma hatası:', error.message);
    }
  } catch (error) {
    console.error('❌ Genel hata:', error.message);
  } finally {
    console.log('===== DEBUG TAMAMLANDI =====');
  }
}

/**
 * Ağ bağlantısını test eder
 * 
 * @param {string} url - Test edilecek URL (opsiyonel)
 * @returns {Promise<boolean>} - Bağlantı durumu
 */
export async function testNetworkConnection(url = 'https://www.google.com') {
  try {
    console.log(`🌐 Ağ bağlantısı test ediliyor: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`✅ Ağ bağlantısı başarılı (${response.status})`);
    return true;
  } catch (error) {
    console.error(`❌ Ağ bağlantısı başarısız: ${error.message}`);
    return false;
  }
}

/**
 * API sunucusunu test eder
 * 
 * @param {string} apiUrl - API URL (opsiyonel, yoksa env'den alır)
 * @returns {Promise<boolean>} - API erişilebilirlik durumu
 */
export async function testApiServer(apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL) {
  try {
    if (!apiUrl) {
      console.error('❌ API URL tanımlanmamış (EXPO_PUBLIC_API_BASE_URL)');
      return false;
    }
    
    console.log(`🔌 API sunucusu test ediliyor: ${apiUrl}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // URL sonunda '/' varsa kaldır
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const testUrl = `${baseUrl}/test/status`;
    
    const response = await fetch(testUrl, { 
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API sunucusu yanıt verdi: ${JSON.stringify(data)}`);
      return true;
    } else {
      console.log(`⚠️ API sunucusu erişilebilir ama hata döndü: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ API sunucusu erişilemiyor: ${error.message}`);
    return false;
  }
}

/**
 * Tüm debug testlerini çalıştırır
 */
export async function runAllTests() {
  console.log('===== HATA AYIKLAMA TESTLERİ BAŞLATILIYOR =====');
  
  const networkOk = await testNetworkConnection();
  if (networkOk) {
    await testApiServer();
  }
  
  await debugToken();
  
  console.log('===== HATA AYIKLAMA TESTLERİ TAMAMLANDI =====');
} 
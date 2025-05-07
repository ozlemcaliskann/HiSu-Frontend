import { http } from "../lib/http";
import { auth } from "@/constants/firebase";

export enum TargetType { SERVICE = "SERVICE" }

export const fetchLikeStatus = async (targetId: string) => {
  try {
    if (!targetId) {
      console.error("Invalid targetId in fetchLikeStatus");
      return { hasLiked: false, totalLikes: 0 };
    }
    
    console.log("Fetching like status for:", targetId);
    
    // Yeni API formatı: /likes/status/{itemType}/{itemId}
    const response1 = await http.get(`/likes/status/${TargetType.SERVICE}/${targetId.trim()}`);
    const hasLiked = response1.data?.hasLiked || false;
    
    // Beğeni sayısını ayrı endpoint'ten al: /likes/count/{itemType}/{itemId}
    const response2 = await http.get(`/likes/count/${TargetType.SERVICE}/${targetId.trim()}`);
    const totalLikes = response2.data?.count || 0;
    
    console.log("Like status result:", { hasLiked, totalLikes });
    return { hasLiked, totalLikes };
  } catch (error) {
    console.error("Error fetching like status:", error);
    // API hata verirse varsayılan değer dön
    return { hasLiked: false, totalLikes: 0 };
  }
};

export const toggleLike = async (targetId: string, hasLiked: boolean) => {
  try {
    // Kullanıcı oturum açtı mı kontrol et
    if (!auth.currentUser) {
      throw new Error("Bu işlemi yapabilmek için giriş yapmalısınız.");
    }
    
    // Token'ı tazele
    await auth.currentUser.getIdToken(true);
    
    // TargetId kontrolü
    if (!targetId || !targetId.trim()) {
      throw new Error("Geçersiz hedef ID");
    }
    
    console.log("Toggle like operation:", {
      targetId: targetId.trim(),
      hasLiked,
      user: auth.currentUser?.uid
    });
    
    if (hasLiked) {
      // Beğeniyi kaldır - yeni endpoint: /likes/{itemType}/{itemId}
      await http.delete(`/likes/${TargetType.SERVICE}/${targetId.trim()}`);
      console.log("Like removed successfully");
    } else {
      // Beğeni ekle
      await http.post("/likes", { 
        userId: auth.currentUser.uid, // Ekstra güvenlik için userId ekle
        targetType: TargetType.SERVICE, 
        targetId: targetId.trim() 
      });
      console.log("Like added successfully");
    }
    return true;
  } catch (error: any) {
    console.error("Error toggling like:", error);
    
    // Daha detaylı hata mesajları
    if (error.response) {
      console.error("API response error:", error.response.status, error.response.data);
      if (error.response.status === 403) {
        throw new Error("Bu işlem için yetkiniz bulunmuyor.");
      }
      if (error.response.status === 401) {
        throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      }
    }
    
    throw error; // React Query'nin hata yakalaması için hatayı ilet
  }
}; 
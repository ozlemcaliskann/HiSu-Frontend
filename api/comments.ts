import { http } from "../lib/http";
import { TargetType } from "./likes";
import { auth } from "@/constants/firebase";

export type Comment = {
  id: string;
  userId: string;
  userEmail?: string | null;  // Eski kayıtlarda olmayabilir
  content: string;
  createdAt: string;
};

export const getComments = async (targetId: string) => {
  try {
    if (!targetId) {
      console.warn("Invalid targetId in getComments:", targetId);
      return [];
    }

    // Kullanıcı oturum açmış mı kontrol et
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // Token'ı yenile
        await currentUser.getIdToken(true);
        console.log("Token refreshed in getComments for user:", currentUser.email);
      } catch (tokenError) {
        console.error("Token refresh error in getComments:", tokenError);
      }
    } else {
      console.log("No authenticated user when fetching comments");
    }

    console.log("Fetching comments for target:", targetId);
    
    // API çağrısını yap
    const response = await http.get<Comment[]>("/comments/target", {
      params: { 
        targetType: TargetType.SERVICE, 
        targetId: targetId.trim() 
      },
      // Hata ayıklaması için
      headers: {
        'X-Debug-Info': 'Frontend-Comments-Request'
      }
    });
    
    // Eski yorum belgelerinde userEmail olmayabilir, mevcut kullanıcı için dolduralım
    const processedComments = response.data.map(comment => {
      if (comment.userId === auth.currentUser?.uid && !comment.userEmail) {
        return {
          ...comment,
          userEmail: auth.currentUser.email
        };
      }
      return comment;
    });
    
    console.log(`Comments retrieved: ${processedComments.length} items`);
    if (processedComments.length > 0) {
      console.log("First comment sample:", {
        id: processedComments[0].id,
        userId: processedComments[0].userId,
        hasEmail: !!processedComments[0].userEmail,
      });
    }
    
    return processedComments;
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    
    // Hata detaylarını yazdır
    if (error.response) {
      console.error("API error details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    // Hata durumunda boş dizi dön
    return [];
  }
};

export const postComment = async (targetId: string, content: string) => {
  if (!targetId || !targetId.trim()) {
    console.error("Invalid targetId:", targetId);
    throw new Error("Geçersiz hedef ID");
  }

  if (!content || !content.trim()) {
    console.error("Empty comment content");
    throw new Error("Yorum içeriği boş olamaz");
  }
  
  // Kullanıcı giriş yapmış mı kontrol et
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error("Yorum yapmak için giriş yapmalısınız");
  }

  try {
    const commentData = {
      targetType: TargetType.SERVICE,
      targetId: targetId.trim(),
      content: content.trim(),
      userEmail: auth.currentUser.email // Kullanıcı emailini de ekle
    };
    
    console.log("Posting comment:", commentData);
    
    const response = await http.post("/comments", commentData);
    
    console.log("Comment posted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error posting comment:", error);
    
    // Daha detaylı hata mesajları
    if (error.response) {
      console.error("API response error:", error.response.status, error.response.data);
      throw new Error(`API Hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
    }
    
    throw error; // React Query'nin hata yakalaması için hatayı ilet
  }
}; 
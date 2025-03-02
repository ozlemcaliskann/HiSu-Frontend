import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { auth } from "@/constants/firebase"; // Firebase authentication
import { router } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { makeRedirectUri } from "expo-auth-session";

// Web'de oturumun düzgün tamamlanmasını sağlar
WebBrowser.maybeCompleteAuthSession(); 

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectUri = "https://auth.expo.io/@ozlemcaliskan/HiSu"; // Google Cloud Console ile uyumlu URI
  console.log("✅ Kullanılan Redirect URI:", redirectUri);
  

  console.log("✅ Kullanılan Redirect URI:", redirectUri);

  // 📌 Google Sign-In Request oluştur
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "792408514806-871vjikmhseqsuquuqr6hignmdiqgc4i.apps.googleusercontent.com",
    iosClientId: "792408514806-q7ufn8ugiqa9gr2v8sqm01gsuobs0vlm.apps.googleusercontent.com",
    redirectUri: redirectUri,
    usePKCE: false, // ✅ id_token almak için gerekli!
  });

  useEffect(() => {
    console.log("🔵 Google Auth Request:", JSON.stringify(request, null, 2));
    console.log("🔵 Google Auth Response:", JSON.stringify(response, null, 2));

    if (response?.type === "success" && response.params?.id_token) {
      console.log("✅ Google Sign-In Başarılı! ID Token:", response.params.id_token);
      handleGoogleLogin(response.params.id_token); // Firebase'e giriş için token'ı gönder
    } else if (response?.type === "cancel") {
      console.warn("⚠️ Google Login Kullanıcı Tarafından İptal Edildi");
    } else if (response?.type === "error") {
      console.error("❌ Google Sign-In Hatası:", response.error);
    }
  }, [response]);


  // 📌 Firebase'e Google ile giriş yap
  const handleGoogleLogin = async (idToken:string) => {
    setLoading(true);
    try {
      console.log("🔵 Firebase Auth Başlatılıyor...");
      console.log("🔵 ID Token:", idToken);

      // 🔴 Firebase için Google kimlik bilgilerini oluştur
      const credential = GoogleAuthProvider.credential(idToken);
      console.log("✅ Firebase Credential Oluşturuldu:", credential);

      // 🔴 Firebase'e giriş yap
      const userCredential = await signInWithCredential(auth, credential);
      console.log("✅ Firebase'e Giriş Başarılı:", userCredential);

      const user = userCredential.user;
      console.log("📌 Kullanıcı Bilgileri:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      if (!user) throw new Error("Firebase Authentication'dan kullanıcı bilgisi alınamadı!");

      // 🏠 Ana sayfaya yönlendir
      router.replace("/");
    } catch (error) {
      console.error("❌ Firebase Login Failed!", error);
      if (error instanceof Error) {
        alert(`Firebase Login failed: ${error.message}`);
      } else {
        alert("Firebase Login failed with an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };


  // 📌 Placeholder Email/Password Login
  const handleEmailPasswordLogin = async () => {
    alert("Email/password login feature is not implemented yet.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your email below to login to your account</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Email/password login button */}
        <TouchableOpacity style={styles.button} onPress={handleEmailPasswordLogin}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Login with Email</Text>}
        </TouchableOpacity>

        {/* Google sign-in button */}
        <TouchableOpacity style={styles.googleButton} onPress={() => {
          console.log("📢 Google Sign-In Button Clicked!");
          if (!request) {
            console.error("❌ Google Sign-In Request is NULL!");
            return;
          }
          promptAsync();
        }}>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator color="white" style={{ marginTop: 10 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  card: { width: "90%", maxWidth: 400, backgroundColor: "#1F1F1F", padding: 20, borderRadius: 10, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#AAAAAA", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", height: 50, backgroundColor: "#333", borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: "#FFF", marginBottom: 15 },
  button: { width: "100%", height: 50, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", borderRadius: 8 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  googleButton: { width: "100%", height: 50, backgroundColor: "#333", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  googleText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router"; // 🆕 Navigasyon için
import { auth } from "@/constants/firebase";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // 🆕 Expo Router Navigasyon

  const redirectUri = makeRedirectUri({ useProxy: true });

  console.log("🔗 Kullanılan Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "792408514806-kh0h7ce8et2hss0vsl92jq5ohknh4f59.apps.googleusercontent.com",
    iosClientId: "792408514806-q7ufn8ugiqa9gr2v8sqm01gsuobs0vlm.apps.googleusercontent.com",
    webClientId: "792408514806-871vjikmhseqsuquuqr6hignmdiqgc4i.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true })
  });

  console.log("🔗 Kullanılan Redirect URI:", redirectUri);

  // 🆕 Google Giriş İşlemi ve Yönlendirme
  useEffect(() => {
    if (response?.type === "success") {
      console.log("✅ Google Auth Response:", response.params);
      const { id_token } = response.params;

      if (!id_token) {
        console.error("❌ Hata: id_token bulunamadı!");
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const email = userCredential.user.email;
          if (email.endsWith("@sabanciuniv.edu")) {
            console.log("✅ Giriş Başarılı:", userCredential.user);
            setUser(userCredential.user);
            router.replace("/MainPage"); // ✅ Kullanıcıyı yönlendir
          } else {
            Alert.alert("Hata", "Sadece @sabanciuniv.edu e-postaları ile giriş yapılabilir.");
            auth.signOut();
            setUser(null);
          }
        })
        .catch((error) => console.error("Google Sign-In Error: ", error));
    }
  }, [response]);

  // 🆕 Email ve Şifre ile Giriş İşlemi
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("✅ Email Girişi Başarılı:", userCredential.user);
        setUser(userCredential.user);
        router.replace("/MainPage"); // ✅ Kullanıcı başarılı giriş yaptıktan sonra yönlendirme
      })
      .catch((error) => {
        console.error("Email Sign-In Error: ", error);
        Alert.alert("Giriş Hatası", error.message);
      });
  };

  // 🆕 Guest (Misafir) Kullanıcı Yönlendirme
  const handleGuestLogin = () => {
    console.log("🚀 Guest Login Activated");
    router.replace("/MainPage"); // ✅ Misafir kullanıcıyı yönlendir
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: "#222", padding: 30, borderRadius: 15, width: "80%", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Login</Text>
        <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 20 }}>Enter your email below to login to your account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          style={{ width: "100%", backgroundColor: "#333", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ width: "100%", backgroundColor: "#333", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 20 }}
        />

        <TouchableOpacity onPress={handleLogin} style={{ width: "100%", backgroundColor: "#007AFF", padding: 12, borderRadius: 8, marginBottom: 10, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => promptAsync()} style={{ width: "100%", backgroundColor: "#444", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* 🆕 Guest Login Button */}
        <TouchableOpacity onPress={handleGuestLogin} style={{ width: "100%", backgroundColor: "#888", padding: 12, borderRadius: 8, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Continue as Guest</Text>
        </TouchableOpacity>

        {user && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16 }}>Hoşgeldin, {user.displayName}!</Text>
            <Image source={{ uri: user.photoURL }} style={{ width: 50, height: 50, borderRadius: 25, marginTop: 10 }} />
          </View>
        )}
      </View>
    </View>
  );
};

export default LoginScreen;

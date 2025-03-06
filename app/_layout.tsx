import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "@/constants/firebase"; // ✅ Firebase Authentication
import { onAuthStateChanged, User } from "firebase/auth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("🛠️ Rendering global _layout.tsx");

  const router = useRouter(); // ✅ useRouter ekledik
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("🔍 Checking Firebase authentication...");

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log(authUser ? `✅ User authenticated: ${authUser.email}` : "❌ No user authenticated.");
      setUser(authUser);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // **🚀 Kullanıcı durumu belli olduktan sonra yönlendirme**
  useEffect(() => {
    if (!isCheckingAuth && fontsLoaded) {
      if (user) {
        console.log("✅ User is logged in, redirecting to MainPage...");
        router.replace("/MainPage"); // ✅ Kullanıcı giriş yaptıysa MainPage yönlendirmesi
      } else {
        console.log("🔄 Redirecting to LoginScreen...");
        router.replace("/LoginScreen"); // ✅ Kullanıcı giriş yapmamışsa LoginScreen yönlendirmesi
      }
    }
  }, [isCheckingAuth, fontsLoaded, user]);

  // **🔥 Firebase durumu yüklenene kadar beklet**
  if (!fontsLoaded || isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} /> {/* ✅ İlk ekran LoginScreen olacak */}
        <Stack.Screen name="MainPage" options={{ headerShown: false }} /> {/* ✅ Giriş başarılıysa MainPage açılacak */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

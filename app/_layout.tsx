import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "@/constants/firebase"; // ✅ Firebase Authentication
import { onAuthStateChanged, User } from "firebase/auth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("🛠️ Rendering global _layout.tsx");

  // Fontları yükle
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Authentication durumlarını yönet
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

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
    if (!isCheckingAuth && fontsLoaded && !hasNavigated) {
      if (!user) {
        console.log("🔄 Redirecting to login...");
        setHasNavigated(true);
        setTimeout(() => router.replace("/LoginScreen"), 100); // **Gecikme koyarak çökme önlenir**
      } else {
        console.log("✅ User is logged in, staying on the main screen.");
        SplashScreen.hideAsync(); // **Oturum açılmışsa Splash Screen kapat**
      }
    }
  }, [isCheckingAuth, fontsLoaded, user, hasNavigated]);

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
        {user ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        )}
      </Stack>
    </ThemeProvider>
  );
}

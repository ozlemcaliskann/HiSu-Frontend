import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "@/constants/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("🛠️ Rendering global _layout.tsx");

  const router = useRouter();
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

  // 🚀 Redirect based on authentication status
  useEffect(() => {
    if (!isCheckingAuth && fontsLoaded) {
      if (user) {
        console.log("✅ User is logged in, redirecting to MainPage...");
        router.replace("/MainPage");
      } else {
        console.log("🔄 Redirecting to LoginScreen...");
        router.replace("/LoginScreen");
      }
    }
  }, [isCheckingAuth, fontsLoaded, user]);

  // Show loading indicator while checking auth
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
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="MainPage" options={{ headerShown: false }} />
        
        {/* Screen components that will be accessible from SideMenu */}
        <Stack.Screen name="screens/AboutUs" options={{ 
          headerShown: true,
          headerTitle: "Hakkımızda",
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/ClubActivities" options={{ 
          headerShown: true,
          headerTitle: "Kulüp Aktiviteleri",
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/ProgramInfo" options={{ 
          headerShown: true,
          headerTitle: "Program Bilgileri", 
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/Rankings" options={{ 
          headerShown: true,
          headerTitle: "Taban Puanlar ve Sıralamalar",
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/Scholarships" options={{ 
          headerShown: true,
          headerTitle: "Burslar ve Ücretler",
          headerBackTitle: "Geri"
        }} />
        
        {/* Faculty screens */}
        <Stack.Screen name="screens/faculties/FASS" options={{ 
          headerShown: true,
          headerTitle: "Sanat ve Sosyal Bilimler",
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/faculties/FENS" options={{ 
          headerShown: true,
          headerTitle: "Mühendislik ve Doğa Bilimleri",
          headerBackTitle: "Geri"
        }} />
        <Stack.Screen name="screens/faculties/FMAN" options={{ 
          headerShown: true,
          headerTitle: "Yönetim Bilimleri",
          headerBackTitle: "Geri"
        }} />
        
        {/* Others */}
        <Stack.Screen name="components/CampusMap" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}
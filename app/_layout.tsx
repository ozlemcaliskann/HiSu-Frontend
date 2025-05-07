import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Açılış ekranının otomatik gizlenmesini engelle
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  console.log("🛠️ Rendering global _layout.tsx");

  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        // Fontlar yüklendiğinde açılış ekranını gizle
        try {
          await SplashScreen.hideAsync();
          console.log("✅ Loading completed...");
        } catch (error) {
          console.warn("Error hiding splash screen:", error);
        }
      }
    };

    prepare();
  }, [fontsLoaded]);

  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Stack initialRouteName="LoginScreen">
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
          
          {/* Map screens */}
          <Stack.Screen name="screens/MapView/index" options={{ 
            headerShown: false 
          }} />
          
          {/* Others */}
          <Stack.Screen name="components/CampusMap" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" options={{ headerShown: true }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

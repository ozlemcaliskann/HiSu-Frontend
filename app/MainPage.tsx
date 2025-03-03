import { View, Text, Button } from "react-native";
import { auth } from "@/constants/firebase";
import { useRouter } from "expo-router";

export default function MainPage() {
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("🚪 User logged out");
      router.replace("/LoginScreen"); // Çıkış yapınca giriş ekranına yönlendir
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>🏠 Ana Sayfa (MainPage)</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>Hoşgeldin, {auth.currentUser?.email}!</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
    </View>
  );
}

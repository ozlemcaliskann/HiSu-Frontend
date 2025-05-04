import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ImageBackground,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import { auth } from "@/constants/firebase";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "792408514806-kh0h7ce8et2hss0vsl92jq5ohknh4f59.apps.googleusercontent.com",
    iosClientId: "792408514806-q7ufn8ugiqa9gr2v8sqm01gsuobs0vlm.apps.googleusercontent.com",
    webClientId: "792408514806-871vjikmhseqsuquuqr6hignmdiqgc4i.apps.googleusercontent.com",
    androidClientId:"792408514806-puq53o6tvmifh8mpnimma4bqde7v4cod.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true })
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (!id_token) return;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const email = userCredential.user.email;
          if (email.endsWith("@sabanciuniv.edu")) {
            setUser(userCredential.user);
            router.replace("/MainPage");
          } else {
            Alert.alert("Hata", "Sadece @sabanciuniv.edu e-postaları ile giriş yapılabilir.");
            auth.signOut();
            setUser(null);
          }
        })
        .catch((error) => console.error("Google Sign-In Error: ", error));
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.replace("/MainPage");
      })
      .catch((error) => {
        Alert.alert("Giriş Hatası", error.message);
      });
  };

  const handleGuestLogin = () => {
    router.replace("/MainPage");
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: "https://live.staticflickr.com/65535/48131860942_3d8415d96a_b.jpg" }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                {/* Logo or App Name */}
                <View style={{ marginBottom: 30, alignItems: "center" }}>
                  <Text style={{ fontSize: 34, fontWeight: "bold", color: "white", textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5 }}>
                    HiSu
                  </Text>
                </View>

                {/* Login Card */}
                <View 
                  style={{ 
                    width: "75%", 
                    backgroundColor: "rgba(255, 255, 255, 0.85)", 
                    borderRadius: 20, 
                    padding: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >


                  {/* Input Fields with Icons */}
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ color: "#555", fontSize: 14, marginBottom: 8, fontWeight: "500" }}>Email</Text>
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{
                        width: "100%",
                        backgroundColor: "#f7f7f7",
                        color: "#333",
                        padding: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#eaeaea",
                        fontSize: 15,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ color: "#555", fontSize: 14, marginBottom: 8, fontWeight: "500" }}>Password</Text>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      style={{
                        width: "100%",
                        backgroundColor: "#f7f7f7",
                        color: "#333",
                        padding: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#eaeaea",
                        fontSize: 15,
                      }}
                    />
                  </View>



                  {/* Login Button */}
                  <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                      width: "100%",
                      backgroundColor: "#007AFF",
                      padding: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      marginBottom: 10,
                      shadowColor: "#007AFF",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Sign In</Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: "#E0E0E0" }} />
                    <Text style={{ marginHorizontal: 10, color: "#666" }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: "#E0E0E0" }} />
                  </View>

                  {/* Google Login Button */}
                  <TouchableOpacity
                    onPress={() => promptAsync()}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      padding: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 15,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <View style={{ marginRight: 12 }}>
                      {/* You can replace this with an actual Google icon image */}
                      <View style={{ width: 20, height: 20, backgroundColor: "#4285F4", borderRadius: 2 }} />
                    </View>
                    <Text style={{ color: "#333", fontWeight: "500", fontSize: 15 }}>Sign in with Google</Text>
                  </TouchableOpacity>

                  {/* Guest Login Button */}
                  <TouchableOpacity
                    onPress={handleGuestLogin}
                    style={{
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                      padding: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#eaeaea",
                    }}
                  >
                    <Text style={{ color: "#666", fontWeight: "500", fontSize: 15 }}>Continue as Guest</Text>
                  </TouchableOpacity>
                </View>

                {/* User Profile Preview if logged in */}
                {user && (
                  <View style={{ 
                    marginTop: 20, 
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: 15,
                    borderRadius: 15
                  }}>
                    <Text style={{ color: "#333", fontSize: 16, fontWeight: "500" }}>Hoşgeldin, {user.displayName}!</Text>
                    <Image
                      source={{ uri: user.photoURL }}
                      style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 30, 
                        marginTop: 10,
                        borderWidth: 2,
                        borderColor: "#fff"
                      }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default LoginScreen;
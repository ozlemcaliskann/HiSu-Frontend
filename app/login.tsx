import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "@/constants/firebase";  // Make sure the Firebase provider is correct
import { router } from "expo-router";

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle email and password login
  const handleEmailPasswordLogin = async () => {
    // Add your email/password login logic here if needed.
    alert("Email/password login feature is not implemented yet.");
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Initiate Google login with Firebase
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error("No user found.");
      
      console.log("User logged in:", result.user);
      router.replace("/");  // Redirect to the home page or the main screen
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
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
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Email/password login button */}
        <TouchableOpacity style={styles.button} onPress={handleEmailPasswordLogin}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login with Email</Text>
          )}
        </TouchableOpacity>

        {/* Google sign-in button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",  // Dark background
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#1F1F1F", // Dark card background
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",  // White text for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",  // Lighter text for subtitle
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",  // Dark input background
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#FFF",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF", // Blue button
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  googleText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

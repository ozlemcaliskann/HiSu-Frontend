import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  doc,
  getDoc,
  setDoc,
} from "@/constants/firebase";

const LoginScreen = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const storedRole = await AsyncStorage.getItem("role");
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      redirectUser(storedRole);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      // Fetch role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let assignedRole = "PUBLIC";
      if (!userSnap.exists()) {
        const emailDomain = user.email.split("@")[1];
        assignedRole = emailDomain === "sabanciuniv.edu" ? "PRIVATE" : "PUBLIC";
        await setDoc(userRef, { uid: user.uid, email: user.email, role: assignedRole });
      } else {
        assignedRole = userSnap.data().role;
      }

      setRole(assignedRole);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("role", assignedRole);

      redirectUser(assignedRole);
    } catch (error) {
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    if (role === "PRIVATE") {
      navigation.navigate("Dashboard");
    } else {
      navigation.navigate("PublicAccess");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

      {user ? (
        <>
          <Image source={{ uri: user.photoURL }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={{ marginTop: 10 }}>{user.email}</Text>
          <Text style={{ fontWeight: "bold", color: role === "PRIVATE" ? "green" : "blue" }}>{role} User</Text>
          <Button title="Logout" color="red" onPress={handleLogout} />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button title="Sign in with Google" onPress={handleLogin} />
          )}
        </>
      )}
    </View>
  );
};

export default LoginScreen;

import React, { use, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigator = useNavigation();
  const { logIn, error, loading } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f6fa",
      }}
    >
      <View
        style={{
          width: "85%",
          padding: 24,
          backgroundColor: "#fff",
          borderRadius: 16,
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 24,
            color: "#2d3436",
            textAlign: "center",
          }}
        >
          Login
        </Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={{
            borderWidth: 1,
            borderColor: "#dfe6e9",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            backgroundColor: "#f1f2f6",
          }}
        />
        <TextInput
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#dfe6e9",
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            backgroundColor: "#f1f2f6",
          }}
        />
        {error && (
          <Text style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
            {error}
          </Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "#0984e3",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => logIn(email, password)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Sign In
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#636e72", textAlign: "center" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigator.navigate("SignUp");
            }}
          >
            <Text
              style={{ color: "#0984e3", fontWeight: "bold", marginLeft: 4 }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;

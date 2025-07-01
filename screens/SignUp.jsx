import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigator = useNavigation();
  const { signUp, error, loading } = useAuth();

  const validatePassword = (pwd) => {
    if (pwd.length === 0) return "";
    if (pwd.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateConfirmPassword = (pwd, confirmPwd) => {
    if (confirmPwd.length === 0) return "";
    if (pwd !== confirmPwd) {
      return "Passwords do not match";
    }
    return "";
  };

  const isFormValid = () => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const error = validatePassword(text);
    setPasswordError(error);
    
    if (confirmPassword.length > 0) {
      const confirmError = validateConfirmPassword(text, confirmPassword);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    const error = validateConfirmPassword(password, text);
    setConfirmPasswordError(error);
  };

  const handleSignUp = () => {
    if (isFormValid()) {
      signUp(name,email, password);
    }
  };
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
          borderRadius: 16,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 4,
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
          Register
        </Text>
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          style={{
            backgroundColor: "#f1f2f6",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#dfe6e9",
          }}
          placeholder="Full Name"
          placeholderTextColor="#888"
        />
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={{
            backgroundColor: "#f1f2f6",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#dfe6e9",
          }}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={handlePasswordChange}
          value={password}
          style={{
            backgroundColor: "#f1f2f6",
            borderRadius: 8,
            padding: 12,
            marginBottom: passwordError ? 8 : 16,
            borderWidth: 1,
            borderColor: passwordError ? "#e74c3c" : "#dfe6e9",
          }}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        {passwordError ? (
          <Text style={{ color: "#e74c3c", fontSize: 12, marginBottom: 16 }}>
            {passwordError}
          </Text>
        ) : null}
        <TextInput
          onChangeText={handleConfirmPasswordChange}
          value={confirmPassword}
          style={{
            backgroundColor: "#f1f2f6",
            borderRadius: 8,
            padding: 12,
            marginBottom: confirmPasswordError ? 8 : 24,
            borderWidth: 1,
            borderColor: confirmPasswordError ? "#e74c3c" : "#dfe6e9",
          }}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        {confirmPasswordError ? (
          <Text style={{ color: "#e74c3c", fontSize: 12, marginBottom: 16 }}>
            {confirmPasswordError}
          </Text>
        ) : null}
        {error && (
          <Text style={{ color: "#e74c3c", marginBottom: 16, textAlign: "center" }}>
            {error}
          </Text>
        )}
        <TouchableOpacity
          disabled={!isFormValid() || loading}
          style={{
            backgroundColor: isFormValid() && !loading ? "#0984e3" : "#b2b2b2",
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
            opacity: isFormValid() && !loading ? 1 : 0.6,
          }}
          onPress={handleSignUp}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#636e72" }}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigator.navigate("Login")}
            style={{ marginLeft: 4 }}
          >
            <Text style={{ color: "#0984e3", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SignUp;

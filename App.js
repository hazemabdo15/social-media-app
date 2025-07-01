import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import DynamicNativeStack from "./navigation/dynamicNativeStack";
import AuthProvider, { useAuth } from "./contexts/AuthContext";
import DynamicStackAuth from "./navigation/dynamicStackAuth";
import Loading from "./screens/Loading";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function AuthNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return user ? <DynamicNativeStack /> : <DynamicStackAuth />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

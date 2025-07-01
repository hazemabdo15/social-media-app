import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Logout from "../screens/Logout";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import { useAuth } from "../contexts/AuthContext";

const drawerStack = createDrawerNavigator();

// Custom drawer content component
const CustomDrawerContent = (props) => {
  const { user } = useAuth();
  
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.greetingText}>
          Hello, {user?.displayName || "User"} 👋
        </Text>
        <Text style={styles.emailText}>
          {user?.email}
        </Text>
      </View>
      
      <View style={styles.separator} />
      
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DynamicDrawer = () => {
  const { user } = useAuth();
  return (
    <drawerStack.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        headerTitle: "hello",
        drawerStyle: {
          backgroundColor: "#f5f6fa",
          width: "60%",
        },
        drawerActiveTintColor: "#0984e3",
        drawerInactiveTintColor: "#636e72",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
        },
      }}
    >
      <drawerStack.Screen name="Home" component={Home} />
      <drawerStack.Screen name="Profile" component={Profile} />
      <drawerStack.Screen name="logout" component={Logout} />
    </drawerStack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: "#f5f6fa",
  },
  drawerHeader: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#636e72",
  },
  separator: {
    height: 1,
    backgroundColor: "#dfe6e9",
    marginHorizontal: 16,
    marginVertical: 16,
  },
});

export default DynamicDrawer;

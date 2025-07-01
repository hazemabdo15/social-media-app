import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Logout from "../screens/Logout";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import DynamicDrawer from "./dynamicDrawer";

const myStack = createNativeStackNavigator();
const DynamicNativeStack = () => {
  return (
    <myStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <myStack.Screen name="Drawer" component={DynamicDrawer} />
      <myStack.Screen name="Home" component={Home} />
      <myStack.Screen name="Profile" component={Profile} />
      <myStack.Screen name="Logout" component={Logout} />
    </myStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default DynamicNativeStack;

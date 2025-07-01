import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

const authStack = createNativeStackNavigator();
const DynamicStackAuth = () => {
  return (
    <authStack.Navigator>
      <authStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <authStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </authStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default DynamicStackAuth;

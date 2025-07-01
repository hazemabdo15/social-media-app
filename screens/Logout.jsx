import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Loading from "./Loading";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Logout = () => {
  const { logOut, loading } = useAuth();
  const navigator = useNavigation();

  useFocusEffect(
    useCallback(() => {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              navigator.navigate("Home");
            },
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              logOut();
            },
          },
        ],
        { cancelable: false }
      );
    }, [navigator, logOut])
  );

  if (loading) {
    return <Loading />;
  }

  return <View></View>;
};

const styles = StyleSheet.create({});

export default Logout;

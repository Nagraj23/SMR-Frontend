import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./Context/AuthContext";
import Landing from "./Screens/Star";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Email from "./Screens/Email";
import Otp from "./Screens/OTP";
import Reset from "./Screens/Reset";
import MainTabs from "./Screens/MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
          <ActivityIndicator size="large" color="#91E612" />
        </View>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken ? (
              <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
              <Stack.Group>
                <Stack.Screen name="Landing" component={Landing} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Email" component={Email} />
                <Stack.Screen name="OTP" component={Otp} />
                <Stack.Screen name="Reset" component={Reset} />
              </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}
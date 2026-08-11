
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Landing from "./Screens/Star";
import Register from "./Screens/Register"
import Login from "./Screens/Login";
import Email from "./Screens/Email";
import Otp from "./Screens/OTP";
import Reset from "./Screens/Reset"

const Stack=createNativeStackNavigator();

export default function AppNavigator(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Landing" component={Landing}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Email" component={Email}/>
          <Stack.Screen name="OTP" component={Otp}/>
          <Stack.Screen name="Reset" component={Reset}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


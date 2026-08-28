import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Home";
import RouteScreen from "./Route";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "#91E612",
                tabBarInactiveTintColor: "#64748B",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "700",
                    marginBottom: 6,
                },
                tabBarStyle: {
                    height: 68,
                    paddingTop: 8,
                    paddingBottom: 8,
                    backgroundColor: "#0F172A",
                    borderTopWidth: 0,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    position: "absolute",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 12,
                },
                tabBarIcon: ({ color, focused }) => {
                    let iconName;
                    if (route.name === "Home") iconName = focused ? "home" : "home-outline";
                    else if (route.name === "Route") iconName = focused ? "map" : "map-outline";
                    else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";

                    return (
                        <Ionicons
                            name={iconName}
                            size={focused ? 26 : 22}
                            color={color}
                            style={{ marginBottom: -2 }}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Route" component={RouteScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
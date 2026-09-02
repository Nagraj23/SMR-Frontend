import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./Context/AuthContext";
import { navigationRef, navigate } from "./utils/NavigationService";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import GlobalNotificationBanner from "./Screens/GlobalNotificationBanner";

// Auth Stack Screens
import Landing from "./Screens/Star";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Email from "./Screens/Email";
import Otp from "./Screens/OTP";
import Reset from "./Screens/Reset";

// App Screens
import MainTabs from "./Screens/MainTabs";
import RouteScreen from "./Screens/Route";
import ManifestDetails from "./Screens/ManifestDetails";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { userToken, isLoading } = useAuth();
    const [activeNotification, setActiveNotification] = useState(null);

    // Global WebSocket Ingestion Loop
    useNotificationSocket(userToken, (event) => {
        setActiveNotification(event);
    });

    // Action Dispatcher on Notification Tap
    const handleBannerPress = () => {
        if (!activeNotification) return;

        const { type, payload } = activeNotification;
        setActiveNotification(null); // Dismiss banner

        switch (type) {
            case "BOOKING_REQUEST":
                // Driver navigates to approval manifest
                navigate("ManifestDetails", {
                    bookingId: payload?.bookingId,
                    rideId: payload?.rideId,
                });
                break;

            case "BOOKING_ACCEPTED":
            case "RIDE_STARTED":
                // Passenger navigates to active route tracking
                navigate("RouteScreen", {
                    rideId: payload?.rideId,
                    bookingId: payload?.bookingId,
                });
                break;

            case "RIDE_COMPLETED":
                navigate("MainTabs", { screen: "Profile" });
                break;

            default:
                console.log("Unhandled navigation for event type:", type);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#91E612" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Global In-App Alert Banner */}
            <GlobalNotificationBanner
                notification={activeNotification}
                onPress={handleBannerPress}
                onClose={() => setActiveNotification(null)}
            />

            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {userToken ? (
                        <Stack.Group>
                            <Stack.Screen name="MainTabs" component={MainTabs} />
                            <Stack.Screen name="RouteScreen" component={RouteScreen} />
                            <Stack.Screen name="ManifestDetails" component={ManifestDetails} />
                        </Stack.Group>
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
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
});
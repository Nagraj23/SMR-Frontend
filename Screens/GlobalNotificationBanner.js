import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GlobalNotificationBanner({ notification, onPress, onClose }) {
    if (!notification) return null;

    const getTitle = () => {
        switch (notification.type) {
            case "BOOKING_REQUEST":
                return "New Ride Request! 🎯";
            case "BOOKING_ACCEPTED":
                return "Booking Confirmed! 🎉";
            case "RIDE_STARTED":
                return "Ride Started! 🚗";
            case "RIDE_COMPLETED":
                return "Arrived at Destination! 🏁";
            default:
                return "Ride Alert";
        }
    };

    const getSubtitle = () => {
        switch (notification.type) {
            case "BOOKING_REQUEST":
                return `A passenger requested ${notification.payload?.seatsBooked || 1} seat(s).`;
            case "BOOKING_ACCEPTED":
                return "The driver accepted your booking request.";
            case "RIDE_STARTED":
                return "Your ride is now in progress. Track live route.";
            case "RIDE_COMPLETED":
                return "Trip complete. Tap to review payment and summary.";
            default:
                return "Tap to view details.";
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.bannerContainer}
                onPress={onPress}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications" size={20} color="#FFFFFF" />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>{getTitle()}</Text>
                    <Text style={styles.subText} numberOfLines={1}>
                        {getSubtitle()}
                    </Text>
                </View>

                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={18} color="#94A3B8" />
                </TouchableOpacity>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        top: Platform.OS === "android" ? 35 : 10,
        left: 15,
        right: 15,
        zIndex: 9999,
    },
    bannerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 16,
        padding: 12,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#1E293B",
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    subText: {
        color: "#94A3B8",
        fontSize: 12,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
        marginLeft: 8,
    },
});
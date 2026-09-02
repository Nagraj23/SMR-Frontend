import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ManifestDetails({ route, navigation }) {
    const { bookingId, rideId } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ride Manifest & Requests</Text>
            <Text style={styles.subtitle}>Ride ID: {rideId || "N/A"}</Text>
            <Text style={styles.subtitle}>Booking ID: {bookingId || "N/A"}</Text>

            <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.btnText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#94A3B8",
        marginBottom: 6,
    },
    btn: {
        marginTop: 24,
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    btnText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});
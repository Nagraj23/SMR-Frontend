import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useAuth } from "../Context/AuthContext";

export default function Home() {
    const { userData, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome 👋</Text>

            <Text style={styles.subtitle}>
                You are successfully logged in.
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>
                    {userData?.name || "User"}
                </Text>

                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>
                    {userData?.mail || "No email"}
                </Text>

                <Text style={styles.label}>User ID</Text>
                <Text style={styles.value}>
                    {userData?.id || "No ID"}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={signOut}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        justifyContent: "center",
        padding: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0F172A",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        color: "#64748B",
        textAlign: "center",
        marginBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 22,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#64748B",
        marginTop: 10,
        marginBottom: 4,
    },

    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
    },

    logoutButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#91E612",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },

    logoutText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#0F172A",
    },
});
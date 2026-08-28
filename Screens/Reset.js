import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import axios from "axios";
import { AUTH_URL } from "../constants/api";

const ResetPassword = ({ route, navigation }) => {
    const { mail, email } = route?.params || {};
    const targetMail = mail || email || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleReset = async () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert("Validation Error", "Please fill in all password fields.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Validation Error", "Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Validation Error", "Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                email: targetMail.trim(),
                pass: newPassword,
            };
            const res = await axios.put(`${AUTH_URL}/api/auth/reset`, payload);
            const message = typeof res.data === "string" ? res.data : "Password reset successfully";
            Alert.alert("Success", message, [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Login"),
                },
            ]);
        } catch (err) {
            const message = typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message || "Failed to update account password.";
            Alert.alert("Reset Failed", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.logo}>SMR</Text>
                    <Text style={styles.cardTitle}>Create New Password</Text>
                    <Text style={styles.cardSubtitle}>Your account has been verified. Create a new secure password to continue.</Text>
                    <View style={styles.successBadgeContainer}>
                        <Text style={styles.successText}>✓ Account Verified</Text>
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                placeholderTextColor="#64748B"
                                secureTextEntry={!showNewPass}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)} style={styles.showBtn} activeOpacity={0.6}>
                                <Text style={styles.showBtnText}>{showNewPass ? "Hide" : "Show"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                placeholderTextColor="#64748B"
                                secureTextEntry={!showConfirmPass}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={styles.showBtn} activeOpacity={0.6}>
                                <Text style={styles.showBtnText}>{showConfirmPass ? "Hide" : "Show"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleReset} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#0F172A" size="small" /> : <Text style={styles.primaryBtnText}>Reset Password</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    scrollContent: { flexGrow: 1, justifyContent: "center", padding: 22, paddingVertical: 35 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 25, borderWidth: 1, borderColor: "#E2E8F0", elevation: 4, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12 },
    logo: { fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: 2, marginBottom: 18 },
    cardTitle: { fontSize: 30, fontWeight: "800", color: "#0F172A", marginBottom: 7 },
    cardSubtitle: { fontSize: 15, lineHeight: 22, color: "#64748B", marginBottom: 22 },
    successBadgeContainer: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", borderWidth: 1, paddingVertical: 11, paddingHorizontal: 15, borderRadius: 14, alignItems: "center", marginBottom: 24 },
    successText: { fontSize: 14, fontWeight: "700", color: "#059669" },
    fieldGroup: { marginBottom: 17 },
    label: { fontSize: 14, fontWeight: "600", color: "#0F172A", marginBottom: 7, marginLeft: 3 },
    inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 15, height: 55 },
    input: { flex: 1, fontSize: 16, color: "#0F172A" },
    showBtn: { paddingLeft: 8 },
    showBtnText: { fontSize: 12, color: "#10B981", fontWeight: "700" },
    primaryBtn: { backgroundColor: "#91E612", borderRadius: 14, height: 55, alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 5 },
    primaryBtnDisabled: { opacity: 0.65 },
    primaryBtnText: { color: "#0F172A", fontSize: 17, fontWeight: "700" },
});
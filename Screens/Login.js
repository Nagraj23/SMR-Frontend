import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    ToastAndroid,
    Alert,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { AUTH_URL } from "../constants/api";
import { useAuth } from "../Context/AuthContext";

export default function Login({ navigation }) {
    const { signIn } = useAuth();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async () => {
        if (!mail.trim() || !password.trim()) {
            Alert.alert("Validation Error", "Email & Password required");
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            console.log("🔥 LOGIN: sending request");

            const res = await axios.post(
                `${AUTH_URL}/auth/login`,
                {
                    mail: mail.trim(),
                    password,
                },
                {
                    timeout: 15000,
                }
            );

            console.log("🔥 LOGIN: response received");
            console.log("🔥 LOGIN: status =", res.status);
            console.log("🔥 LOGIN: data =", res.data);

            const data = res.data;

            if (!data?.token || !data?.id) {
                console.log("❌ LOGIN: invalid response");
                console.log("❌ Response:", data);

                Alert.alert(
                    "Login Failed",
                    data?.message || "Invalid server response"
                );

                return;
            }

            console.log("✅ LOGIN API SUCCESS");
            console.log("✅ TOKEN EXISTS:", !!data.token);
            console.log("✅ USER ID:", data.id);

            // Save authentication state
            console.log("🔥 LOGIN: calling signIn...");

            await signIn(
                data.token,
                data.id,
                data.name || "",
                data.mail || mail.trim()
            );

            console.log("✅ SIGNIN FINISHED");

            // Show success only after signIn completes
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    "Login successful",
                    ToastAndroid.SHORT
                );
            }

        } catch (err) {
            console.log("================================");
            console.log("❌ LOGIN ERROR");
            console.log("❌ Message:", err.message);
            console.log("❌ Code:", err.code);
            console.log("❌ URL:", err.config?.url);
            console.log("❌ Method:", err.config?.method);
            console.log("❌ Status:", err.response?.status);
            console.log("❌ Response:", err.response?.data);
            console.log("================================");

            const message =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                err.message ||
                "Unable to establish network connection.";

            Alert.alert(
                "Login Error",
                `${message}\n\nURL: ${err.config?.url || "Unknown"}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.logo}>SMR</Text>
                    <Text style={styles.cardTitle}>Welcome Back</Text>
                    <Text style={styles.cardSubtitle}>
                        Sign in to continue your safe journey with SMR.
                    </Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#64748B"
                                value={mail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                                onChangeText={setMail}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                placeholderTextColor="#64748B"
                                secureTextEntry={!showPass}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPass(!showPass)}
                                style={styles.showBtn}
                            >
                                <Text style={styles.showBtnText}>
                                    {showPass ? "Hide" : "Show"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Email")}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryBtn, loading && styles.btnDisabled]}
                        activeOpacity={0.85}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0F172A" />
                        ) : (
                            <Text style={styles.primaryBtnText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.footerLink}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 22,
        paddingVertical: 35,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 25,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 4,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    logo: {
        fontSize: 26,
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: 2,
        marginBottom: 18,
    },
    cardTitle: {
        fontSize: 31,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: "#64748B",
        marginBottom: 27,
    },
    fieldGroup: {
        marginBottom: 17,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F172A",
        marginBottom: 7,
        marginLeft: 3,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingHorizontal: 15,
        height: 55,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#0F172A",
    },
    showBtn: {
        paddingLeft: 10,
    },
    showBtnText: {
        fontSize: 13,
        color: "#10B981",
        fontWeight: "700",
    },
    forgotPasswordContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
        marginTop: 2,
    },
    forgotPasswordText: {
        color: "#10B981",
        fontSize: 14,
        fontWeight: "700",
    },
    primaryBtn: {
        backgroundColor: "#91E612",
        borderRadius: 14,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    btnDisabled: {
        opacity: 0.65,
    },
    primaryBtnText: {
        color: "#0F172A",
        fontSize: 17,
        fontWeight: "700",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 5,
    },
    footerText: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500",
    },
    footerLink: {
        fontSize: 14,
        color: "#10B981",
        fontWeight: "700",
    },
});
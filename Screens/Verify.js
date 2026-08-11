import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { AUTH_URL } from "../constants/api";

const OTP_LENGTH = 6;

const Verify = ({ navigation, route }) => {
  const { email } = route.params;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputs = useRef([...Array(OTP_LENGTH)].map(() => React.createRef()));

  /* =========================
      DERIVED STATE
  ========================= */
  const isOtpComplete = otp.every((d) => d !== "");

  /* =========================
      LOG EMAIL
  ========================= */
  useEffect(() => {
    console.log("📧 [VERIFY] Email received:", email);
  }, []);

  /* =========================
      INPUT HANDLER
  ========================= */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index

    ];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].current.focus();
    }
    if (!value && index > 0) {
      inputs.current[index - 1].current.focus();
    }
  };

  /* =========================
      VERIFY OTP
  ========================= */
  const handleVerify = async () => {
    if (!isOtpComplete || loading) return;

    const otpCode = otp.join("");
    console.log("🔐 [VERIFY] OTP Entered:", otpCode);

    setLoading(true);

    try {
      const res = await fetch(`${AUTH_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const text = await res.text(); // 🔥 SAFE for string or JSON
      console.log("📥 [VERIFY] Raw Response:", text);

      if (res.ok && text.toLowerCase().includes("verified")) {
        Platform.OS === "android"
          ? ToastAndroid.show("OTP Verified ✅", ToastAndroid.SHORT)
          : Alert.alert("Success", "OTP Verified ✅");

        navigation.replace("Login");
      } else {
        Alert.alert("Invalid OTP", text);
      }
    } catch (err) {
      console.error("❌ [VERIFY] Error:", err);
      Alert.alert("Error", "OTP verification failed 💀");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      RESEND OTP
  ========================= */
  const handleResend = async () => {
    if (resending) return;

    console.log("🔁 [RESEND] OTP requested");

    setResending(true);
    setOtp(Array(OTP_LENGTH).fill("")); // 🔥 CLEAR OTP
    inputs.current[0].current.focus();

    try {
      const res = await fetch(`${AUTH_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      console.log("📥 [RESEND] Response:", text);

      Platform.OS === "android"
        ? ToastAndroid.show("OTP Resent 📩", ToastAndroid.SHORT)
        : Alert.alert("Success", "OTP resent");
    } catch (err) {
      console.error("❌ [RESEND] Error:", err);
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  /* =========================
      UI
  ========================= */
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/verify.png")}
        style={styles.image}
      />

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email
      </Text>

      {/* OTP INPUTS */}
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={inputs.current[i]}
            style={[
              styles.otpInput,
              digit && styles.otpFilled,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(v) => handleChange(v, i)}
          />
        ))}
      </View>

      {/* VERIFY BUTTON */}
      <TouchableOpacity
        style={[
          styles.button,
          (!isOtpComplete || loading) && styles.buttonDisabled,
        ]}
        onPress={handleVerify}
        disabled={!isOtpComplete || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      {/* RESEND */}
      <TouchableOpacity
        onPress={handleResend}
        disabled={resending}
      >
        <Text style={styles.resendText}>
          {resending ? "Resending..." : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verify;

/* =========================
      STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E90FF",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#8d99ae",
    textAlign: "center",
    marginBottom: 30,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 22,
    backgroundColor: "#f6f7fb",
    elevation: 2,
  },
  otpFilled: {
    borderColor: "#1E90FF",
  },
  button: {
    backgroundColor: "#1E90FF",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9bbcff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  resendText: {
    textAlign: "center",
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
  },
});

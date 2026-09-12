import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { RIDE_URL } from "../constants/api";

const appColors = {
    primary: "#F59E0B",
    accent: "#91E612",
    pickupDot: "#10B981",
    dropDot: "#EF4444",
    darkText: "#0F172A",
    subText: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F1F5F9",
    cardBg: "#FFFFFF",
    bg: "#F8FAFC",
};

const SOLAPUR_SUGGESTIONS = [
    { id: "1", title: "Saat Rasta", lat: 17.6680, lon: 75.9080 },
    { id: "2", title: "Kanna Chowk", lat: 17.6720, lon: 75.9140 },
    { id: "3", title: "Old Pune Naka", lat: 17.6840, lon: 75.8920 },
    { id: "4", title: "Railway Station", lat: 17.6590, lon: 75.9060 },
    { id: "5", title: "Navi Peth", lat: 17.6710, lon: 75.9100 },
];

export default function PublishScreen({ navigation, route }) {
    const { userData, user, userToken } = useAuth();
    const currentCoords = route.params?.currentCoords || { latitude: 17.6599, longitude: 75.9064 };

    const [pickupName, setPickupName] = useState("Current Location");
    const [destinationName, setDestinationName] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedDestCoords, setSelectedDestCoords] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(3);
    const [seatFare, setSeatFare] = useState("50.0");
    const [loading, setLoading] = useState(false);

    const handleDestinationChange = (text) => {
        setDestinationName(text);
        if (text.trim().length > 0) {
            const filtered = SOLAPUR_SUGGESTIONS.filter((item) =>
                item.title.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (place) => {
        setDestinationName(place.title);
        setSelectedDestCoords({ latitude: place.lat, longitude: place.lon });
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const handlePublish = async () => {
        const activeUserId = userData?.id || user?.id;
        if (!activeUserId) {
            Alert.alert("Authentication", "Please log in to publish a ride.");
            return;
        }

        if (!destinationName.trim()) {
            Alert.alert("Missing Destination", "Please enter where you are heading.");
            return;
        }

        if (isNaN(Number(seatFare)) || Number(seatFare) <= 0) {
            Alert.alert("Invalid Fare", "Please set a valid price per seat.");
            return;
        }

        setLoading(true);

        const startLat = currentCoords.latitude;
        const startLon = currentCoords.longitude;
        const endLat = selectedDestCoords?.latitude || (startLat + 0.015);
        const endLon = selectedDestCoords?.longitude || (startLon + 0.015);

        const payload = {
            driverId: activeUserId,
            vehicleId: userData?.vehicleId || user?.vehicleId || "22222222-2222-2222-2222-222222222222",
            startLatitude: startLat,
            startLongitude: startLon,
            endLatitude: endLat,
            endLongitude: endLon,
            availableSeats: availableSeats,
            seatFare: parseFloat(seatFare),
        };

        try {
            await axios.post(`${RIDE_URL}/api/rides/create`, payload, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            Alert.alert("Ride Published! 🚗", "Your route is live and visible to riders.", [
                {
                    text: "Done",
                    onPress: () => navigation.navigate("MainTabs"),
                },
            ]);
        } catch (error) {
            const err = error.response?.data?.message || error.response?.data || "Failed to publish ride.";
            Alert.alert("Publish Failed", typeof err === "string" ? err : JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Navigation Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("MainTabs")}
                >
                    <Ionicons name="arrow-back" size={22} color={appColors.darkText} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offer / Publish Ride</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Route Form Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Route Points</Text>

                    <View style={styles.inputGroup}>
                        <Ionicons name="radio-button-on" size={18} color={appColors.pickupDot} style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            value={pickupName}
                            onChangeText={setPickupName}
                            placeholder="Starting Pickup Point"
                            placeholderTextColor={appColors.subText}
                        />
                    </View>

                    <View style={styles.connectorLine} />

                    <View style={styles.inputGroup}>
                        <Ionicons name="location" size={18} color={appColors.dropDot} style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            value={destinationName}
                            onChangeText={handleDestinationChange}
                            placeholder="Destination (e.g. Kanna Chowk)"
                            placeholderTextColor={appColors.subText}
                        />
                    </View>

                    {/* Auto-suggest dropdown */}
                    {suggestions.length > 0 && (
                        <View style={styles.suggestionOverlay}>
                            <FlatList
                                data={suggestions}
                                keyExtractor={(item) => item.id}
                                keyboardShouldPersistTaps="always"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.suggestionRow}
                                        onPress={() => handleSelectSuggestion(item)}
                                    >
                                        <Ionicons name="location-outline" size={16} color={appColors.subText} />
                                        <Text style={styles.suggestionText}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                {/* Capacity & Price Setup */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Capacity & Pricing</Text>

                    <View style={styles.rowItem}>
                        <View>
                            <Text style={styles.itemTitle}>Available Seats</Text>
                            <Text style={styles.itemSubtitle}>Max passengers you can take</Text>
                        </View>
                        <View style={styles.counterWrap}>
                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => setAvailableSeats((s) => Math.max(1, s - 1))}
                            >
                                <Text style={styles.counterBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{availableSeats}</Text>
                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => setAvailableSeats((s) => Math.min(6, s + 1))}
                            >
                                <Text style={styles.counterBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowItem}>
                        <View>
                            <Text style={styles.itemTitle}>Fare Per Seat (₹)</Text>
                            <Text style={styles.itemSubtitle}>Price charged to each rider</Text>
                        </View>
                        <TextInput
                            style={styles.fareInput}
                            keyboardType="numeric"
                            value={seatFare}
                            onChangeText={setSeatFare}
                        />
                    </View>
                </View>

                {/* Submit Action */}
                <TouchableOpacity
                    style={[styles.publishBtn, loading && { opacity: 0.65 }]}
                    onPress={handlePublish}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#0F172A" />
                    ) : (
                        <Text style={styles.publishBtnText}>Publish Ride Route</Text>
                    )}
                </TouchableOpacity>

                {/* Cancel Return Button */}
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.cancelBtnText}>Cancel & Go Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.bg,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "ios" ? 54 : 44,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: appColors.inputBg,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: appColors.darkText,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: appColors.cardBg,
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: appColors.border,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: appColors.subText,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 14,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.inputBg,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: appColors.border,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputField: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: appColors.darkText,
    },
    connectorLine: {
        width: 2,
        height: 14,
        backgroundColor: "#CBD5E1",
        marginLeft: 20,
        marginVertical: 4,
    },
    suggestionOverlay: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: appColors.border,
        maxHeight: 140,
        marginTop: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    suggestionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
        gap: 8,
    },
    suggestionText: {
        fontSize: 13,
        fontWeight: "600",
        color: appColors.darkText,
    },
    rowItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: appColors.darkText,
    },
    itemSubtitle: {
        fontSize: 12,
        color: appColors.subText,
        marginTop: 2,
    },
    counterWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: appColors.border,
    },
    counterBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    counterBtnText: {
        fontSize: 16,
        fontWeight: "700",
        color: appColors.darkText,
    },
    counterText: {
        fontSize: 15,
        fontWeight: "800",
        color: appColors.darkText,
        paddingHorizontal: 8,
    },
    divider: {
        height: 1,
        backgroundColor: appColors.border,
        marginVertical: 12,
    },
    fareInput: {
        width: 80,
        height: 40,
        backgroundColor: appColors.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: appColors.border,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "700",
        color: appColors.darkText,
    },
    publishBtn: {
        backgroundColor: appColors.accent,
        borderRadius: 16,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 6,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    publishBtnText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#0F172A",
    },
    cancelBtn: {
        alignItems: "center",
        paddingVertical: 14,
        marginTop: 4,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#EF4444",
    },
});
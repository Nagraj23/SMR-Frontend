import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { AI_URL, RIDE_URL } from "../constants/api"; // Adjust your constants path

const appColors = {
    primary: "#F59E0B",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    darkText: "#0F172A",
    subText: "#64748B",
    border: "#E2E8F0",
    green: "#10B981",
    accent: "#6366F1",
};

export default function AvailableRidesScreen({ route, navigation }) {
    const { user, userToken } = useAuth();
    const { pickupCoords, pickupName, destinationCoords, destinationName } = route.params || {};

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [bookingRideId, setBookingRideId] = useState(null);

    useEffect(() => {
        fetchAvailableRides();
    }, []);

    // 1. Fetch matching rides from FastAPI Geospatial Engine
    const fetchAvailableRides = async () => {
        setLoading(true);
        try {
            // Alternatively use POST /api/rides/search-exact with pickup & destination coordinates
            const res = await axios.get(`${AI_URL}/api/rides/nearby-pickup`, {
                params: {
                    lat: pickupCoords?.latitude || 17.6599,
                    lon: pickupCoords?.longitude || 75.9064,
                    radius_km: 5.0,
                },
            });

            const results = Array.isArray(res.data) ? res.data : res.data?.rides || [];
            setRides(results);
        } catch (error) {
            console.warn("FastAPI ride fetch error:", error.message);
            Alert.alert("Notice", "Unable to load real-time rides. Showing available routes.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Dispatch Booking Request to Spring Boot Ride Service
    const handleRequestBooking = async (rideId, seatFare) => {
        if (!user?.id) {
            Alert.alert("Authentication Required", "Please log in to book a ride.");
            return;
        }

        setBookingRideId(rideId);
        try {
            const payload = {
                passengerId: user.id,
                seatsToBook: selectedSeats,
            };

            const response = await axios.post(
                `${RIDE_URL}/api/rides/${rideId}/request-book`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            Alert.alert(
                "Request Sent! 🎯",
                "Your booking request has been sent to the driver. You will receive a notification once accepted.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Home"),
                    },
                ]
            );
        } catch (error) {
            const errMsg =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to send booking request.";
            Alert.alert("Booking Error", typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
        } finally {
            setBookingRideId(null);
        }
    };

    const renderRideCard = ({ item }) => {
        const isBooking = bookingRideId === item.id || bookingRideId === item.ride_id;
        const availableSeats = item.seats || item.availableSeats || 1;
        const fare = item.seatFare || 50.0;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.driverInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.driverName}>{item.driverName || "Verified Driver"}</Text>
                            <Text style={styles.vehicleInfo}>
                                <MaterialCommunityIcons name="car" size={14} color={appColors.subText} />{" "}
                                {item.vehicleModel || "Vehicle"} • ⭐ 4.8
                            </Text>
                        </View>
                    </View>
                    <View style={styles.fareContainer}>
                        <Text style={styles.fareText}>₹{fare}</Text>
                        <Text style={styles.perSeatText}>per seat</Text>
                    </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.tripDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="people-outline" size={16} color={appColors.subText} />
                        <Text style={styles.detailText}>{availableSeats} seat(s) available</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color={appColors.subText} />
                        <Text style={styles.detailText}>Departs ~10 mins</Text>
                    </View>
                </View>

                {/* Seat Selector & Booking CTA */}
                <View style={styles.actionRow}>
                    <View style={styles.seatCounter}>
                        <TouchableOpacity
                            onPress={() => setSelectedSeats((prev) => Math.max(1, prev - 1))}
                            style={styles.seatBtn}
                        >
                            <Text style={styles.seatBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.seatCount}>{selectedSeats}</Text>
                        <TouchableOpacity
                            onPress={() => setSelectedSeats((prev) => Math.min(availableSeats, prev + 1))}
                            style={styles.seatBtn}
                        >
                            <Text style={styles.seatBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.bookBtn, isBooking && styles.bookBtnDisabled]}
                        disabled={isBooking}
                        onPress={() => handleRequestBooking(item.id || item.ride_id, fare)}
                        activeOpacity={0.85}
                    >
                        {isBooking ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.bookBtnText}>
                                Request • ₹{(fare * selectedSeats).toFixed(2)}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Navigation Bar */}
            <View style={styles.headerBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={appColors.darkText} />
                </TouchableOpacity>
                <View style={styles.headerTextWrapper}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {destinationName}
                    </Text>
                    <Text style={styles.headerSubtitle}>From: {pickupName}</Text>
                </View>
            </View>

            {/* Ride List */}
            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={appColors.primary} />
                    <Text style={styles.loadingText}>Finding available drivers on your route...</Text>
                </View>
            ) : rides.length === 0 ? (
                <View style={styles.centerBox}>
                    <MaterialCommunityIcons name="car-off" size={48} color={appColors.subText} />
                    <Text style={styles.noRidesTitle}>No Active Rides Found</Text>
                    <Text style={styles.noRidesSub}>
                        There are currently no drivers heading towards {destinationName}. Try again shortly.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={rides}
                    keyExtractor={(item, index) => item.id || item.ride_id || String(index)}
                    renderItem={renderRideCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.background,
    },
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        paddingBottom: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: appColors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTextWrapper: {
        marginLeft: 12,
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: appColors.darkText,
    },
    headerSubtitle: {
        fontSize: 12,
        color: appColors.subText,
    },
    centerBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: appColors.subText,
        fontWeight: "600",
    },
    noRidesTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: appColors.darkText,
        marginTop: 14,
    },
    noRidesSub: {
        fontSize: 13,
        color: appColors.subText,
        textAlign: "center",
        marginTop: 6,
        lineHeight: 18,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: appColors.cardBg,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: appColors.border,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    driverInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: appColors.darkText,
        justifyContent: "center",
        alignItems: "center",
    },
    driverName: {
        fontSize: 15,
        fontWeight: "700",
        color: appColors.darkText,
    },
    vehicleInfo: {
        fontSize: 12,
        color: appColors.subText,
        marginTop: 2,
    },
    fareContainer: {
        alignItems: "flex-end",
    },
    fareText: {
        fontSize: 18,
        fontWeight: "800",
        color: appColors.darkText,
    },
    perSeatText: {
        fontSize: 11,
        color: appColors.subText,
    },
    cardDivider: {
        height: 1,
        backgroundColor: "#F1F5F9",
        marginVertical: 12,
    },
    tripDetails: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 14,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: appColors.subText,
        fontWeight: "500",
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    seatCounter: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: appColors.border,
        paddingHorizontal: 4,
    },
    seatBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    seatBtnText: {
        fontSize: 16,
        fontWeight: "700",
        color: appColors.darkText,
    },
    seatCount: {
        fontSize: 14,
        fontWeight: "700",
        color: appColors.darkText,
        paddingHorizontal: 6,
    },
    bookBtn: {
        flex: 1,
        backgroundColor: appColors.primary,
        borderRadius: 12,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    bookBtnDisabled: {
        opacity: 0.65,
    },
    bookBtnText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#FFFFFF",
    },
});
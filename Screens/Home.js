import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    StatusBar,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { AUTH_URL } from "../constants/api";

const { width, height } = Dimensions.get("window");

const DEFAULT_REGION = {
    latitude: 17.6599,
    longitude: 75.9064,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
};

const MOCK_BIKES = [
    { id: "b1", latitude: 17.6625, longitude: 75.9040, heading: 45 },
    { id: "b2", latitude: 17.6580, longitude: 75.9100, heading: 120 },
    { id: "b3", latitude: 17.6550, longitude: 75.9020, heading: 210 },
    { id: "b4", latitude: 17.6630, longitude: 75.9120, heading: 300 },
];

export default function HomeScreen({ navigation }) {
    const { userToken, userData } = useAuth();
    const mapRef = useRef(null);

    const [userName, setUserName] = useState(userData?.name || "Rider");
    const [currentRegion, setCurrentRegion] = useState(DEFAULT_REGION);
    const [loadingLoc, setLoadingLoc] = useState(true);
    const [searchLocation, setSearchLocation] = useState("");

    useEffect(() => {
        fetchUserDetails();
        getUserLocation();
    }, []);

    const fetchUserDetails = async () => {
        if (!userData?.id || !userToken) return;
        try {
            const res = await axios.get(`${AUTH_URL}/api/auth/users/${userData.id}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (res.data?.name) {
                setUserName(res.data.name);
            }
        } catch (err) {
            console.log("Cached user profile in use:", err.message);
        }
    };

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setLoadingLoc(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const userCoords = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
            };

            setCurrentRegion(userCoords);
            if (mapRef.current) {
                mapRef.current.animateToRegion(userCoords, 600);
            }
        } catch (error) {
            console.warn("GPS lookup fallback to default:", error.message);
        } finally {
            setLoadingLoc(false);
        }
    };

    const handleRecenter = () => {
        if (mapRef.current && currentRegion) {
            mapRef.current.animateToRegion(currentRegion, 600);
        }
    };

    const handleQuickPlaceSelect = (placeName) => {
        setSearchLocation(placeName);
        navigation.navigate("Route", { destination: placeName });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* FULL-CANVAS MAP LAYER */}
            <View style={styles.mapContainer}>
                {loadingLoc ? (
                    <View style={styles.mapLoader}>
                        <ActivityIndicator size="large" color="#0F172A" />
                        <Text style={styles.loaderText}>Locating nearest rides...</Text>
                    </View>
                ) : (
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_DEFAULT}
                        style={StyleSheet.absoluteFillObject}
                        region={currentRegion}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        showsTraffic={false}
                    >
                        {MOCK_BIKES.map((bike) => (
                            <Marker
                                key={bike.id}
                                coordinate={{
                                    latitude: bike.latitude,
                                    longitude: bike.longitude,
                                }}
                                anchor={{ x: 0.5, y: 0.5 }}
                                flat={true}
                            >
                                <View style={[styles.bikeMarker, { transform: [{ rotate: `${bike.heading}deg` }] }]}>
                                    <MaterialCommunityIcons name="motorbike" size={20} color="#0284C7" />
                                </View>
                            </Marker>
                        ))}
                    </MapView>
                )}

                {/* FLOATING TOP-LEFT HEADER */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <Ionicons name="menu" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <View style={styles.userBadge}>
                        <Text style={styles.userGreeting}>Hey, {userName.split(" ")[0]}</Text>
                    </View>
                </View>

                {/* FLOATING RECENTER BUTTON */}
                <View style={styles.floatingControls}>
                    <TouchableOpacity style={styles.floatingBtn} activeOpacity={0.8} onPress={handleRecenter}>
                        <Ionicons name="locate" size={22} color="#0F172A" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* BOTTOM RAPIDO SEARCH SHEET */}
            <View style={styles.bottomSheet}>
                <Text style={styles.sheetHeading}>Where to?</Text>

                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Route", { destination: searchLocation })}
                >
                    <Ionicons name="search" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search destination"
                        placeholderTextColor="#94A3B8"
                        value={searchLocation}
                        onChangeText={setSearchLocation}
                        onSubmitEditing={() => navigation.navigate("Route", { destination: searchLocation })}
                    />
                </TouchableOpacity>

                {/* SHORTCUTS ROW */}
                <View style={styles.shortcutsRow}>
                    <TouchableOpacity style={styles.shortcutItem} onPress={() => handleQuickPlaceSelect("Recent")}>
                        <View style={styles.shortcutIconBox}>
                            <Ionicons name="time-outline" size={22} color="#64748B" />
                        </View>
                        <Text style={styles.shortcutLabel}>Recent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shortcutItem} onPress={() => handleQuickPlaceSelect("Home")}>
                        <View style={styles.shortcutIconBox}>
                            <Ionicons name="home-outline" size={22} color="#64748B" />
                        </View>
                        <Text style={styles.shortcutLabel}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shortcutItem} onPress={() => handleQuickPlaceSelect("Office")}>
                        <View style={styles.shortcutIconBox}>
                            <Ionicons name="business-outline" size={22} color="#64748B" />
                        </View>
                        <Text style={styles.shortcutLabel}>Office</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shortcutItem} onPress={() => handleQuickPlaceSelect("Saved")}>
                        <View style={styles.shortcutIconBox}>
                            <Ionicons name="heart-outline" size={22} color="#64748B" />
                        </View>
                        <Text style={styles.shortcutLabel}>Saved</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shortcutItem} onPress={() => handleQuickPlaceSelect("Hostel")}>
                        <View style={styles.shortcutIconBox}>
                            <Ionicons name="grid-outline" size={22} color="#64748B" />
                        </View>
                        <Text style={styles.shortcutLabel}>Hostel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        position: "relative",
    },
    mapLoader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
    loaderText: {
        marginTop: 10,
        fontSize: 13,
        color: "#64748B",
        fontWeight: "600",
    },
    bikeMarker: {
        backgroundColor: "#FFFFFF",
        padding: 6,
        borderRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    topBar: {
        position: "absolute",
        top: Platform.OS === "ios" ? 54 : 44,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuButton: {
        width: 48,
        height: 48,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    userBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    userGreeting: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0F172A",
    },
    floatingControls: {
        position: "absolute",
        right: 18,
        bottom: 24,
    },
    floatingBtn: {
        width: 46,
        height: 46,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },
    bottomSheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: Platform.OS === "ios" ? 95 : 85,
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    sheetHeading: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A",
    },
    shortcutsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    shortcutItem: {
        alignItems: "center",
        width: (width - 40) / 5.2,
    },
    shortcutIconBox: {
        width: 48,
        height: 48,
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    shortcutLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
});
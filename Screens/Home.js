import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthContext";

const { width, height } = Dimensions.get("window");

const appColors = {
    primary: "#F59E0B",
    accent: "#91E612",       // Neo-Lime CTA accent
    background: "#0F172A",
    cardBg: "#FFFFFF",
    darkText: "#0F172A",
    subText: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F1F5F9",
};

const DEFAULT_REGION = {
    latitude: 17.6599,
    longitude: 75.9064,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
};

const POPULAR_PLACES = [
    { id: "1", title: "Saat Rasta", subtitle: "Solapur Central", lat: 17.668, lon: 75.908 },
    { id: "2", title: "Kanna Chowk", subtitle: "Market Area", lat: 17.672, lon: 75.914 },
    { id: "3", title: "Old Pune Naka", subtitle: "Highway Junction", lat: 17.684, lon: 75.892 },
    { id: "4", title: "Railway Station", subtitle: "Solapur Jn", lat: 17.659, lon: 75.906 },
];

export default function Home({ navigation }) {
    const { user, userData } = useAuth();
    const insets = useSafeAreaInsets();
    const mapRef = useRef(null);

    let tabBarHeight = 65;
    try {
        tabBarHeight = useBottomTabBarHeight();
    } catch (e) {
        tabBarHeight = Platform.OS === "ios" ? 80 : 65;
    }

    const [location, setLocation] = useState(DEFAULT_REGION);
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") return;

                const current = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const coords = {
                    latitude: current.coords.latitude,
                    longitude: current.coords.longitude,
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.012,
                };

                if (isMounted) {
                    setLocation(coords);
                    mapRef.current?.animateToRegion(coords, 500);
                }
            } catch (error) {
                console.warn("Location acquire fallback:", error);
            }
        };

        getLocation();
        return () => { isMounted = false; };
    }, []);

    const handleDestinationChange = (text) => {
        setDestination(text);
        if (text.trim().length > 0) {
            const filtered = POPULAR_PLACES.filter((place) =>
                place.title.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectPlace = (place) => {
        Keyboard.dismiss();
        setSuggestions([]);
        navigation.navigate("RouteScreen", {
            pickupLocation: "Current Location",
            pickupCoords: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            destinationName: place.title,
            destinationCoords: {
                latitude: place.lat,
                longitude: place.lon,
            },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* 1. NATIVE MAP VIEWPORT */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={DEFAULT_REGION}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={false}
                showsTraffic={true}
            >
                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    title="You are here"
                />
            </MapView>

            {/* 2. FLOATING TOP HEADER */}
            <View style={[styles.topBarWrapper, { top: insets.top + (Platform.OS === "ios" ? 10 : 20) }]}>
                {/* Profile Pill & Menu */}
                <View style={styles.leftGroup}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate("Profile")}
                    >
                        <Ionicons name="menu" size={22} color={appColors.darkText} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.profilePill}
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate("Profile")}
                    >
                        <Image
                            source={{
                                uri:
                                    user?.profilePicUrl ||
                                    userData?.profilePicUrl ||
                                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format&fit=crop&q=80",
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.usernameText} numberOfLines={1}>
                            {userData?.name || user?.name || "Rider"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Offer Ride Button */}
                <TouchableOpacity
                    style={styles.offerRideBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Publish", {
                        currentCoords: location,
                    })}
                >
                    <Ionicons name="add-circle" size={18} color="#0F172A" />
                    <Text style={styles.offerRideBtnText}>Offer</Text>
                </TouchableOpacity>
            </View>

            {/* 3. FLOATING DESTINATION SEARCH CARD DOCKED OVER BOTTOM TAB */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={[
                    styles.floatingBottomContainer,
                    { bottom: tabBarHeight + 14 }
                ]}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.cardContainer}>
                        {/* Auto-suggest dropdown */}
                        {suggestions.length > 0 && (
                            <View style={styles.suggestionBox}>
                                <FlatList
                                    data={suggestions}
                                    keyExtractor={(item) => item.id}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.suggestionItem}
                                            onPress={() => handleSelectPlace(item)}
                                        >
                                            <Ionicons name="location-outline" size={18} color={appColors.subText} />
                                            <View style={styles.suggestionTextWrapper}>
                                                <Text style={styles.placeTitle}>{item.title}</Text>
                                                <Text style={styles.placeSubtitle}>{item.subtitle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}

                        {/* Search Input Box */}
                        <View style={styles.searchBarContainer}>
                            <Ionicons name="search" size={20} color={appColors.subText} style={styles.searchIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Where to? (Destination)"
                                placeholderTextColor={appColors.subText}
                                value={destination}
                                onChangeText={handleDestinationChange}
                                returnKeyType="search"
                                onSubmitEditing={() => {
                                    if (destination.trim()) {
                                        handleSelectPlace({
                                            title: destination,
                                            lat: location.latitude + 0.01,
                                            lon: location.longitude + 0.01,
                                        });
                                    }
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    map: {
        width: width,
        height: height,
        ...StyleSheet.absoluteFillObject,
    },
    topBarWrapper: {
        position: "absolute",
        left: 16,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 999,
        elevation: 25,
    },
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexShrink: 1,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
    },
    profilePill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 14,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        maxWidth: 130,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 9,
        marginRight: 6,
    },
    usernameText: {
        fontSize: 13,
        fontWeight: "700",
        color: appColors.darkText,
    },
    offerRideBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.accent,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        gap: 6,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    offerRideBtnText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#0F172A",
    },
    floatingBottomContainer: {
        position: "absolute",
        left: 16,
        right: 16,
        zIndex: 100,
        elevation: 20,
    },
    cardContainer: {
        width: "100%",
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.cardBg,
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 54,
        borderWidth: 1,
        borderColor: appColors.border,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: appColors.darkText,
    },
    suggestionBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: appColors.border,
        maxHeight: 180,
        marginBottom: 8,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    suggestionTextWrapper: {
        marginLeft: 10,
    },
    placeTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: appColors.darkText,
    },
    placeSubtitle: {
        fontSize: 12,
        color: appColors.subText,
    },
});
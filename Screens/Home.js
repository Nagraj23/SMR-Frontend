import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../Context/AuthContext";

const { height: screenHeight } = Dimensions.get("window");

const appColors = {
    primary: "#F59E0B",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    darkText: "#0F172A",
    subText: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F1F5F9",
};

// Common/Popular Destination Suggestions
const POPULAR_PLACES = [
    { id: "1", title: "Saat Rasta", subtitle: "Solapur Central", lat: 17.668, lon: 75.908 },
    { id: "2", title: "Kanna Chowk", subtitle: "Market Area", lat: 17.672, lon: 75.914 },
    { id: "3", title: "Old Pune Naka", subtitle: "Highway Junction", lat: 17.684, lon: 75.892 },
    { id: "4", title: "Railway Station", subtitle: "Solapur Jn", lat: 17.659, lon: 75.906 },
];

export default function Home({ navigation }) {
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setLoading(false);
                    return;
                }

                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                setLocation({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                });
            } catch (error) {
                console.error("Error fetching location:", error);
            } finally {
                setLoading(false);
            }
        };

        getLocation();
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
        navigation.navigate("RouteScreen", {
            pickupLocation: "Current Location",
            pickupCoords: {
                latitude: location?.latitude || 17.6599,
                longitude: location?.longitude || 75.9064,
            },
            destinationName: place.title,
            destinationCoords: {
                latitude: place.lat,
                longitude: place.lon,
            },
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.innerContainer}>
                    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                    {/* DYNAMIC MAP SECTION (Auto-adjusts height when keyboard appears) */}
                    <View style={styles.mapSection}>
                        {loading ? (
                            <View style={styles.centerBox}>
                                <ActivityIndicator size="large" color={appColors.primary} />
                            </View>
                        ) : location ? (
                            <MapView
                                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                                style={styles.absoluteMap}
                                initialRegion={location}
                                region={location}
                                showsUserLocation={true}
                                showsMyLocationButton={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                    }}
                                    title="You are here"
                                />
                            </MapView>
                        ) : (
                            <View style={styles.centerBox}>
                                <Feather name="alert-triangle" size={28} color={appColors.subText} />
                                <Text style={styles.errorText}>GPS permissions required</Text>
                            </View>
                        )}

                        {/* FLOATING TOP BAR */}
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.menuButton}
                                activeOpacity={0.8}
                                onPress={() => navigation?.navigate("Profile")}
                            >
                                <Ionicons name="menu" size={22} color={appColors.darkText} />
                            </TouchableOpacity>

                            <View style={styles.userProfilePill}>
                                <Image
                                    source={{
                                        uri:
                                            user?.profilePicUrl ||
                                            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format&fit=crop&q=80",
                                    }}
                                    style={styles.avatar}
                                />
                                <Text style={styles.usernameText} numberOfLines={1}>
                                    {user?.name || "Rider"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* DESTINATION SEARCH & POPUP SUGGESTIONS */}
                    <View style={styles.bottomSection}>
                        {/* Auto-suggest dropdown rendered directly above input */}
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
                                            lat: (location?.latitude || 17.6599) + 0.01,
                                            lon: (location?.longitude || 75.9064) + 0.01,
                                        });
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.background,
    },
    innerContainer: {
        flex: 1,
    },
    mapSection: {
        flex: 1,
        width: "100%",
        position: "relative",
        backgroundColor: "#E2E8F0",
    },
    absoluteMap: {
        width: "100%",
        height: "100%",
    },
    centerBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 13,
        color: appColors.subText,
        marginTop: 6,
    },
    topBar: {
        position: "absolute",
        top: Platform.OS === "ios" ? 52 : 42,
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    userProfilePill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        maxWidth: "75%",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 10,
        marginRight: 8,
    },
    usernameText: {
        fontSize: 14,
        fontWeight: "700",
        color: appColors.darkText,
    },
    bottomSection: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: Platform.OS === "ios" ? 28 : 16,
        backgroundColor: appColors.cardBg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appColors.inputBg,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: appColors.border,
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
        position: "absolute",
        bottom: 70,
        left: 16,
        right: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: appColors.border,
        maxHeight: 180,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        zIndex: 999,
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
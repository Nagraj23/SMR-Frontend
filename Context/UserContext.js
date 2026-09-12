import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AUTH_URL, AI_URL } from "../constants/api";
import { useAuth } from "./AuthContext";

export const UserContext = createContext({});
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { userToken, userData } = useAuth();

    const [userEmbedding, setUserEmbedding] = useState(null);
    const [nearbyRides, setNearbyRides] = useState([]);
    const [isFetchingEmbedding, setIsFetchingEmbedding] = useState(false);
    const [isSearchingRides, setIsSearchingRides] = useState(false);

    useEffect(() => {
        if (userData?.id && userToken) {
            loadOrFetchUserEmbedding(userData.id, userToken);
        } else {
            clearUserData();
        }
    }, [userData?.id, userToken]);

    const loadOrFetchUserEmbedding = async (userId, token) => {
        try {
            setIsFetchingEmbedding(true);
            const cachedEmbedding = await AsyncStorage.getItem("userEmbedding");

            if (cachedEmbedding) {
                setUserEmbedding(JSON.parse(cachedEmbedding));
                return;
            }

            const response = await axios.get(
                `${AUTH_URL}/api/auth/users/${userId}/embedding`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                await AsyncStorage.setItem("userEmbedding", JSON.stringify(response.data));
                setUserEmbedding(response.data);
            }
        } catch (error) {
            console.warn("UserContext: Embedding fetch failed:", error?.message);
        } finally {
            setIsFetchingEmbedding(false);
        }
    };

    const updateEmbeddingCache = async (newEmbeddingArray) => {
        try {
            if (Array.isArray(newEmbeddingArray)) {
                await AsyncStorage.setItem("userEmbedding", JSON.stringify(newEmbeddingArray));
                setUserEmbedding(newEmbeddingArray);
            }
        } catch (error) {
            console.error("UserContext: Failed to update local embedding cache:", error);
        }
    };

    const fetchNearbyRides = async (latitude, longitude, radiusKm = 1.0) => {
        if (!latitude || !longitude) return [];

        try {
            setIsSearchingRides(true);
            const payload = {
                lat: latitude,
                lon: longitude,
                radius_km: radiusKm,
            };

            const response = await axios.post(`${AI_URL}/api/rides/nearby-pickup`, payload);
            const rides = Array.isArray(response.data)
                ? response.data
                : response.data?.results || response.data?.rides || [];

            setNearbyRides(rides);
            return rides;
        } catch (error) {
            console.warn("UserContext: Nearby rides scan failed:", error?.message);
            setNearbyRides([]);
            return [];
        } finally {
            setIsSearchingRides(false);
        }
    };

    const clearUserData = async () => {
        try {
            await AsyncStorage.removeItem("userEmbedding");
            setUserEmbedding(null);
            setNearbyRides([]);
        } catch (error) {
            console.error("UserContext: Clear cache error:", error);
        }
    };

    return (
        <UserContext.Provider
            value={{
                userEmbedding,
                nearbyRides,
                isFetchingEmbedding,
                isSearchingRides,
                fetchNearbyRides,
                updateEmbeddingCache,
                loadOrFetchUserEmbedding,
                clearUserData,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
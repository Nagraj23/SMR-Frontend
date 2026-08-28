import React, {
    createContext,
    useState,
    useEffect,
    useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [recentRides, setRecentRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --------------------------------------------------
    // LOAD STORED LOGIN SESSION
    // --------------------------------------------------
    useEffect(() => {
        const initializeAuth = async () => {
            console.log("🔥 AUTH: checking stored session");

            try {
                const token = await AsyncStorage.getItem("userToken");
                const userStr = await AsyncStorage.getItem("userData");
                const profileStatus =
                    await AsyncStorage.getItem("profileStatus");

                console.log("🔥 AUTH: stored token exists:", !!token);

                if (token) {
                    setUserToken(token);

                    axios.defaults.headers.common["Authorization"] =
                        `Bearer ${token}`;

                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            setUserData(user);
                        } catch (parseError) {
                            console.log(
                                "❌ AUTH: failed to parse userData",
                                parseError
                            );
                        }
                    }

                    if (profileStatus === "VERIFIED") {
                        setIsProfileComplete(true);
                    }
                }
            } catch (error) {
                console.error(
                    "❌ AUTH: failed to load stored session:",
                    error
                );

                // Clear broken session manually
                try {
                    await AsyncStorage.removeItem("userToken");
                    await AsyncStorage.removeItem("userId");
                    await AsyncStorage.removeItem("userData");
                    await AsyncStorage.removeItem("profileStatus");
                } catch (storageError) {
                    console.error(
                        "❌ AUTH: failed to clear session:",
                        storageError
                    );
                }

                delete axios.defaults.headers.common["Authorization"];

                setUserToken(null);
                setUserData(null);
                setIsProfileComplete(false);
            } finally {
                console.log("✅ AUTH: initialization complete");
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // --------------------------------------------------
    // SIGN IN
    // --------------------------------------------------
    const signIn = async (
        token,
        id,
        name = "",
        mail = ""
    ) => {
        console.log("🔥 SIGNIN: START");

        try {
            const user = {
                id,
                name,
                mail,
            };

            console.log("🔥 SIGNIN: user created", user);

            // Update React state
            setUserToken(token);
            setUserData(user);
            setIsProfileComplete(false);

            console.log("🔥 SIGNIN: React state updated");

            // Set Axios Authorization header
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${token}`;

            console.log("🔥 SIGNIN: Authorization header set");

            // Save token
            console.log("🔥 SIGNIN: saving userToken");

            await AsyncStorage.setItem(
                "userToken",
                token
            );

            console.log("✅ SIGNIN: userToken saved");

            // Save user ID
            console.log("🔥 SIGNIN: saving userId");

            await AsyncStorage.setItem(
                "userId",
                String(id)
            );

            console.log("✅ SIGNIN: userId saved");

            // Save user data
            console.log("🔥 SIGNIN: saving userData");

            await AsyncStorage.setItem(
                "userData",
                JSON.stringify(user)
            );

            console.log("✅ SIGNIN: userData saved");

            console.log("✅ SIGNIN: COMPLETE");

            return true;
        } catch (error) {
            console.error("❌ SIGNIN ERROR:", error);
            console.error("❌ SIGNIN ERROR MESSAGE:", error?.message);
            console.error("❌ SIGNIN ERROR STACK:", error?.stack);

            throw error;
        }
    };

    // --------------------------------------------------
    // PROFILE COMPLETE
    // --------------------------------------------------
    const markProfileComplete = async () => {
        try {
            console.log("🔥 AUTH: marking profile complete");

            setIsProfileComplete(true);

            await AsyncStorage.setItem(
                "profileStatus",
                "VERIFIED"
            );

            console.log("✅ AUTH: profile marked complete");
        } catch (error) {
            console.error(
                "❌ AUTH: profile status save failed:",
                error
            );

            throw error;
        }
    };

    // --------------------------------------------------
    // RECENT RIDES
    // --------------------------------------------------
    const updateRecentRides = (rides) => {
        const topFive = Array.isArray(rides)
            ? rides.slice(0, 5)
            : [];

        setRecentRides(topFive);
    };

    // --------------------------------------------------
    // SIGN OUT
    // --------------------------------------------------
    const signOut = async () => {
        console.log("🔥 AUTH: SIGN OUT");

        try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("profileStatus");

            delete axios.defaults.headers.common["Authorization"];

            setUserToken(null);
            setUserData(null);
            setIsProfileComplete(false);
            setRecentRides([]);

            console.log("✅ AUTH: SIGN OUT COMPLETE");

            return true;
        } catch (error) {
            console.error(
                "❌ AUTH: SIGN OUT ERROR:",
                error
            );

            return false;
        }
    };

    // --------------------------------------------------
    // CONTEXT
    // --------------------------------------------------
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!userToken,
                userToken,
                userData,
                isProfileComplete,
                recentRides,
                isLoading,

                signIn,
                signOut,
                markProfileComplete,
                updateRecentRides,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
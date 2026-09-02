import { useState, useCallback } from "react";
import { navigate } from "../utils/NavigationService";

export const useRideNotificationHandler = () => {
    const [activeNotification, setActiveNotification] = useState(null);

    const handleNotification = useCallback((notification) => {
        setActiveNotification(notification);
    }, []);

    const clearNotification = useCallback(() => {
        setActiveNotification(null);
    }, []);

    const handlePressNotification = useCallback(() => {
        if (!activeNotification) return;

        const { type, payload } = activeNotification;
        setActiveNotification(null);

        switch (type) {
            case "BOOKING_REQUEST":
                navigate("ManifestDetails", {
                    bookingId: payload?.bookingId,
                    rideId: payload?.rideId,
                });
                break;

            case "BOOKING_ACCEPTED":
            case "RIDE_STARTED":
                navigate("RouteScreen", {
                    rideId: payload?.rideId,
                    bookingId: payload?.bookingId,
                });
                break;

            case "RIDE_COMPLETED":
                navigate("MainTabs", { screen: "Profile" });
                break;

            default:
                break;
        }
    }, [activeNotification]);

    return {
        activeNotification,
        handleNotification,
        clearNotification,
        handlePressNotification,
    };
};
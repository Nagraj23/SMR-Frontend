import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { NOTIFY_WS_URL } from "../constants/api"; // ws://10.190.147.233:8080/ws
import "text-encoding";

export const useNotificationSocket = (userToken, onNotificationReceived) => {
    const clientRef = useRef(null);

    useEffect(() => {
        if (!userToken) {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        const client = new Client({
            brokerURL: NOTIFY_WS_URL,
            // Mandatory for React Native Hermes WebSocket bridge
            webSocketFactory: () => new WebSocket(NOTIFY_WS_URL),
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            connectHeaders: {
                Authorization: `Bearer ${userToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("✅ WebSocket Connected to Notification Service");

                client.subscribe("/user/queue/notifications", (message) => {
                    if (message.body) {
                        try {
                            const notification = JSON.parse(message.body);
                            console.log("🔔 Inbound Notification Event:", notification);
                            if (onNotificationReceived) {
                                onNotificationReceived(notification);
                            }
                        } catch (err) {
                            console.error("Failed to parse incoming notification payload:", err);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP Error:", frame.headers["message"]);
            },
            onWebSocketClose: (event) => {
                console.log("⚠️ Notification WebSocket closed:", event?.code, event?.reason);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [userToken]);

    return clientRef.current;
};
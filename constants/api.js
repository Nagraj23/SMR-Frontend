// Local LAN Host IPv4 Address
const HOST_IP = "10.190.147.233";

// Authentication & Identity Service (Port 8081 / 8080)
export const AUTH_URL = `http://${HOST_IP}:8080/api`;

// Ride Lifecycle & Booking Orchestrator (Port 8082)
export const RIDE_URL = `http://${HOST_IP}:8082/api/rides`;

// Python Spatial & Geo-Matching Search Engine (Port 8000)
export const SEARCH_URL = `http://${HOST_IP}:8000/api/rides`;

// AI Facial Embedding & Biometric Verification (Port 8000)
export const AI_URL = `http://${HOST_IP}:8000`;

// Real-Time Notification STOMP WebSocket Gateway (Port 8080)
export const NOTIFY_WS_URL = `ws://${HOST_IP}:8080/ws`;

// Notification Device Token & Inbox REST API (Port 8080)
export const NOTIFY_API_URL = `http://${HOST_IP}:8080/api/notify`;
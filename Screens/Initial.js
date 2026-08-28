import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AUTH_URL } from '../constants/api';
import { useAuth } from '../Context/AuthContext';

export default function Initial() {
  const navigation = useNavigation();
  const { user, isAuthenticated, isLoading } = useAuth(); // Consume data directly from context

  useEffect(() => {
    // Wait until AuthContext finishes checking AsyncStorage and fetching the user profile
    if (isLoading) return;

    const routeCheck = async () => {
      if (!isAuthenticated || !user) {
        return navigation.replace('Login');
      }

      // 🚦 Role-Based Connection Checker Gate
      if (user.role === 'CHILD') {
        try {
          // Check if this child has any established or requested guardians
          const res = await axios.get(`${AUTH_URL}/connection/parents/${user.id}`);
          const parentConnections = res.data;

          if (parentConnections && parentConnections.length > 0) {
            navigation.replace('MainTabs'); // Parent exists, allow entry
          } else {
            navigation.replace('ConnectScreen'); // Isolated child, redirect to setup link
          }
        } catch (err) {
          console.error('Failed to verify connection records:', err);
          navigation.replace('ConnectScreen'); // Fallback to connection screen safely
        }
      } else {
        // Parents go straight to their dashboard setup
        navigation.replace('MainTabs');
      }
    };

    routeCheck();
  }, [isLoading, isAuthenticated, user]);

  return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }
});
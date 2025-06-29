import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser); // Directly use parsedUser as it's already the user object
        } else {
          setError('No user data found. Please log in again.');
        }
      } catch (err) {
        setError('Failed to load user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image Placeholder */}
      <View style={styles.profileImagePlaceholder}>
        <Icon name="user-circle" size={120} color="#1a237e" />
      </View>

      {/* User Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="user" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>
            {user.first_name} {user.family_name}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="phone" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user.us_phone || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="envelope" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user.email || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="id-card" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>Account code: {user.account_id}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="calendar" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>Member since: {user.reg_date}</Text>
        </View>
        
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  icon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default ProfileScreen;
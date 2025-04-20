import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const ProfileScreen = ({ route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data from local API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Replace with your local API endpoint
        const response = await fetch('http://192.168.8.111:5000/read'); // Use your computer's IP address
        const data = await response.json();

        // Assuming the API returns an array of users, take the first user
        if (data.length > 0) {
          setUser(data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Image (if available) */}
      {user?.profileImage && (
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      )}

      {/* User Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="user" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user?.names}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user?.phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="envelope" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user?.email || 'N'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="map-marker" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user?.country}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="graduation-cap" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>{user?.department}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="star" size={20} color="#1a237e" style={styles.icon} />
          <Text style={styles.infoText}>Mark: {user?.mark}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make the image circular
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
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
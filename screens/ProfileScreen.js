import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const ProfileScreen = ({ route }) => {
  // Dummy user data (replace with real data from your app state or API)
  const user = {
    name: 'Jean Baptiste SHUMBUSHO',
    phone: '+250 788 644 687',
    email: 'shumbushojean1@gmail.com',
    location: 'Kigali, RWANDA',
    profileImage: require('../assets/userLogin.jpg'), // Replace with your image path
  };

  // Dummy historical data (replace with real data from your app state or API)
  const historicalData = [
    { id: 1, action: 'Logged in', timestamp: '2023-10-01 10:00 AM' },
    { id: 2, action: 'Updated profile', timestamp: '2023-10-02 11:30 AM' },
    { id: 3, action: 'Booked parking spot', timestamp: '2023-10-03 02:15 PM' },
    { id: 4, action: 'Logged out', timestamp: '2023-10-04 05:45 PM' },
    { id: 5, action: 'Changed password', timestamp: '2023-10-05 09:00 AM' },
    { id: 6, action: 'Viewed parking history', timestamp: '2023-10-06 12:30 PM' },
    { id: 7, action: 'Logged in', timestamp: '2023-10-07 08:00 AM' },
    { id: 8, action: 'Booked parking spot', timestamp: '2023-10-08 03:20 PM' },
    { id: 9, action: 'Logged out', timestamp: '2023-10-09 06:10 PM' },
    { id: 10, action: 'Updated profile', timestamp: '2023-10-10 10:45 AM' },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image source={user.profileImage} style={styles.profileImage} />

      {/* User Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="user" size={20} color="#007BFF" style={styles.icon} />
          <Text style={styles.infoText}>{user.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={20} color="#007BFF" style={styles.icon} />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="envelope" size={20} color="#007BFF" style={styles.icon} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="map-marker" size={20} color="#007BFF" style={styles.icon} />
          <Text style={styles.infoText}>{user.location}</Text>
        </View>
      </View>

      {/* Historical Data Section */}
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      <ScrollView style={styles.historyContainer}>
        {historicalData.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Icon name="clock-o" size={16} color="#666" style={styles.historyIcon} />
            <View style={styles.historyTextContainer}>
              <Text style={styles.historyAction}>{item.action}</Text>
              <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  historyContainer: {
    width: '100%',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  historyIcon: {
    marginRight: 10,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    color: '#333',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProfileScreen;
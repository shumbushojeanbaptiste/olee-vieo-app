// filepath: c:\Users\Dev Jean\React Native\myApp\HelloApp\screens\ParkingDetails.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ParkingDetails = ({ route, navigation }) => {
  const { spot } = route.params || {}; // Safely retrieve the spot object

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{spot?.title || 'No Title Available'}</Text>

      {/* Description */}
      <Text style={styles.description}>{spot?.description || 'No Description Available'}</Text>

      {/* Contact Info */}
      <View style={styles.infoContainer}>
        <Icon name="phone" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Phone: {spot?.phone || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="envelope" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Email: {spot?.email || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="check-circle" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Availability: {spot?.availability || 'N/A'}</Text>
      </View>

      {/* Prices */}
      <Text style={styles.subtitle}>Prices:</Text>
      <FlatList
        data={spot?.prices || []} // Fallback to an empty array if prices are undefined
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.priceContainer}>
            <Icon name="clock-o" size={20} color="#007BFF" />
            <Text style={styles.priceText}>
              {item.hours || 'N/A'}: {item.fee || 'N/A'}
            </Text>
          </View>
        )}
      />

      {/* Footer Image */}
      <Image
        source={require('../assets/parking-bg.jpg')} // Replace with your footer image path
        style={styles.footerImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  footerImage: {
    width: '100%',
    height: 150,
    marginTop: 20,
    opacity: 0.5, // Lower opacity for the footer image
    resizeMode: 'cover',
  },
});

export default ParkingDetails;
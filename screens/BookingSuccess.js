// BookingSuccess.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookingSuccess = ({ route }) => {
  const { bookings } = route.params;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="check-circle" size={30} color="#4CAF50" />
        <Text style={styles.title}>Booking Successful</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {bookings.message} ({bookings.count} records)
      </Text>
      
      <ScrollView style={styles.list}>
        {bookings.data.map((booking, index) => (
          <View key={index} style={styles.bookingCard}>
            <Text style={styles.bookingPlate}>Plate: {booking.card_code}</Text>
            <Text>Parking Spot: {booking.in_park}</Text>
            <Text>Entry Time: {new Date(booking.entre_time).toLocaleString()}</Text>
            <Text>Status: {booking.status === 4 ? 'Confirmed' : 'Pending'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666'
  },
  list: {
    flex: 1
  },
  bookingCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  bookingPlate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  }
});

export default BookingSuccess;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NearScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const parkingSpots = [
    {
      icon: 'map-marker',
      title: 'Downtown Parking',
      description: '0.3 miles away - 15 spots available',
      rate: '$2.50/hr',
      phone: '123-456-7890',
      email: 'downtown@parking.com',
      availability: '15 spots available',
      prices: [
        { hours: '1-2 hours', fee: '$5' },
        { hours: '2-4 hours', fee: '$8' },
        { hours: '4+ hours', fee: '$12' },
      ],
    },
    {
      icon: 'map-marker',
      title: 'YYUSSA Mall Parking',
      description: '0.7 miles away - 8 spots available',
      rate: '$3.00/hr',
      phone: '987-654-3210',
      email: 'mall@parking.com',
      availability: '8 spots available',
      prices: [
        { hours: '1-2 hours', fee: '$6' },
        { hours: '2-4 hours', fee: '$10' },
        { hours: '4+ hours', fee: '$15' },
      ],
    },
    {
      icon: 'map-marker',
      title: 'Street Parking',
      description: '0.2 miles away - 5 spots available',
      rate: '$1.75/hr',
      phone: '555-555-5555',
      email: 'street@parking.com',
      availability: '5 spots available',
      prices: [
        { hours: '1-2 hours', fee: '$3' },
        { hours: '2-4 hours', fee: '$5' },
        { hours: '4+ hours', fee: '$7' },
      ],
    },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
          Nearest Parking
        </Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Icon
            name={isDarkMode ? 'sun-o' : 'moon-o'}
            size={20}
            color={isDarkMode ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {parkingSpots.map((spot, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, isDarkMode && styles.darkCard]}
            onPress={() => navigation.navigate('ParkingDetails', { spot })} // Pass spot details
          >
            <View style={styles.cardHeader}>
              <Icon 
                name={spot.icon} 
                size={24} 
                color={isDarkMode ? '#4DA6FF' : '#007BFF'} 
              />
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>
                  {spot.title}
                </Text>
                <Text style={[styles.cardDescription, isDarkMode && styles.darkCardDescription]}>
                  {spot.description}
                </Text>
              </View>
              <Text style={[styles.rateText, isDarkMode && styles.darkRateText]}>
                {spot.rate}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#1f1f1f',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  darkHeaderTitle: {
    color: '#fff',
  },
  content: {
    padding: 15,
    paddingBottom: 70,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1f1f1f',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  darkCardTitle: {
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  darkCardDescription: {
    color: '#aaa',
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  darkRateText: {
    color: '#4DA6FF',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkBottomNav: {
    backgroundColor: '#1f1f1f',
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#007BFF',
  },
  darkNavLabel: {
    color: '#fff',
  },
});

export default NearScreen;
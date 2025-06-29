import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NearScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static coordinates
  const staticLocation = {
    latitude: -1.9465,
    longitude: 30.0585
  };

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      
      const response = await fetch('http://192.168.1.86:8000/parkings-with-prediction-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          in_hour: [hour],
          entry_day_of_week: [dayOfWeek],
          current_latitude: staticLocation.latitude,
          current_longitude: staticLocation.longitude
        })
      });

      const data = await response.json();
      setParkingSpots(data);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      // Fallback to your original static data if API fails
      setParkingSpots([
        {
          icon: 'map-marker',
          title: 'CHIC Parking',
          description: '0.3 miles away - 15 spots available',
          address: 'Kigali, Rwanda', // Added address to static data
          rate: '200 Frw/hr',
          phone: '123-456-7890',
          email: 'downtown@parking.com',
          availability: '15 spots available',
          prices: [
            { hours: '1-2 hours', fee: '$5' },
            { hours: '2-4 hours', fee: '$8' },
            { hours: '4+ hours', fee: '$12' },
          ],
        },
        // ... your other static parking spots with added address
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatSpot = (spot) => {
    return {
      icon: 'map-marker',
      title: spot.full_park_name,
      description: `${spot.predicted_availability_percent.toFixed(2)} % available | ${Math.round(spot.parking_lots * (spot.predicted_availability_percent / 100))} spots `,
      address: spot.address || 'Address not available', // Use API address or fallback
      rate: `${spot.distance}`,
      phone: spot.phone || '123-456-7890',
      email: 'info@parking.com',
      availability: `${Math.round(spot.parking_lots * (spot.predicted_availability_percent / 100))} spots available`,
      prices: [
        { hours: '1-2 hours', fee: '500 Frw' },
        { hours: '2-4 hours', fee: '800 Frw' },
        { hours: '4+ hours', fee: '1200 Frw' },
      ],
      rawData: spot
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#4DA6FF' : '#007BFF'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header - unchanged */}
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

      {/* Content - now includes address */}
      <ScrollView contentContainerStyle={styles.content}>
        {parkingSpots.map((spot, index) => {
          const formattedSpot = formatSpot(spot);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, isDarkMode && styles.darkCard]}
              onPress={() => navigation.navigate('ParkingDetails', { spot: formattedSpot })}
            >
              <View style={styles.cardHeader}>
                <Icon 
                  name={formattedSpot.icon} 
                  size={24} 
                  color={isDarkMode ? '#4DA6FF' : '#007BFF'} 
                />
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>
                    {formattedSpot.title}
                  </Text>
                  <Text style={[styles.cardDescription, isDarkMode && styles.darkCardDescription]}>
                    {formattedSpot.description}
                  </Text>
                  {/* Added address line */}
                  <Text style={[styles.addressText, isDarkMode && styles.darkAddressText]}>
                    {formattedSpot.address}
                  </Text>
                </View>
                <Text style={[styles.rateText, isDarkMode && styles.darkRateText]}>
                  {formattedSpot.rate}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Added addressText style to your existing styles
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
    marginBottom: 4, // Added space for address
  },
  darkCardDescription: {
    color: '#aaa',
  },
  // New style for address text
  addressText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  darkAddressText: {
    color: '#999',
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  darkRateText: {
    color: '#4DA6FF',
  },
});

export default NearScreen;
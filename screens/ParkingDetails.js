import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ParkingDetails = ({ route, navigation }) => {
  const { spot } = route.params || {};
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  // Days array
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (spot?.rawData?.parking_id) {
      fetchPrices(spot.rawData.parking_id);
    }
  }, [spot]);

  const fetchPrices = async (parkingId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.86:8000/park_prices/by_plan/${parkingId}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setPrices(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      setCheckingAvailability(true);
      const response = await fetch('http://192.168.1.86:8000/predict/park-available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          in_hour: [selectedHour],
          entry_day_of_week: [selectedDay],
          park_id: [spot.rawData.parking_id],
          max_slot: [spot.rawData.parking_lots],
          event_on: [0]
        })
      });

      if (!response.ok) throw new Error('Failed to check availability');

      const data = await response.json();
      setAvailability(data.predicted_availability_percent);
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", "Could not check availability");
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Render hour buttons
  const renderHourButtons = () => {
    const hourRows = [];
    const hoursPerRow = 6;
    
    for (let i = 0; i < 24; i += hoursPerRow) {
      const rowHours = [];
      for (let j = 0; j < hoursPerRow && (i + j) < 24; j++) {
        const hour = i + j;
        rowHours.push(
          <TouchableOpacity
            key={hour}
            style={[
              styles.hourButton,
              selectedHour === hour && styles.selectedHourButton
            ]}
            onPress={() => setSelectedHour(hour)}
          >
            <Text style={[
              styles.hourButtonText,
              selectedHour === hour && styles.selectedHourButtonText
            ]}>
              {hour}:00
            </Text>
          </TouchableOpacity>
        );
      }
      hourRows.push(
        <View key={i} style={styles.hourRow}>
          {rowHours}
        </View>
      );
    }
    
    return hourRows;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{spot?.title || 'Parking Details'}</Text>
        <View style={{ width: 24 }} /><View style={{ width: 24 }} />
      </View>

      {/* Parking Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={18} color="#1a237e" />
          <Text style={styles.infoText}>{spot?.rawData?.address || 'Address not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="phone" size={18} color="#1a237e" />
          <Text style={styles.infoText}>{spot?.phone || 'Phone not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="car" size={18} color="#1a237e" />
          <Text style={styles.infoText}>Total slots: {spot?.rawData?.parking_lots || 'N/A'}</Text>
        </View>
      </View>

      {/* Availability Checker */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Check Availability</Text>
        
        <Text style={styles.inputLabel}>Select Day:</Text>
        <View style={styles.dayContainer}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.selectedDayButton
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === index && styles.selectedDayButtonText
              ]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Select Hour:</Text>
        <View style={styles.hoursContainer}>
          {renderHourButtons()}
        </View>

        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={checkAvailability}
          disabled={checkingAvailability}
        >
          {checkingAvailability ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkButtonText}>Check Availability</Text>
          )}
        </TouchableOpacity>

        {availability !== null && (
          <View style={styles.availabilityResult}>
            <Text style={styles.availabilityText}>
              Predicted Availability: <Text style={styles.availabilityPercent}>{availability.toFixed(1)}%</Text>
            </Text>
            <Text style={styles.availabilitySubtext}>
              (~{Math.round(spot.rawData.parking_lots * (availability / 100))} slots available)
            </Text>
          </View>
        )}
      </View>

      {/* Pricing Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Pricing Plans</Text>
        
        {loading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>Couldn't load pricing information</Text>
        ) : prices.length > 0 ? (
          <View style={styles.priceTable}>
            {prices.map((item) => (
              <View key={item.price_id} style={styles.priceRow}>
                <View style={styles.pricePlan}>
                  <Text style={styles.pricePlanText}>Hour {item.price_plan}</Text>
                </View>
                <Text style={styles.priceValue}>{item.price} Frw</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.infoText}>No pricing information available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  dayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  dayButton: {
    padding: 10,
    margin: 4,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#1a237e',
  },
  dayButtonText: {
    color: '#333',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  hoursContainer: {
    marginBottom: 15,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  hourButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedHourButton: {
    backgroundColor: '#1a237e',
  },
  hourButtonText: {
    color: '#333',
  },
  selectedHourButtonText: {
    color: '#fff',
  },
  checkButton: {
    backgroundColor: '#1a237e',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  availabilityResult: {
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 16,
    color: '#333',
  },
  availabilityPercent: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  availabilitySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  priceTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  pricePlan: {
    backgroundColor: '#f0f7ff',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pricePlanText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  priceValue: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
  },
});

export default ParkingDetails;
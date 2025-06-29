import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ZoneRecommendationScreen = ({ route, navigation }) => {
  const { recommendations = [], hours = 0 } = route.params || {};

  // Helper function to format parking spot data
  const formatParkingSpot = (details) => {
    if (!details) return {};
    return {
      id: details.parking_id?.toString() || '',
      title: details.full_park_name || 'Unknown Parking',
      description: `${details.address || 'Address not available'} - ${details.parking_lots || 0} spots available`,
      phone: details.phone || 'Phone not available',
      availability: `${details.parking_lots || 0} spots available`,
      rawData: details
    };
  };

  return (
    <View style={styles.container}>
     

      <Text style={styles.subtitle}>
        Best options for {hours} {hours === 1 ? 'hour' : 'hours'}:
      </Text>
      
      <FlatList
        data={recommendations}
        keyExtractor={(item, index) => item?.details?.parking_id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recommendations available</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ParkingDetails', { 
              spot: formatParkingSpot(item?.details) 
            })}
          >
            <View style={styles.cardHeader}>
              <Icon name="map-marker" size={24} color="#1a237e" />
              <Text style={styles.parkName}>{item?.parksht_name || 'Unknown Parking'}</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Icon name="phone" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item?.details?.phone || 'Phone not available'}
              </Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Icon name="map-pin" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item?.details?.address || 'Address not available'}
              </Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Icon name="car" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item?.details?.parking_lots || 0} parking spots
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  subtitle: {
    fontSize: 16,
    padding: 20,
    color: '#666',
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  parkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ZoneRecommendationScreen;
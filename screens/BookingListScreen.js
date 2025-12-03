import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';

const BookingList = ({ route }) => {
  const { bookings } = route.params;
  const [qrVisible, setQrVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [parkingInfoMap, setParkingInfoMap] = useState({});

  // Fetch parking info for all unique park_ids in bookings
  useEffect(() => {
    const fetchParkingInfos = async () => {
      const uniqueParkIds = [
        ...new Set((bookings.data || []).map(b => b.in_park).filter(Boolean))
      ];
      const infoMap = {};
      // Fetching
      for (const parkId of uniqueParkIds) {
        try {
          const res = await fetch(`http://10.213.112.130:8000/parkings/id/${parkId}`);
          const data = await res.json();
          infoMap[String(parkId)] = data; // Always use string key
        } catch (e) {
          infoMap[String(parkId)] = null;
        }
      }
      setParkingInfoMap(infoMap);
    };
    if (bookings && bookings.data && bookings.data.length > 0) {
      fetchParkingInfos();
    }
  }, [bookings]);

  const showQr = (value) => {
    setQrValue(value);
    setQrVisible(true);
  };

  const hideQr = () => {
    setQrVisible(false);
    setQrValue('');
  };

  // Helper to calculate remaining time until due
  const getRemainingTime = (entryTime, durationHours) => {
    if (!durationHours || isNaN(durationHours)) return 'Unknown';
    const now = new Date();
    const entry = new Date(entryTime);
    const due = new Date(entry.getTime() + Number(durationHours) * 60 * 60 * 1000);
    const diffMs = due - now;
    if (diffMs <= 0) return 'Expired';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min left`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ${diffMins % 60} min left`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ${diffHours % 24}h left`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="list-alt" size={24} color="#007BFF" />
        <Text style={styles.title}>Booking Records</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {bookings.message} ({bookings.count} records found)
      </Text>
      
      {bookings.count > 0 ? (
        <ScrollView style={styles.list}>
          {bookings.data.map((booking, index) => {
            const parkInfo = parkingInfoMap[String(booking.in_park)];
            return (
              <View key={index} style={styles.bookingCard}>
                <Text style={styles.bookingHeader}>
                  <Text style={styles.bold}>Plate:</Text> {booking.card_code}
                </Text>
                <Text>
                  <Text style={styles.bold}>Park:</Text> {parkInfo ? parkInfo.full_park_name : booking.in_park}
                </Text>
                {/* Show parking name and address if available */}
                {parkInfo && (
                  <>
                    <Text>
                      <Text style={styles.bold}>Address:</Text> {parkInfo.address}
                    </Text>
                  </>
                )}
                <Text>
                  <Text style={styles.bold}>Entry:</Text> {new Date(booking.entre_time).toLocaleString()}
                </Text>
                <Text>
                  <Text style={styles.bold}>Remain:</Text> {getRemainingTime(booking.entre_time, booking.hour)}
                </Text>
                <Text>
                  <Text style={styles.bold}>Status:</Text> {getStatusText(booking.status)}
                </Text>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => showQr(booking.p_in_id)}
                >
                  <Icon name="qrcode" size={18} color="#007BFF" />
                  <Text style={styles.qrButtonText}>Show QR</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Icon name="exclamation-circle" size={40} color="#888" />
          <Text style={styles.emptyText}>No bookings found</Text>
        </View>
      )}

      {/* QR Modal */}
      <Modal
        visible={qrVisible}
        transparent
        animationType="fade"
        onRequestClose={hideQr}
      >
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrModalContent}>
            <Text style={styles.qrModalTitle}>Booking QR Code</Text>
            <QRCode value={qrValue ? String(qrValue) : ' '} size={200} />
            <TouchableOpacity style={styles.closeButton} onPress={hideQr}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Status: 4 = Pending, 1 = Verified, 0 = Line-in, 2 = Cancelled, 3 = Completed
const getStatusText = (status) => {
  switch(status) {
    case 4: return 'Pending';
    case 1: return 'Verified';
    case 0: return 'Line-in';
    case 2: return 'Cancelled';
    case 3: return 'Completed';
    default: return 'Unknown';
  }
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
    marginBottom: 15
  },
  title: {
    fontSize: 22,
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
  bookingHeader: {
    fontSize: 16,
    marginBottom: 5
  },
  bold: {
    fontWeight: 'bold'
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#e6f0ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  qrButtonText: {
    color: '#007BFF',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888'
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrModalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center'
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default BookingList;
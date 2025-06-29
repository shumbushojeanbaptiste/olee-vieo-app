import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const Dashboard = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCheckBookingModal, setShowCheckBookingModal] = useState(false);
  const [hoursInput, setHoursInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [bookingPlate, setBookingPlate] = useState('');
  const [checkBookingPlate, setCheckBookingPlate] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingHour, setBookingHour] = useState(12);
  const [parkId, setParkId] = useState(1);
  const [optimalPrice, setOptimalPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('MoMo');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleZoneRecommendation = async () => {
    const numHours = parseInt(hoursInput);
    if (isNaN(numHours)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of hours');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.86:8000/recommend-zone-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tot_hours: numHours })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get recommendations');

      setShowHoursModal(false);
      setHoursInput('');
      navigation.navigate('ZoneRecommendation', { recommendations: data.recommended, hours: numHours });
    } catch (error) {
      Alert.alert('Error', error.message);
      setShowHoursModal(false);
    }
  };

  const handlePricePrediction = async () => {
    const hoursPerDay = parseInt(priceInput);
    if (isNaN(hoursPerDay) || hoursPerDay <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid hours per day');
      return;
    }

    setPriceLoading(true);
    try {
      const response = await fetch('http://192.168.1.86:8000/predict/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: 1 })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get price prediction');

      const hourlyRate = data.optimal_price;
      setOptimalPrice({
        hoursPerDay,
        hourly: hourlyRate * hoursPerDay,
        weekly: hourlyRate * hoursPerDay * 7,
        monthly: hourlyRate * hoursPerDay * 30,
        yearly: hourlyRate * hoursPerDay * 365
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        Alert.alert("Session Error", "No user session found");
        return;
      }

      // Validate date format and range
      const today = new Date();
      const inputDate = new Date(bookingDate);
      const diffDays = Math.floor((inputDate - today) / (1000 * 60 * 60 * 24));

      if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
        Alert.alert('Invalid Date', 'Please enter date as YYYY-MM-DD');
        return;
      }
      if (isNaN(inputDate.getTime()) || diffDays < 0 || diffDays > 6) {
        Alert.alert('Invalid Date', 'Date must be within the next 7 days from today.');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id || user.account_id;

      const bookingData = {
        plate: bookingPlate,
        duedate: bookingDate,
        hour: bookingHour,
        park_id: parkId,
        user: userId
      };

      const response = await fetch('http://192.168.1.86:8000/new/park-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to create booking');

      Alert.alert('✅ Booking Success', `Car ${data.card_code} added to Parking`);
      setShowBookingModal(false);
      setBookingPlate('');
      setBookingDate('');
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Booking Error', error.message);
    }
  };

  const handleCheckBookings = async () => {
    try {
      if (!checkBookingPlate.trim()) {
        Alert.alert("Invalid Input", "Please enter a plate number");
        return;
      }

      const response = await fetch('http://192.168.1.86:8000/park-in/by-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: checkBookingPlate })
      });

      const bookings = await response.json();
      if (!response.ok) throw new Error(bookings.detail || 'Failed to fetch bookings');

      setShowCheckBookingModal(false);
      setCheckBookingPlate('');
      navigation.navigate('BookingList', { bookings });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const menuItems = [
    { icon: 'user', label: 'Profile', screen: 'Profile' },
    { icon: 'sign-out', label: 'Log Out', isLogout: true },
  ];

  const dashboardCards = [
    {
      icon: 'money',
      title: 'Price Prediction',
      description: 'Get optimal price for parking duration',
      action: () => {
        setPriceInput('');
        setOptimalPrice(null);
        setShowPriceModal(true);
      },
    },
    {
      icon: 'map-marker',
      title: 'Zone Recommendation',
      description: 'Get personalized parking zone recommendations',
      action: () => setShowHoursModal(true),
    },
    {
      icon: 'wpforms',
      title: 'Booking spot',
      description: 'Reserve your parking spot in advance',
      action: () => setShowBookingModal(true),
    },
    {
      icon: 'list-alt',
      title: 'Check Bookings',
      description: 'View your booking history by plate',
      action: () => setShowCheckBookingModal(true),
    },
  ];

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#4DA6FF' : '#007BFF'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
          Parking-Services
        </Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Icon name={isDarkMode ? 'sun-o' : 'moon-o'} size={20} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.welcomeTitle, isDarkMode && styles.darkWelcomeTitle]}>
        Welcome, {userData?.first_name || 'User'}!
      </Text>
      <Text style={[styles.welcomeSubtitle, isDarkMode && styles.darkWelcomeSubtitle]}>
        {userData?.email || 'Ready to find parking?'}
      </Text>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <Icon name="search" size={18} color={isDarkMode ? '#aaa' : '#888'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Search services..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="times-circle" size={18} color={isDarkMode ? '#aaa' : '#888'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Cards */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, isDarkMode && styles.darkCard]}
            onPress={card.action}
          >
            <View style={styles.cardHeader}>
              <Icon name={card.icon} size={24} color={isDarkMode ? '#4DA6FF' : '#007BFF'} />
              <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>
                {card.title}
              </Text>
            </View>
            <Text style={[styles.cardDescription, isDarkMode && styles.darkCardDescription]}>
              {card.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, isDarkMode && styles.darkBottomNav]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => item.isLogout ? handleLogout() : navigation.navigate(item.screen)}
          >
            <Icon
              name={item.icon}
              size={20}
              color={item.isLogout ? '#FF3B30' : (isDarkMode ? '#fff' : '#007BFF')}
            />
            <Text style={[styles.navLabel, isDarkMode && styles.darkNavLabel, item.isLogout && { color: '#FF3B30' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Chat')}
        >
          <Icon name="comments" size={24} color={isDarkMode ? '#fff' : '#007BFF'} />
          <Text style={[styles.navLabel, isDarkMode && styles.darkNavLabel]}>
            AI-Assistant
          </Text>
        </TouchableOpacity>
      </View>

      {/* Zone Recommendation Modal */}
      <Modal
        visible={showHoursModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHoursModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Enter Parking Duration</Text>
            <TextInput
              style={[styles.modalInput, isDarkMode && styles.darkModalInput]}
              placeholder="Number of hours"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              keyboardType="numeric"
              value={hoursInput}
              onChangeText={setHoursInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowHoursModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleZoneRecommendation}
              >
                <Text style={styles.modalButtonText}>Get Zone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Price Prediction Modal */}
      <Modal
        visible={showPriceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Parking Price Prediction</Text>
            <Text style={[styles.modalSubtitle, isDarkMode && styles.darkText]}>
              Enter hours per day to calculate parking costs
            </Text>
            <TextInput
              style={[styles.modalInput, isDarkMode && styles.darkModalInput]}
              placeholder="Hours per day"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              keyboardType="numeric"
              value={priceInput}
              onChangeText={setPriceInput}
            />
            
            {optimalPrice && (
              <View style={styles.priceResults}>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, isDarkMode && styles.darkText]}>
                    {optimalPrice.hoursPerDay}h Rate:
                  </Text>
                  <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                    {optimalPrice.hourly.toFixed(2)} RWF
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, isDarkMode && styles.darkText]}>
                    Weekly ({optimalPrice.hoursPerDay}h/day):
                  </Text>
                  <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                    {optimalPrice.weekly.toFixed(2)} RWF
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, isDarkMode && styles.darkText]}>
                    Monthly ({optimalPrice.hoursPerDay}h/day):
                  </Text>
                  <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                    {optimalPrice.monthly.toFixed(2)} RWF
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, isDarkMode && styles.darkText]}>
                    Yearly ({optimalPrice.hoursPerDay}h/day):
                  </Text>
                  <Text style={[styles.priceValue, isDarkMode && styles.darkText]}>
                    {optimalPrice.yearly.toFixed(2)} RWF
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPriceModal(false);
                  setOptimalPrice(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePricePrediction}
                disabled={priceLoading}
              >
                {priceLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Plan Price</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>New Booking</Text>
            
            <Text style={[styles.modalLabel, isDarkMode && styles.darkText]}>License Plate:</Text>
            <TextInput
              style={[styles.modalInput, isDarkMode && styles.darkModalInput]}
              placeholder="Enter plate number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={bookingPlate}
              onChangeText={setBookingPlate}
              autoCapitalize="characters"
            />

            <Text style={[styles.modalLabel, isDarkMode && styles.darkText]}>Select Date:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              {dateOptions.map(date => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateButton,
                    bookingDate === date && styles.selectedDateButton,
                    isDarkMode && styles.darkDateButton,
                    isDarkMode && bookingDate === date && styles.darkSelectedDateButton,
                  ]}
                  onPress={() => setBookingDate(date)}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      bookingDate === date && styles.selectedDateButtonText,
                      isDarkMode && styles.darkDateButtonText,
                      isDarkMode && bookingDate === date && styles.darkSelectedDateButtonText,
                    ]}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.modalLabel, isDarkMode && styles.darkText]}>Hour:</Text>
            <View style={styles.hourPicker}>
              <TouchableOpacity 
                style={styles.hourButton}
                onPress={() => setBookingHour(Math.max(0, bookingHour - 1))}
              >
                <Icon name="minus" size={16} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
              
              <Text style={[styles.hourText, isDarkMode && styles.darkText]}>
                {bookingHour}:00
              </Text>
              
              <TouchableOpacity 
                style={styles.hourButton}
                onPress={() => setBookingHour(Math.min(23, bookingHour + 1))}
              >
                <Icon name="plus" size={16} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            {/* Payment Method UI */}
            <Text style={[styles.modalLabel, isDarkMode && styles.darkText, { marginTop: 10 }]}>Payment Method:</Text>
            <View style={{ flexDirection: 'column', marginBottom: 15 }}>
              {/* MoMo */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  { backgroundColor: '#f6f6f6', marginTop: 0 },
                  selectedPayment === 'MoMo' && { borderColor: '#007BFF', borderWidth: 2 }
                ]}
                onPress={() => setSelectedPayment('MoMo')}
                activeOpacity={0.7}
              >
                <Icon name="mobile" size={20} color="#007BFF" />
                <Text style={styles.paymentText}>MoMo</Text>
                {selectedPayment === 'MoMo' && (
                  <Icon name="check" size={18} color="#007BFF" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
              {/* Airtel */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  { backgroundColor: '#f6f6f6', marginTop: 10 },
                  selectedPayment === 'Airtel' && { borderColor: '#007BFF', borderWidth: 2 }
                ]}
                onPress={() => setSelectedPayment('Airtel')}
                activeOpacity={0.7}
              >
                <Icon name="mobile" size={20} color="#E60000" />
                <Text style={styles.paymentText}>Airtel</Text>
                {selectedPayment === 'Airtel' && (
                  <Icon name="check" size={18} color="#007BFF" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
              {/* Visa */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  { backgroundColor: '#f6f6f6', marginTop: 10 },
                  selectedPayment === 'Visa' && { borderColor: '#007BFF', borderWidth: 2 }
                ]}
                onPress={() => setSelectedPayment('Visa')}
                activeOpacity={0.7}
              >
                <Icon name="credit-card" size={20} color="#007BFF" />
                <Text style={styles.paymentText}>Visa</Text>
                {selectedPayment === 'Visa' && (
                  <Icon name="check" size={18} color="#007BFF" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateBooking}
                disabled={!bookingPlate.trim()}
              >
                <Text style={styles.modalButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Check Bookings Modal */}
      <Modal
        visible={showCheckBookingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCheckBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Check Bookings</Text>
            
            <Text style={[styles.modalLabel, isDarkMode && styles.darkText]}>License Plate:</Text>
            <TextInput
              style={[styles.modalInput, isDarkMode && styles.darkModalInput]}
              placeholder="Enter plate number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              value={checkBookingPlate}
              onChangeText={setCheckBookingPlate}
              autoCapitalize="characters"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCheckBookingModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCheckBookings}
                disabled={!checkBookingPlate.trim()}
              >
                <Text style={styles.modalButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper to generate next 7 days as strings
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return days;
};

const dateOptions = getNext7Days();

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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: '#1f1f1f',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  darkHeaderTitle: {
    color: '#fff',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    color: '#333',
  },
  darkWelcomeTitle: {
    color: '#fff',
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#666',
  },
  darkWelcomeSubtitle: {
    color: '#aaa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSearchContainer: {
    backgroundColor: '#2a2a2a',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  darkSearchInput: {
    color: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  darkBottomNav: {
    backgroundColor: '#1f1f1f',
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#007BFF',
  },
  darkNavLabel: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#1f1f1f',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    color: '#333',
  },
  darkModalInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceResults: {
    marginVertical: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#333',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  hourPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  hourButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  hourText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 5,
  },
  selectedDateButton: {
    backgroundColor: '#007BFF',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 14,
  },
  selectedDateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  darkDateButton: {
    backgroundColor: '#222',
  },
  darkSelectedDateButton: {
    backgroundColor: '#4DA6FF',
  },
  darkDateButtonText: {
    color: '#fff',
  },
  darkSelectedDateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Dashboard;
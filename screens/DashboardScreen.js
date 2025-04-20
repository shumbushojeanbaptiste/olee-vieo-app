import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Dashboard = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    { icon: 'home', label: 'Home', screen: 'Home' },
    { icon: 'user', label: 'Profile', screen: 'Profile' },
    { icon: 'cog', label: 'Settings', screen: 'Settings' },
    { icon: 'sign-out', label: 'Log Out', isLogout: true },
  ];

  const dashboardCards = [
    {
      icon: 'search',
      title: 'Find Patients',
      description: 'Description of finding patients goes here, basic requirements',
      screen: 'FindPatients',
    },
    {
      icon: 'user-plus',
      title: 'Register Patient',
      description: 'Description of registering a patient goes here, basic requirements',
      screen: 'RegisterPatient',
    },
    {
      icon: 'wpforms',
      title: 'Form Entry',
      description: 'Description of form entry goes here, basic requirements',
      screen: 'FormEntry',
    },
  ];

  // Filter cards based on search query
  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
          Parking-Services
        </Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Icon
            name={isDarkMode ? 'sun-o' : 'moon-o'}
            size={20}
            color={isDarkMode ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <Icon
          name="search"
          size={18}
          color={isDarkMode ? '#aaa' : '#888'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Search services..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon
              name="times-circle"
              size={18}
              color={isDarkMode ? '#aaa' : '#888'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, isDarkMode && styles.darkCard]}
            onPress={() => navigation.navigate(card.screen)}
          >
            <View style={styles.cardHeader}>
              <Icon 
                name={card.icon} 
                size={24} 
                color={isDarkMode ? '#4DA6FF' : '#007BFF'} 
              />
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

      {/* Bottom Navigation */}
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
            <Text style={[
              styles.navLabel,
              isDarkMode && styles.darkNavLabel,
              item.isLogout && { color: '#FF3B30' }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 15,
    marginTop: 10,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkSearchContainer: {
    backgroundColor: '#1f1f1f',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  darkSearchInput: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
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

export default Dashboard;
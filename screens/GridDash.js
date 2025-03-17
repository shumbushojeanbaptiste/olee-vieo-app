import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Dashboard = ({ navigation }) => {
  const [isGridView, setIsGridView] = useState(true); // Default to grid view
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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

  const defaultActions = [
    { id: 1, icon: 'car', title: 'Park Now', onPress: () => navigation.navigate('ParkNow') },
    { id: 2, icon: 'history', title: 'Parking History', onPress: () => navigation.navigate('ParkingHistory') },
    { id: 3, icon: 'map-marker', title: 'Find Parking', onPress: () => navigation.navigate('FindParking') },
    { id: 4, icon: 'credit-card', title: 'Payment Methods', onPress: () => navigation.navigate('PaymentMethods') },
    { id: 5, icon: 'star', title: 'Rewards', onPress: () => navigation.navigate('Rewards') },
    { id: 6, icon: 'cog', title: 'Settings', onPress: () => navigation.navigate('Settings') },
  ];

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={item.onPress}>
      <Icon name={item.icon} size={30} color="#007BFF" />
      <Text style={styles.gridItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={item.onPress}>
      <Icon name={item.icon} size={24} color="#007BFF" style={styles.listItemIcon} />
      <Text style={styles.listItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.topActionBar}>
        <Text style={styles.topActionBarTitle}>Menu</Text>
        <View style={styles.topActionBarIcons}>
          <TouchableOpacity onPress={() => console.log('Search pressed')}>
            <Icon name="search" size={20} color="#007BFF" style={styles.topActionBarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
            <Icon name="ellipsis-v" size={20} color="#007BFF" style={styles.topActionBarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3-Dot Menu Options */}
      {isMenuVisible && (
        <View style={styles.menuOptions}>
          <TouchableOpacity
            style={styles.menuOption}
            onPress={() => {
              setIsGridView(true);
              setIsMenuVisible(false);
            }}
          >
            <Icon name="th-large" size={20} color="#007BFF" />
            <Text style={styles.menuOptionText}>Grid View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuOption}
            onPress={() => {
              setIsGridView(false);
              setIsMenuVisible(false);
            }}
          >
            <Icon name="list" size={20} color="#007BFF" />
            <Text style={styles.menuOptionText}>List View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Default Actions (Grid or List View) */}
      {isGridView ? (
        <FlatList
          data={defaultActions}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <FlatList
          data={defaultActions}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Menu Bar */}
      <View style={styles.menuBar}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={20} color="#007BFF" />
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={20} color="#007BFF" />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog" size={20} color="#007BFF" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#FF3B30" />
          <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topActionBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  topActionBarIcons: {
    flexDirection: 'row',
  },
  topActionBarIcon: {
    marginLeft: 20,
  },
  menuOptions: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 10,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  gridContainer: {
    padding: 10,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1, // Ensures the item is square
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  gridItemText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  listContainer: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemIcon: {
    marginRight: 15,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 12,
    color: '#007BFF',
    marginTop: 5,
  },
});

export default Dashboard;
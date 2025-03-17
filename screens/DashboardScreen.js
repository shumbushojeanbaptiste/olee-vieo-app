import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SwipeListView } from 'react-native-swipe-list-view'; // Import SwipeListView

const Dashboard = ({ navigation }) => {
  const [isGridView, setIsGridView] = useState(false); // State to manage grid/list view
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to manage 3-dot menu visibility

  // Function to handle logout
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
          onPress: () => {
            // Perform logout actions here (e.g., clear user session, navigate to login screen)
            navigation.navigate('Login'); // Navigate to the login screen
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Default actions with icons
  const defaultActions = [
    { id: 1, icon: 'car', title: 'Park Now', onPress: () => navigation.navigate('ParkNow') },
    { id: 2, icon: 'history', title: 'Parking History', onPress: () => navigation.navigate('ParkingHistory') },
    { id: 3, icon: 'map-marker', title: 'Find Parking', onPress: () => navigation.navigate('FindParking') },
    { id: 4, icon: 'credit-card', title: 'Payment Methods', onPress: () => navigation.navigate('PaymentMethods') },
    { id: 5, icon: 'star', title: 'Rewards', onPress: () => navigation.navigate('Rewards') },
    { id: 6, icon: 'cog', title: 'Settings', onPress: () => navigation.navigate('Settings') },
  ];

  // Render item for grid view
  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={item.onPress}>
      <Icon name={item.icon} size={30} color="#007BFF" />
      <Text style={styles.gridItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Render hidden swipeable item (e.g., delete button)
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.hiddenItem}>
      <TouchableOpacity
        style={styles.hiddenButton}
        onPress={() => Alert.alert('Delete', `Delete ${data.item.title}?`)}
      >
        <Icon name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // Render visible swipeable item
  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Icon name={item.icon} size={24} color="#007BFF" style={styles.listItemIcon} />
      <Text style={styles.listItemText}>{item.title}</Text>
    </View>
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
          numColumns={2} // Display items in a grid
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <SwipeListView
          data={defaultActions}
          renderItem={renderListItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id.toString()}
          leftOpenValue={75} // Width of the hidden button
          rightOpenValue={-75} // Width of the hidden button
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
        {/* Log Out Button */}
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
  // Top Action Bar Styles
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar height
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
  // 3-Dot Menu Options Styles
  menuOptions: {
    position: 'absolute',
    top: 90, // Adjust based on top action bar height
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
  // Grid View Styles
  gridContainer: {
    padding: 10,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  gridItemText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  // List View Styles
  listContainer: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
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
  // Hidden Swipeable Item Styles
  hiddenItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#FF3B30',
    paddingRight: 20,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  // Menu Bar Styles
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
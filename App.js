import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View } from 'react-native';
import OpeningScreen from './screens/OpeningScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen'; // Import the ProfileScreen
import ChatScreen from './screens/ChatScreen'; // Add this import
import NearScreen from './screens/NearScreen';
import ParkingDetails from './screens/ParkingDetails';
import HistoryScreen from './screens/HistoryScreen';



import { Image } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* Set StatusBar background color and text color */}
      <StatusBar
        backgroundColor="#F5F5F5" // Light gray background
        barStyle="dark-content" // Dark text/icons
      />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Opening">
          {/* Opening Screen */}
          <Stack.Screen
            name="Opening"
            component={OpeningScreen}
            options={{ headerShown: false }}
          />

          {/* Onboarding Screen */}
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />

          {/* Home Screen */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

<Stack.Screen name="Near" component={NearScreen} />

        <Stack.Screen name="NearScreen" component={NearScreen} />
        <Stack.Screen name="ParkingDetails" component={ParkingDetails} />
        
<Stack.Screen name="History" component={HistoryScreen} />
        {/* <Stack.Screen name="Chat me" component={ChatScreen} /> */}
      

          {/* Login Screen */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')} // Replace with your logo path
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a237e',
              },
              headerTintColor: '#fff',
            }}
          />

          {/* Sign Up Screen */}
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: 'Create an account',
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a237e',
              },
              headerTintColor: '#fff',
            }}
          />

          {/* Dashboard Screen */}
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a237e',
              },
              headerTintColor: '#fff',
            }}
          />
            {/* Add ChatScreen to the navigation stack */}
            <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              title: 'Parking Assistant',
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a237e',
              },
              headerTintColor: '#fff',
            }}
          />

          {/* Profile Screen */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a237e',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
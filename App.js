import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar, View } from 'react-native';
import OpeningScreen from './screens/OpeningScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen'; 
import ChatScreen from './screens/ChatScreen'; 
import NearScreen from './screens/NearScreen';
import ParkingDetails from './screens/ParkingDetails';
import HistoryScreen from './screens/HistoryScreen';
import ZoneRecommendationScreen from './screens/ZoneRecommendationScreen'; 
import BookingSuccess from './screens/BookingSuccess';
import BookingList from './screens/BookingListScreen';
import TrendsScreen from './screens/TrendsScreen';
import VideoPlayer from "./screens/VideoPlayer";
import VideoPlayerPublic from "./screens/VideoPlayerPublic";
import config from "./config/config";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import VerifyEmailScreen from './screens/VerifyEmailScreen';










import { Image } from 'react-native';



const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* Set StatusBar background color and text color */}
      <StatusBar
        backgroundColor="#1a1a1a" // Light gray background
        barStyle="light-content" // Dark text/icons
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

         

 <Stack.Screen
  name="VideoPlayer"
  component={VideoPlayer}
  options={({ route }) => ({
    title: route.params.video.title, // dynamically set the video title
    headerStyle: { backgroundColor: '#1a1a1a' },
    headerTintColor: '#fff',
  })}
/>
 <Stack.Screen
  name="VideoPlayerPublic"
  component={ VideoPlayerPublic }
  options={({ route }) => ({
    title: route.params.video.title, // dynamically set the video title
    headerStyle: { backgroundColor: '#1a1a1a' },
    headerTintColor: '#fff',
  })}
/>


<Stack.Screen name="Near" component={TrendsScreen} />
  <Stack.Screen 
          name="ZoneRecommendation" 
          component={ZoneRecommendationScreen} 
          options={{ title: 'Recommended Zones' }}
        />
<Stack.Screen name="BookingSuccess" component={BookingSuccess} />

        <Stack.Screen name="Trends Video" component={TrendsScreen} />
        <Stack.Screen name="ParkingDetails" component={ParkingDetails} />
        <Stack.Screen name="BookingList" component={BookingList} />
<Stack.Screen name="History" component={HistoryScreen} />

 <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        {/* <Stack.Screen name="Chat me" component={ChatScreen} /> */}
      

          {/* Login Screen */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
            
              headerStyle: {
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: 'lightgray',
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
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#fff',
            }}
          />

          {/* Dashboard Screen */}
 <Stack.Screen
  name="Dashboard"
  component={DashboardScreen}
  options={{
    headerShown: false,  // removes the header completely
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
                    style={{ width: 100, height: 50, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#1a1a1a',
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
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>

        
      </NavigationContainer>
    </>
  );
}
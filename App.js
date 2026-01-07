import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';
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
import Search from './screens/SearchScreen';
import MyVideoScreen from './screens/MyVideoScreen';










import { Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator();

export default function App() {
  // Monitor network connectivity and alert when offline
  const prevConnectedRef = React.useRef(true);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!(state.isConnected && (state.isInternetReachable ?? true));
      if (prevConnectedRef.current && !connected) {
        Toast.show({ type: 'error', text1: 'No internet connection', text2: 'Please check your network connection and try again.' });
      }
      prevConnectedRef.current = connected;
    });

    NetInfo.fetch().then(state => {
      const connected = !!(state.isConnected && (state.isInternetReachable ?? true));
      prevConnectedRef.current = connected;
      if (!connected) {
        Toast.show({ type: 'error', text1: 'No internet connection', text2: 'Please check your network connection and try again.' });
      }
    }).catch(() => {});

    return unsubscribe;
  }, []);

  return (
    <>
      {/* Set StatusBar background color and text color */}
      <StatusBar
        backgroundColor="#000" // Light gray background
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
    headerStyle: { backgroundColor: '#000' },
    headerTintColor: '#fff',
  })}
/>
 <Stack.Screen
  name="VideoPlayerPublic"
  component={ VideoPlayerPublic }
  options={({ route }) => ({
    title: route.params.video.title, // dynamically set the video title
    headerStyle: { backgroundColor: '#000' },
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
              title: 'Sign-in',
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#000',
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
                backgroundColor: '#000',
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
                backgroundColor: '#000',
              },
              headerTintColor: '#fff',
            }}
          />

             {/* search Screen */}
          <Stack.Screen
            name="Search"
            component={Search}
            options={{
              title: 'Search video',
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

          
          
             {/* search Screen */}
          <Stack.Screen
            name="MyVideo"
            component={MyVideoScreen}
            options={{
              title: 'My Video',
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <Image
                    source={require('./assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: '#000',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>

        
      </NavigationContainer>
      <Toast />
    </>
  );
}
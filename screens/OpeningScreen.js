import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const OpeningScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the OnboardingScreen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Replace with your logo or splash image
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Light gray background (matches StatusBar)
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    resizeMode: 'contain', // Ensure the image fits within the dimensions
  },
});

export default OpeningScreen;
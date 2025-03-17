import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({ navigation }) => {
  const handleDone = () => {
    // Navigate to the Home Screen
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      {/* Onboarding Swiper */}
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        bottomBarHighlight={false} // Disable default bottom bar highlight
        showSkip={false} // Hide the default Skip button
        showNext={false} // Hide the default Next button
        showDone={false} // Hide the default Done button
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/trackImage.png')} // Replace with your image path
                style={styles.image}
              />
            ),
            title: 'Welcome to AI-ParkFinder',
            subtitle: 'Find, predict, and navigate to available parking spaces with ease.',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/userLogin.jpg')} // Replace with your image path
                style={styles.image}
              />
            ),
            title: 'Real-Time Parking Availability',
            subtitle: 'Get real-time updates on parking slot availability.',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/trackImage.png')} // Replace with your image path
                style={styles.image}
              />
            ),
            title: 'Future Parking Predictions',
            subtitle: 'Predict future parking availability and plan ahead.',
          },
        ]}
      />

      {/* Custom "Get Started" button at the bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Get Started</Text>
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
  buttonContainer: {
    position: 'absolute', // Position the button container absolutely
    bottom: 40, // Place it at the bottom of the screen
    left: 0,
    right: 0,
    alignItems: 'center', // Center the button horizontally
  },
  doneButton: {
    backgroundColor: '#007BFF', // Button background color
    paddingHorizontal: 40, // Horizontal padding for width
    paddingVertical: 15, // Vertical padding for height
    borderRadius: 30, // Rounded corners
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow radius for iOS
    width: '80%', // Set button width to 80% of the screen
  },
  doneButtonText: {
    color: '#fff', // White text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold text
  },
  image: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    resizeMode: 'contain', // Ensure the image fits within the dimensions
  },
});

export default OnboardingScreen;
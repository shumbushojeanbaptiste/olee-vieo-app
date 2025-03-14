import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const headerSlides = [
  {
    id: '1',
    title: 'Real-Time Parking Slot Availability',
    image: require('../assets/trackImage.png'), // Replace with your image path
  },
  {
    id: '2',
    title: 'Future Parking Slot Predictions',
    image: require('../assets/userLogin.jpg'), // Replace with your image path
  },
  {
    id: '3',
    title: 'Find the Nearest Parking Spot',
    image: require('../assets/trackImage.png'), // Replace with your image path
  },
  // Add more slides as needed
];

export default function HomeScreen({ navigation }) {
  const [currentHeaderSlide, setCurrentHeaderSlide] = useState(0);
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeaderSlide((prev) => {
        const nextSlide = (prev + 1) % headerSlides.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: nextSlide * width, animated: true });
        }
        return nextSlide;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleLanguageSelect = (language) => {
    console.log(`Selected language: ${language}`);
    // Handle language selection logic here
  };

  return (
    <View style={styles.container}>
      {/* Header with Slide Show */}
      <View style={styles.header}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentHeaderSlide(slideIndex);
          }}
        >
          {headerSlides.map((slide) => (
            <View key={slide.id} style={styles.headerSlide}>
              <Text style={styles.appTitle}>{slide.title}</Text>
              <Image source={slide.image} style={styles.icon} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Language Selection Buttons */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>AI-ParkFinder</Text>
        <Text style={styles.languageSubtitle}>
          Easily find, predict, and navigate to available parking spaces
        </Text>
        <TouchableOpacity style={styles.languageButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.languageButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageSelect('Kinyarwanda')}>
          <Text style={styles.languageButtonText}>Nearest Parking Spot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageSelect('English')}>
          <Text style={styles.languageButtonText}>Parking Slot Predictions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    height: 150, // Adjust height as needed
    marginBottom: 20,
  },
  headerSlide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10, // Space between title and image
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  languageContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  languageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
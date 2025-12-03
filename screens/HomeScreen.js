import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const { width } = Dimensions.get('window');

const headerSlides = [
  {
    id: '1',
    title: 'Spark 30 - TECNO Smartphones',
    image: require('../assets/tecno.png'),
    titleColor: '#1a237e', // Deep blue
  },
  {
    id: '2',
    title: 'Mango 4G-TUNGA eSIM',
    image: require('../assets/mango.png'),
    titleColor: '#c62828', // Red
  },
  {
    id: '3',
    title: 'MTN-Rwanda (Bundles,Smart Phone)',
    image: require('../assets/mtn.png'),
    titleColor: '#00000', // Green
  },
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
      {/* Logo and Action Bar Icons */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
        <View style={styles.actionBarIcons}>
    
        
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Icon name="user-plus" size={20} color="#1a237e" style={styles.actionBarIcon} />
          </TouchableOpacity>
        </View>
      </View>

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
    <Text style={[styles.appTitle, {color: slide.titleColor}]}>
      {slide.title}
    </Text>
    <Image source={slide.image} style={styles.icon} />
  </View>
))}
        </ScrollView>
      </View>

      {/* Language Selection Buttons */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>AI-ParkFinder Video</Text>
        <Text style={styles.languageSubtitle}>
          Easily find, predict, and navigate to available parking spaces
        </Text>
        <TouchableOpacity style={styles.languageButton} onPress={() => navigation.navigate('Login')}>
          <View style={styles.buttonContent}>
            <Text style={styles.languageButtonText}>Sign-n</Text>
            <Icon name="long-arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
  style={styles.languageButton} 
  onPress={() => navigation.navigate('Near')}
>
  <View style={styles.buttonContent}>
    <Text style={styles.languageButtonText}>Trends Video</Text>
    <Icon name="long-arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
  </View>
</TouchableOpacity>
        <TouchableOpacity style={styles.languageButton} onPress={() => navigation.navigate('Chat')}>
          <View style={styles.buttonContent}>
            <Text style={styles.languageButtonText}>Assistant and Discuss with us</Text>
            <Icon name="long-arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignUp')}>
          <View style={styles.buttonContent}>
            <Text style={styles.registerButtonText}>Create an account</Text>
            <Icon name="long-arrow-right" size={16} color="#000" style={styles.buttonIcon} />
          </View>
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
    padding: 2,
  },
  logoContainer: {
    position: 'absolute', // Position the logo container absolutely
    top: 50, // Place it at the top of the screen
   
    flexDirection: 'row', // Align logo and icons horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space out logo and icons
    width: '100%', // Take full width
    paddingHorizontal: 10, // Add horizontal padding
  },
  logo: {
    width: 100, // Adjust width as needed
    height: 70, // Adjust height as needed
    resizeMode: 'contain', // Ensure the logo fits within the dimensions
  },
  actionBarIcons: {
    flexDirection: 'row', // Align icons horizontally
  },
  actionBarIcon: {
    marginLeft: 20, // Space between icons
  },
  header: {
    width: '100%',
    height: 150, // Adjust height as needed
    marginTop: 100, // Space for the logo and action bar
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
    backgroundColor: '#1a237e',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a237e',
  },
  registerButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center', // Center items vertically
  },
  buttonIcon: {
    marginLeft: 10, // Space between text and icon
  },
});
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import Toast from 'react-native-toast-message'; // Import Toast library

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [isSuccess, setIsSuccess] = useState(false); // State for success tick

  const handleLogin = () => {
    if (!username) {
      Alert.alert('Validation Failed', 'Username is required');
      return;
    }

    // Simulate a login process
    setIsLoading(true); // Show loading indicator
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        setIsSuccess(true); // Show success tick
        // Show success Toast
        Toast.show({
          type: 'success', // Type of Toast (success, error, info)
          text1: 'Login Successful', // Title
          text2: 'Welcome back!', // Subtitle
        });

        // Show success Alert with a button to confirm navigation
        Alert.alert(
          'Login Successful',
          'Welcome back! Do you want to proceed to the dashboard?',
          [
            {
              text: 'Cancel',
              style: 'cancel', // Cancel button
              onPress: () => {
                setIsLoading(false); // Reset loading state
                setIsSuccess(false); // Reset success state
              },
            },
            {
              text: 'Proceed',
              onPress: () => {
                setIsLoading(false); // Reset loading state
                setIsSuccess(false); // Reset success state
                navigation.navigate('Dashboard'); // Navigate on confirmation
              },
            },
          ]
        );
      } else {
        // Show error Toast for invalid credentials
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Invalid username or password',
        });
        setIsLoading(false); // Reset loading state
        setIsSuccess(false); // Reset success state
      }
    }, 2000); // Simulate a 2-second delay for the login process
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Notification and Sign-Up Icons */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => console.log('Notifications pressed')}>
          <Icon name="bell" size={20} color="#007BFF" style={styles.actionBarIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Icon name="user-plus" size={20} color="#007BFF" style={styles.actionBarIcon} />
        </TouchableOpacity>
      </View>

      {/* User Icon Image */}
      <Image
        source={require('../assets/userLogin.jpg')} // Replace with your image path
        style={styles.userIcon}
      />
      <Text style={styles.title}>Login</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button with Arrow Icon or Success Tick */}
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]} // Disable button style
        onPress={handleLogin}
        disabled={isLoading || isSuccess} // Disable button when loading or success
      >
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Show loading indicator
          ) : isSuccess ? (
            <Icon name="check" size={20} color="#fff" /> // Show success tick
          ) : (
            <>
              <Text style={styles.loginButtonText}>Login</Text>
              <Icon name="long-arrow-right" size={20} color="#fff" style={styles.buttonIcon} />
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Add OTP and Email Verification Description */}
      <Text style={styles.description}>
        For additional security, we offer **OTP verification**. After you log in with
        the correct username and password. You may also need to verify your email for the first-time login.
      </Text>

      {/* Forgot Password and Support Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => alert('Forgot Password clicked')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Support clicked')}>
          <Text style={styles.link}>Need Support?</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Component */}
      <Toast />
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
  topBar: {
    position: 'absolute', // Position the top bar absolutely
    top: 40, // Place it at the top of the screen
    right: 20, // Place it at the right of the screen
    flexDirection: 'row', // Align icons horizontally
  },
  actionBarIcon: {
    marginLeft: 20, // Space between icons
  },
  userIcon: {
    width: 100, // Size of the user icon
    height: 100,
    marginBottom: 20, // Space between the image and text
    borderRadius: 50, // Make the icon circular
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007BFF', // Blue color for the login button
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    // backgroundColor: '#ccc', // Gray color when button is disabled
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center', // Center items vertically
  },
  buttonIcon: {
    marginLeft: 10, // Space between text and icon
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: '#007BFF', // Link color
    fontSize: 14,
    textDecorationLine: 'underline', // Underline the link
    textAlign: 'center',
    marginVertical: 5,
  },
});
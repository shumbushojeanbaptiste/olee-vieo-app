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
          <Icon name="bell" size={20} color="#1a237e" style={styles.actionBarIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Icon name="user-plus" size={20} color="#1a237e" style={styles.actionBarIcon} />
        </TouchableOpacity>
      </View>

      {/* User Icon Image */}
      <Image
        source={require('../assets/userLogin.jpg')} // Replace with your image path
        style={styles.userIcon}
      />
      <Text style={styles.title}>ParkFinder</Text>

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
              <Text style={styles.loginButtonText}>Log in</Text>
              <Icon name="long-arrow-right" size={20} color="#fff" style={[styles.buttonIcon, { marginLeft: 10 }]} />
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.createAccountText}>Create an account</Text>
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
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
  },
  actionBarIcon: {
    marginLeft: 20,
  },
  userIcon: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 30,
    color: '#1a237e',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  input: {
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  loginButton: {
    width: '85%',
    padding: 15,
    backgroundColor: '#1a237e',
    borderRadius: 25,
    marginTop: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
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
  createAccountButton: {
    width: '85%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a237e',
  },
  createAccountText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginVertical: 5,
    letterSpacing: 0.3,
  },
});
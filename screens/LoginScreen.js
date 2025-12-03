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
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Failed', 'Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://10.213.112.130:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        setIsSuccess(true);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: data.message,
        });

        // Navigate to Dashboard after successful login
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('Dashboard');
        }, 1500);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
      });
    }
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
        source={require('../assets/userLogin.jpg')}
        style={styles.userIcon}
      />
      <Text style={styles.title}>ParkFinder</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading || isSuccess}
      >
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : isSuccess ? (
            <Icon name="check" size={20} color="#fff" />
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
        For additional security, we offer OTP verification. After you log in with
        the correct email and password. You may also need to verify your email for the first-time login.
      </Text>

      {/* Forgot Password and Support Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Support')}>
          <Text style={styles.link}>Need Support?</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Component */}
      <Toast />
    </View>
  );
}

// Keep the same styles as before
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginLeft: 10,
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
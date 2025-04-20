import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle manual sign-up
  const handleSignUp = () => {
    if (!name || !phone || !email) {
      Alert.alert('Validation Failed', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate a sign-up process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sign Up Successful', 'You have successfully signed up!');
      navigation.navigate('Login'); // Navigate to Login screen after sign-up
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Sign Up Form */}
      <Text style={styles.title}>Sign Up</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {/* Phone Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Already have an account? Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  signUpButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1a237e',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    color: '#1a237e',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
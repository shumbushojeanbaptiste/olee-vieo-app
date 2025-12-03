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
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

export default function SignUpScreen({ navigation }) {
  const [familyName, setFamilyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!familyName || !firstName || !email || !phone) {
      Alert.alert('Validation Failed', 'Please fill in all required fields');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Validation Failed', 'Phone number must be 10 digits');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Validation Failed', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const response = await fetch('http://10.229.8.130:8000/new/user_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          family_name: familyName,
          first_name: firstName,
          email: email,
          role_id: 3, // Default role for new users
          user_park: 0, // Default value
          reg_date: currentDate,
          account_name: phone, // Using phone as account name
          us_phone: phone,
          gender: null, // Can be updated later
          last_logged_in: null,
          last_logged_out: null,
          log_sts: "0"
        })
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: data.message,
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        throw new Error(data.message || 'Account creation failed');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sign Up Form */}
      <Text style={styles.title}>Create Account</Text>

      {/* Family Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Family Name"
        value={familyName}
        onChangeText={setFamilyName}
      />

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Phone Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number (10 digits)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.signUpButton, isLoading && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
            <Icon name="user-plus" size={16} color="#fff" style={styles.buttonIcon} />
          </View>
        )}
      </TouchableOpacity>

      {/* Already have an account? Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
        </Text>
      </TouchableOpacity>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a237e',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  signUpButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1a237e',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#a5a9b8',
  },
  signUpButtonText: {
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
  loginLink: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
  loginLinkBold: {
    fontWeight: 'bold',
    color: '#1a237e',
  },
});
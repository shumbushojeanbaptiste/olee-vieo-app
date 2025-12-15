import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import config from "../config/config";

export default function VerifyEmailScreen({ route, navigation }) {
  const { email } = route.params;

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token || !password || !confirmPwd) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPwd) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(config.VERIFY_EMAIL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token, password }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem('auth_token', data.data.jwt);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account verified',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>

      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        value={email}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        onChangeText={setToken}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPwd}
      />

      <TouchableOpacity
        style={[
          styles.signUpButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>
            Verify & Continue
          </Text>
        )}
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#cb880aff',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5a9b8',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

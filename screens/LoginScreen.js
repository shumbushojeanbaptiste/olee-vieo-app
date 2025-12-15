import React, { useState, useEffect } from 'react';
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
import { jwtDecode } from 'jwt-decode';
import config from "../config/config";
import api from "../src/utils/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // ==========================================
  // ALWAYS CHECK TOKEN WHEN LOGIN SCREEN OPENS
  // ==========================================
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      validateToken();
    });
    return unsubscribe;
  }, [navigation]);

 const validateToken = async () => {
  try {
    setCheckingToken(true);

    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      setCheckingToken(false);
      return;
    }

    const decoded = jwtDecode(token); // decode token to get payload
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    // ✅ CHECK user_id EXISTS
    if (!decoded?.user_id) {
      throw new Error('User ID missing in token');
    }

    // ✅ CHECK TOKEN EXPIRY
    if (decoded.exp && decoded.exp > now) {
      navigation.replace('Dashboard');
      return;
    }

    await AsyncStorage.clear();
  } catch (err) {
    console.log('Token check failed:', err.message);
    await AsyncStorage.clear();
  } finally {
    setCheckingToken(false);
  }
};

  // ==========================================
  // HANDLE LOGIN
  // ==========================================
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Failed', 'Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(config.LOGIN, { email, password });
      const data = response.data;

      if (data.success) {
        await AsyncStorage.setItem("authToken", data.data.jwt);
        //await AsyncStorage.setItem("userId", data.data.user_id.toString());
        await AsyncStorage.setItem("userData", JSON.stringify(data.data));

        setIsSuccess(true);

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: data.message,
        });

        setTimeout(() => navigation.replace("Dashboard"), 1000);
      } else {
        throw new Error(data.message || "Login failed");
      }

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // SHOW LOADING SPINNER WHILE CHECKING TOKEN
  // ==========================================
  if (checkingToken) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#cb880aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/userLogin.png')} style={styles.userIcon} />
      <Text style={styles.title}>OleePlay</Text>
      <Text style={styles.subtitle}>Watch. Learn. Enjoy.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
              <Icon name="long-arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  userIcon: { width: 120, height: 120, marginBottom: 30, borderRadius: 60 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 10, color: '#000' },
  subtitle: { fontSize: 16, color: '#54598dff', marginBottom: 30 },
  input: {
    width: '85%', height: 50, borderWidth: 1,
    borderColor: '#ddd', borderRadius: 8,
    paddingLeft: 15, marginBottom: 15,
    backgroundColor: '#f8f8f8'
  },
  loginButton: {
    width: '85%', padding: 15, backgroundColor: '#cb880aff',
    borderRadius: 25, marginTop: 25, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center'
  },
  disabledButton: { opacity: 0.7 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  createAccountButton: {
    width: '85%', padding: 15, backgroundColor: '#fff',
    borderRadius: 25, marginTop: 15, alignItems: 'center',
    borderWidth: 2, borderColor: '#cb880aff'
  },
  createAccountText: { color: '#cb880aff', fontSize: 16, fontWeight: '700' },
});

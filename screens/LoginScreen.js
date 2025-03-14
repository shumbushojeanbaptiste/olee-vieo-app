import React,{ useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TouchableOpacity } from 'react-native';

import { Ionicons } from 'react-native-vector-icons'; // Import the Ionicons library

export default function LoginScreen({ navigation }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin =() =>{
    if (!username) {
      Alert.alert('Validation Failed', 'Username is required');
      return;
    }
     if (username==='admin' && password==='1234') {
      Alert.alert('Well Done',' Welcome',[
        { text: 'continue', onPress: () => navigation.navigate('Dashboard') }

      ]);

     } else {
      Alert.alert('Authantication fail', 'Invalid username or password');
     }

  };
  return (
    <View style={styles.container}>
      
     
      {/* User Icon Image */}
      <Image
        source={require('../assets/userLogin.jpg')}  // Local image reference
        style={styles.userIcon}
      />
          <Text style={styles.title}>Login </Text>
    
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
          />
    
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
    
    <  View style={styles.buttonContainer}>
    
        <Button title="Login" onPress={handleLogin} />
      </View>
          
    
           {/* Add OTP and Email Verification Description */}
      <Text style={styles.description}>
        For additional security, we offer **OTP verification**. After you log in with
        the correct username and password. You may also need to verify your email for the first-time login.
      </Text>

        
        <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => alert('Forgot Password clicked')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Support clicked')}>
          <Text style={styles.link}>Need Support?</Text>
        </TouchableOpacity>
      </View>
        </View>

        
  );
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
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
  note: {
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%', // Full width
    marginTop: 20,  // Adjust top margin if needed
  },
  linkContainer: {
    marginTop: 20,
  },

  link: {
    color: '#007BFF',  // Link color
    fontSize: 14,
    textDecorationLine: 'underline', // Underline the link
    textAlign: 'center',
    marginVertical: 5,
  },
});

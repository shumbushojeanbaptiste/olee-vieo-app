import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Now properly installed

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am your healthcare assistant. How can I help you today?',
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  const callAIModel = async (userMessage) => {
    try {
      const response = await axios.post('http://192.168.1.112:5000/ask', {
        question: userMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      });
      
      return response.data?.answer || "I didn't understand that. Could you rephrase?";
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        // Server responded with error status
        return "Sorry, there was an error processing your request.";
      } else if (error.request) {
        // No response received
        return "Unable to connect to the assistant. Please check your connection.";
      } else {
        // Other errors
        return "An unexpected error occurred. Please try again.";
      }
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await callAIModel(inputMessage);
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, something went wrong. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.isUser ? styles.userMessage : styles.botMessage
          ]}>
            <Text style={item.isUser ? styles.userMessageText : styles.botMessageText}>
              {item.text}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1a237e" />
              <Text style={styles.loadingText}>Assistant is typing...</Text>
            </View>
          ) : null
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          editable={!isLoading}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={isLoading || !inputMessage.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={isLoading || !inputMessage.trim() ? '#ccc' : '#1a237e'} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a237e',
    borderBottomRightRadius: 0,
  },
  botMessageText: {
    color: '#333',
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
});

export default ChatScreen;
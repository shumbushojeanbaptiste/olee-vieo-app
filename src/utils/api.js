import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const api = axios.create({
  timeout: 10000,
});

// Check network before requests and inject token automatically
api.interceptors.request.use(async (config) => {
  try {
    const state = await NetInfo.fetch();
    const connected = !!(state.isConnected && (state.isInternetReachable ?? true));
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'No internet connection',
        text2: 'Please check your network and try again.',
      });
      // reject so the calling code can handle it
      return Promise.reject({ message: 'No internet connection', isNetworkError: true });
    }
  } catch (e) {
    // if NetInfo fails for any reason, continue and let the request run
  }

  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global response interceptor to show network error toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // likely a network error
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: error.message || 'Please check your connection and try again.',
      });
    }
    return Promise.reject(error);
  }
);

export default api;

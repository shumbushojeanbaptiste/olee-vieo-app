import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../config/config";
import api from "../src/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileDrawer({ visible, onClose, videoToBuy }) {
  const navigation = useNavigation();

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const user_id = 1;
  const payment_method = 1;

  // When drawer opens → reset & refresh
  useEffect(() => {
    if (visible) {
      resetDrawer();
      fetchBalance();
    }
  }, [visible]);

  const resetDrawer = () => {
    setAmount("");
    setMessage("");
  };

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.BALANCE}/${user_id}`);
      setBalance(res.data.data.balance);
    } catch (error) {
      setMessage("Error fetching balance");
    } finally {
      setLoading(false);
    }
  };

  const rechargeWallet = async () => {
    if (!amount) return setMessage("Please enter an amount");

    try {
      setLoading(true);
      const res = await axios.post(config.RECHARGE, {
        user_id,
        payment_methods: payment_method,
        amount: parseFloat(amount),
        phone: "0788644687",
        currency: 1,
      });

      setMessage(`${res.data.message}`);
      fetchBalance();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage("Recharge failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const buyVideo = async () => {
    if (!videoToBuy) return;

    try {
      setLoading(true);

      const res = await axios.post(config.BUY_VIDEO, {
        user_id,
        payment_method,
        amount: parseFloat(videoToBuy.prices),
        video_id: videoToBuy.id,
      });

      setMessage(`Purchased successfully. RWF: ${videoToBuy.prices}`);
      fetchBalance();

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || "Purchase failed";
      setMessage(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      setMessage("No token found.");
      return;
    }

    const response = await axios.post(
      config.LOGOUT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 👉 RETURN THE SERVER RESPONSE
    console.log("Logout response:", response.data);

    await AsyncStorage.multiRemove(["authToken", "userData", "userId"]);

    setLoading(false);
    onClose();
    navigation.replace("Home");

  } catch (error) {
    setLoading(false);

    if (error.response) {
      setMessage(error.response.data.message);
      console.log("Server error:", error.response.data);
    } else {
      setMessage("Logout failed: " + error.message);
    }
  }
};


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontSize: 20, color: "#fff" }}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>My Wallet</Text>

          <Text style={styles.balanceTxt}>
            Balance: {balance !== null ? balance : "0"} RWF
          </Text>

          {message ? <Text style={styles.messageTxt}>{message}</Text> : null}

          {/* Recharge */}
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.actionBtn} onPress={rechargeWallet}>
            <Text style={styles.actionText}>Recharge Wallet</Text>
          </TouchableOpacity>

          {/* Purchase Video */}
          {videoToBuy ? (
            <>
              <Text style={styles.sectionTitle}>
                Buy Video: {videoToBuy.title} ({videoToBuy.prices} RWF)
              </Text>

              <TouchableOpacity style={styles.actionBtn} onPress={buyVideo}>
                <Text style={styles.actionText}>Purchase Video</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {/* LOGOUT BUTTON */}
<TouchableOpacity
  style={styles.logoutBtn}
  onPress={logout}
  disabled={loading} // prevent multiple clicks while logging out
>
  {loading ? (
    <ActivityIndicator size="small" color="#ff8800" />
  ) : (
    <View style={styles.logoutContent}>
      <Icon name="sign-out" size={18} color="#ff8800" style={{ marginRight: 8 }} />
      <Text style={styles.logoutText}>Logout</Text>
    </View>
  )}
</TouchableOpacity>

        </View>
      </View>

      {/* FULL SCREEN SPINNER */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#cb880a" />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeBtn: { alignSelf: "flex-end" },
  title: {
    color: "#fff",
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "bold",
  },
  actionBtn: {
    backgroundColor: "#cb880a",
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
  },
logoutBtn: {
  padding: 10,
  marginTop: 30,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
},

logoutContent: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

logoutText: {
  color: "#ff8800",
  fontWeight: "bold",
  fontSize: 16,
},


  balanceTxt: { color: "#fff", fontSize: 18, marginVertical: 10 },
  messageTxt: { color: "#cb880a", fontSize: 14, marginVertical: 5 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionTitle: { color: "#fff", fontSize: 16, marginTop: 15 },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

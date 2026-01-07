import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getUserData, getUserIdFromToken } from "../screens/DashboardScreen";

export default function ProfileDrawer({ visible, onClose, videoToBuy, onBalanceUpdate, onPurchaseSuccess }) {
  const navigation = useNavigation();

  // ===== User info =====
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ===== Balance & UI =====
  const [balance, setBalance] = useState(null);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [processing, setProcessing] = useState(false); // for recharge/buy/logout actions
  //const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  // ===== Recharge =====
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // ===== Load user info =====
  useEffect(() => {
    const checkUser = async () => {
      const id = await getUserIdFromToken();
      if (!id) {
        Alert.alert("Session expired", "Please login again");
        await AsyncStorage.clear();
        navigation.replace("Login");
        return;
      }
      setUserId(id);
      setAuthChecked(true);

      const first_name = await getUserData();
      setFirstName(first_name);
    };
    checkUser();
  }, []);

  // ===== Refresh drawer when opened =====
  useEffect(() => {
    if (visible) {
      resetDrawer();
      // try fetching balance (will noop if userId not yet set)
      fetchBalance();
      fetchPaymentMethods();
    }
  }, [visible]);

  // Refresh state
   const [refreshing, setRefreshing] = useState(false);
   const [isAtTop, setIsAtTop] = useState(true);
    const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBalance(), fetchPaymentMethods()]);
    setRefreshing(false);
  };

  // If userId arrives after the drawer was opened, fetch balance then
  useEffect(() => {
    if (visible && userId) {
      fetchBalance();
    }
  }, [visible, userId]);



  // ===== Reset inputs =====
  const resetDrawer = () => {
    setAmount("");
    setPhone("");
    setMessage("");
    setSelectedMethod(null);
  };

  // ===== Fetch user balance =====
  const fetchBalance = async () => {
    if (!userId) return;
    try {
      setFetchingBalance(true);
      const res = await axios.get(`${config.BALANCE}/${userId}`);
      const bal = res?.data?.data?.balance;
      setBalance(typeof bal !== "undefined" ? bal : 0);
      // Notify parent component to refresh dashboard data if needed
      onBalanceUpdate?.(typeof bal !== "undefined" ? bal : 0);
    } catch (err) {
      setMessage("Error fetching balance" + err);
      setBalance(0);
    } finally {
      setFetchingBalance(false);
    }
  };

  // ===== Fetch available payment methods =====
  const fetchPaymentMethods = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.get(config.PAYMENT_METHODS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPaymentMethods(res.data.data.filter(m => m.status === 1));
        if (res.data.data.length > 0) setSelectedMethod(res.data.data[0].method_id);
      }
    } catch (err) {
      console.log("Failed to fetch payment methods:", err.message);
    }
  };

  // ===== Recharge wallet =====
  const rechargeWallet = async () => {
    if (!amount || !selectedMethod) {
      setMessage("Enter amount and select payment method");
      return;
    }
    if (selectedMethod ==2 && !phone) {
      setMessage("Enter phone number for mobile money");
      return;
    }

    try {
      setProcessing(true);
      const res = await axios.post(config.RECHARGE, {
        user_id: userId,
        payment_methods: selectedMethod,
        amount: parseFloat(amount),
        phone: phone || "",
        currency: 1,
      });
      setMessage(res.data.message);
      await fetchBalance();
      setTimeout(onClose, 3000);
    } catch (err) {
      setMessage("Recharge failed. Try again.");
      console.log(err.response?.data || err.message);
    } finally {
      setProcessing(false);
    }
  };

  // ===== Buy video =====
  const buyVideo = async () => {
    if (!videoToBuy) return;
    try {
      setProcessing(true);
      const res = await axios.post(config.BUY_VIDEO, {
        user_id: userId,
        payment_method: selectedMethod || 1,
        amount: parseFloat(videoToBuy.prices),
        video_id: videoToBuy.id,
      });
      setMessage(`Purchased: ${videoToBuy.title} (${videoToBuy.prices} RWF)`);
      await fetchBalance();

      // Notify parent that purchase succeeded so UI can update immediately
      try {
        onPurchaseSuccess?.(videoToBuy);
      } catch (notifyErr) {
        console.log('onPurchaseSuccess callback failed:', notifyErr?.message || notifyErr);
      }

      setTimeout(onClose, 1500);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Purchase failed");
    } finally {
      setProcessing(false);
    }
  };

  // ===== Logout =====
  const logout = async () => {
    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.post(config.LOGOUT, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.multiRemove(["authToken", "userData", "userId"]);
      navigation.replace("Home");
    } catch (err) {
      console.log(err);
      setMessage("Logout failed");
    } finally {
      setProcessing(false);
    }
  };

  // ===== Guard render until auth checked =====
  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#cb880a" />
      </View>
    );
  }
  

  // ===== Render =====
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        
        <ScrollView
          style={styles.drawer}
          contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#cb880a" />}
        >
          <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontSize: 20, color: "#fff" }}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{firstName}'s Wallet</Text>
          <Text style={styles.balanceTxt}>
            Balance: {balance !== null ? balance : "0"} RWF
          </Text>
          {message ? <Text style={styles.messageTxt}>{message}</Text> : null}

          {/* Payment Method Picker */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10, maxHeight: 48 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {paymentMethods.map((m) => (
              <TouchableOpacity
                key={m.method_id}
                style={[
                  styles.paymentBtn,
                  selectedMethod === m.method_id && styles.paymentBtnActive,
                ]}
                onPress={() => setSelectedMethod(m.method_id)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.paymentText,
                    selectedMethod === m.method_id && styles.paymentTextActive,
                  ]}
                >
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Phone input only for mobile money (method_id === 2) */}
          {selectedMethod === 2 && (
            <TextInput
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          )}
          

          {/* Amount */}
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Actions */}
          <TouchableOpacity style={styles.actionBtn} onPress={rechargeWallet} disabled={processing || fetchingBalance}>
            <Text style={styles.actionText}>{processing ? "Processing..." : "Recharge Wallet"}</Text>
          </TouchableOpacity>

          {videoToBuy && (
            <>
              <Text style={styles.sectionTitle}>
                Buy Video: {videoToBuy.title} ({videoToBuy.prices} RWF)
              </Text>
              <TouchableOpacity style={styles.actionBtn} onPress={buyVideo} disabled={processing || fetchingBalance}>
                <Text style={styles.actionText}>{processing ? "Processing..." : "Purchase Video"}</Text>
              </TouchableOpacity>
            </>
          )}

         

         
          </View>

          {/* Footer: Logout pinned to bottom */}
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} disabled={processing || fetchingBalance}>
              <View style={styles.logoutContent}>
                <Icon name="sign-out" size={18} color="#ff8800" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>{processing ? "Processing..." : "Logout"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Overlay Spinner */}
        {(processing || fetchingBalance) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#cb880a" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  drawer: { backgroundColor: "#000", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  closeBtn: { alignSelf: "flex-end" },
  title: { color: "#fff", fontSize: 22, marginVertical: 10, fontWeight: "bold" },
  balanceTxt: { color: "#fff", fontSize: 18, marginVertical: 10 },
  messageTxt: { color: "#cb880a", fontSize: 14, marginVertical: 5 },
  input: { backgroundColor: "#111", color: "#fff", padding: 12, borderRadius: 10, marginVertical: 5 },
  sectionTitle: { color: "#fff", fontSize: 16, marginTop: 15, fontWeight: "bold" },
  actionBtn: { backgroundColor: "#cb880a", padding: 12, marginVertical: 10, borderRadius: 10 },
  actionText: { textAlign: "center", color: "#000", fontWeight: "bold" },
  paymentBtn: { paddingHorizontal: 15, paddingVertical: 6, height: 36, borderRadius: 20, backgroundColor: "#111", marginRight: 10, justifyContent: 'center' },
  paymentBtnActive: { backgroundColor: "#cb880a" },
  paymentText: { color: "#fff", maxWidth: 140 },
  paymentTextActive: { color: "#000", fontWeight: "bold" },
  logoutBtn: { padding: 10, marginTop: 30, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  logoutContent: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  logoutText: { color: "#ff8800", fontWeight: "bold", fontSize: 16 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
});

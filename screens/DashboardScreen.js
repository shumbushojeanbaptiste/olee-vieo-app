import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  fetchVideosByCategory,
  trendingVideos,
  fetchMyVideos as initialMyVideos,
  fetchMyVideos,
  fetchTrendingVideos,
  fetchInternalLatestVideos,
  fetchCaregoricalVideos,
} from "../src/data/videos";
import { categories } from "../src/data/category";
import ProfileDrawer from "../components/ProfileDrawer";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getUserIdFromToken = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);

    if (decoded?.user_id) {
      return decoded.user_id;
    }

    return null;
  } catch (err) {
    console.log('Invalid token', err);
    return null;
  }
};
export const getUserData = async () => {
  const userData = await AsyncStorage.getItem('userData');
  if (!userData) return null;

  try {
    // 🔹 parse the JSON string
    const parsed = JSON.parse(userData);

    console.log('User info:', parsed);

    if (parsed?.first_name) {
      return parsed.first_name;
    }

    return null;
  } catch (err) {
    console.log('Failed to parse userData', err);
    return null;
  }
};





const { width } = Dimensions.get("window");

export default function DashboardScreen({ navigation, route }) {
  const scrollRef = useRef(null);
  const [myVideosY, setMyVideosY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [myVideos, setMyVideos] = useState(initialMyVideos);
  const [videoToBuy, setVideoToBuy] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [apiMyVideos, setApiMyVideos] = useState([]);
  const [apiLatestVideos, setApiLatestVideos] = useState([]);

  // user data
const [userId, setUserId] = useState(null);
const [firstName, setFirstName] = useState(null);
const [authChecked, setAuthChecked] = useState(false);


useEffect(() => {
  const checkUser = async () => {
    const id = await getUserIdFromToken();

    if (!id) {
      Alert.alert('Session expired', 'Please login again');
      await AsyncStorage.clear();
      navigation.replace('Login');
      return;
    }

    console.log('User ID exists:', id);
    setUserId(id);          // ✅ save userId
    setAuthChecked(true);   // ✅ mark auth as checked

    const first_name = await getUserData();
    setFirstName(first_name);
  };

  

  checkUser();
}, []);

// help to return user data




  // Refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load API functions
  const loadTrending = async () => {
    const data = await fetchInternalLatestVideos();
    setApiLatestVideos(data);
  };
  // load my videos
  const loadMyVideos = async () => {
    const data = await fetchMyVideos();
    setApiMyVideos(data) ;
  }

  const loadCategories = async () => {
    const data = await fetchVideosByCategory();
    setApiCategories(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadTrending(), loadCategories(),loadMyVideos()]);
    setRefreshing(false);
  };


  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadCategories(), loadTrending(), loadMyVideos()]);
      setLoading(false);
    };

    loadAll();
  }, []);

  // If navigated with focusMyVideos param, scroll to the My Videos section
  useEffect(() => {
    if (route?.params?.focusMyVideos) {
      setTimeout(() => {
        if (scrollRef.current && myVideosY) {
          scrollRef.current.scrollTo({ y: myVideosY - 10, animated: true });
        }
        navigation.setParams({ focusMyVideos: false });
      }, 300);
    }
  }, [route?.params?.focusMyVideos, myVideosY]);

  const handleVideoPress = (video) => {
    const owned = apiMyVideos.find((v) => v.id === video.id);
    if (owned) {
      navigation.navigate("VideoPlayer", { video });
    } else {
      Alert.alert(
        "Purchase Video",
        `Do you want to buy "${video.title}" for ${video.prices} RWF?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Buy",
            onPress: () => {
              setVideoToBuy(video);
              setDrawerVisible(true);
            },
          },
        ]
      );
    }
  };

  const handlePurchaseSuccess = (video) => {
    setMyVideos((prev) => [video, ...prev]);
    setVideoToBuy(null);
  };

  // Flexible render function
  const renderVideoCard = ({ item, horizontal = true }) => {
    const cardWidth = horizontal ? 160 : width - 20;
    const thumbnailHeight = horizontal ? 100 : 220;

    return (
      <TouchableOpacity
        style={[styles.videoCard, { width: cardWidth }]}
        onPress={() => handleVideoPress(item)}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={[styles.videoThumbnail, { height: thumbnailHeight }]}
        />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.videoMeta}>
            <Text style={styles.videoViews}>{item.views.toLocaleString()} views</Text>
            <Text style={styles.videoDuration}>{item.duration}</Text>
          </View>
          {!apiMyVideos.find((v) => v.id === item.id) && (
            <Text style={styles.purchaseLabel}> {item.prices} RWF</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onScroll={(e) => setIsAtTop(e.nativeEvent.contentOffset.y <= 0)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={isAtTop} />
        }
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
           <Image
                  source={require('../assets/logo.png')}
                    style={{ width: 100, height: 30, resizeMode: 'contain' }}
                                        />
         
          <TouchableOpacity style={styles.profileBtn} onPress={() => setDrawerVisible(true)}>
            <Icon name="user-circle" size={35} color="#fff" />
          </TouchableOpacity>
        </View>

       {/* CATEGORIES */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.categoryScroll}
>
  {apiCategories.map((cat, index) => (
    <TouchableOpacity
      key={`category-${cat.category_id ?? 'unknown'}-${index}`}
      onPress={() => setSelectedCategory(cat.category_name)}
      style={[
        styles.categoryButton,
        selectedCategory === cat.category_name && styles.categoryButtonActive,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === cat.category_name && styles.categoryTextActive,
        ]}
      >
        {cat.category_name}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>


        {/* MY VIDEOS (Horizontal) */}
        <View onLayout={(e) => setMyVideosY(e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>
            {apiMyVideos?.length > 0 ? "My Videos List " : ""}
          </Text>
          <FlatList
            data={apiMyVideos}
            renderItem={(item) => renderVideoCard({ ...item, horizontal: true })}
            keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}
          />
        </View>

        {/* TRENDING (Vertical Full-width) */}
        <Text style={styles.sectionTitle}>Trending Now | Latest   </Text>
        <FlatList
          data={apiLatestVideos}
          renderItem={(item) => renderVideoCard({ ...item, horizontal: false })}
          keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
          scrollEnabled={false} // ScrollView handles scrolling
          nestedScrollEnabled
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 30 }}
        />
      </ScrollView>

      {/* Bottom navigation menu */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="home" size={24} color="#cb880aff" />
          <Text style={styles.navLabel}> </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={24} color="#cb880aff" />
          <Text style={styles.navLabel}> </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyVideo')}>
          <Icon name="film" size={24} color="#cb880aff" />
          <Text style={styles.navLabel}> </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search') }>
          <Icon name="search" size={24} color="#cb880aff" />
          <Text style={styles.navLabel}> </Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE / WALLET DRAWER */}
      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        videoToBuy={videoToBuy}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      {/* Centered loading / refreshing overlay */}
      {(loading || refreshing) && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#cb880aff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingBottom: 80 },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  navButton: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", margin: 15 },
  searchInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginRight: 10,
  },
  profileBtn: { backgroundColor: "#1a1a1a", padding: 6, borderRadius: 10 },
  categoryScroll: { paddingLeft: 10, marginVertical: 10 },
  categoryButton: { marginRight: 10, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: "#1a1a1a" },
  categoryButtonActive: { backgroundColor: "#cb880a" },
  categoryText: { color: "#fff" },
  categoryTextActive: { color: "#000", fontWeight: "bold" },
  sectionTitle: { color: "#fff", fontSize: 25, marginLeft: 15, marginBottom: 10, marginTop: 15 },
  videoCard: { marginRight: 10, backgroundColor: "#1c1c1c", borderRadius: 10, overflow: "hidden" },
  videoThumbnail: { width: "100%" },
  videoInfo: { padding: 5 },
  videoTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  videoMeta: { flexDirection: "row", justifyContent: "space-between" },
  videoViews: { color: "#bbb", fontSize: 12 },
  videoDuration: { color: "#bbb", fontSize: 12 },
  purchaseLabel: { color: "#cb880a", fontSize: 12, marginTop: 5, fontWeight: "bold" },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
  },
});

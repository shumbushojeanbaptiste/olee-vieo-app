import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileDrawer from "../components/ProfileDrawer";
import { fetchMyVideos } from "../src/data/videos";

export const TrendsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Purchased videos and buy drawer
  const [apiMyVideos, setApiMyVideos] = useState([]);
  const [videoToBuy, setVideoToBuy] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    loadVideos();
    loadMyVideos();
  }, []);

  const loadMyVideos = async () => {
    try {
      const data = await fetchMyVideos();
      setApiMyVideos(data || []);
    } catch (err) {
      console.log("Load my videos failed:", err?.message || err);
    }
  };

  const isOwned = (video) => apiMyVideos.some((v) => v.id === String(video.id));

  const handleVideoPress = (video) => {
    if (isOwned(video)) {
      return navigation.navigate("VideoPlayer", { video });
    }

    Alert.alert(
      "Purchase Video",
      `Do you want to buy "${video.title}" for ${video.prices} RWF?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy", onPress: () => { setVideoToBuy(video); setDrawerVisible(true); } },
      ]
    );
  };

  const handlePurchaseSuccess = (video) => {
    // Add to local purchased list so UI updates immediately
    setApiMyVideos((prev) => [video, ...prev]);
    setVideoToBuy(null);
    setDrawerVisible(false);
  };

  const loadVideos = async () => {
    try {
      setLoading(true);

      // Default static videos
      const defaultVideos = [
        {
          id: 1,
          title: "How to build a React Native App",
          thumbnail: "https://i.ytimg.com/vi/0-S5a0eXPoc/maxresdefault.jpg",
          views: 120000,
          likes: 3500,
          duration: "12:45",
          video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
          prices: 100,
        },
        {
          id: 2,
          title: "Expo Tutorial for Beginners",
          thumbnail: "https://i.ytimg.com/vi/d1y-m5X6v1U/maxresdefault.jpg",
          views: 89000,
          likes: 2100,
          duration: "8:20",
          video_url:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          prices: 100,
        },
        {
          id: 3,
          title: "Learn JavaScript in 10 Minutes",
          thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg",
          views: 200000,
          likes: 6000,
          duration: "10:00",
          video_url:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          prices: 100,
        }
      ];

      setVideos(defaultVideos);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          isDarkMode && styles.darkContainer,
          { justifyContent: "center", alignItems: "center" }
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#4DA6FF" : "#007BFF"}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
          Music, Films & Trends
        </Text>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Icon
            name={isDarkMode ? "sun-o" : "moon-o"}
            size={22}
            color={isDarkMode ? "#fff" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Video List */}
      <ScrollView contentContainerStyle={styles.content}>
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={[styles.card, isDarkMode && styles.darkCard]}
            onPress={() => handleVideoPress(video)}
          >
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />

            <View style={styles.videoInfo}>
              <Text style={[styles.title, isDarkMode && styles.darkText]}>
                {video.title}
              </Text>

              <Text style={[styles.subText, isDarkMode && styles.darkSubText]}>
                {video.views.toLocaleString()} views • {video.duration}
              </Text>

              <View style={styles.row}>
                <Icon name="thumbs-up" size={16} color="#007BFF" />
                <Text style={[styles.likeText, isDarkMode && styles.darkText]}>
                  {video.likes.toLocaleString()}
                </Text>
              </View>

              {!isOwned(video) && (
                <Text style={[styles.purchaseLabel, isDarkMode && styles.darkText]}>
                  {video.prices} RWF
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))} 
      </ScrollView>

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        videoToBuy={videoToBuy}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  purchaseLabel: { color: "#cb880a", fontSize: 14, marginTop: 8, fontWeight: "bold" },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  darkContainer: {
    backgroundColor: "#121212"
  },
  header: {
    paddingTop: 50,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  darkHeader: {
    backgroundColor: "#1f1f1f",
    borderBottomColor: "#333"
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333"
  },
  darkHeaderTitle: {
    color: "#fff"
  },
  content: {
    padding: 10
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3
  },
  darkCard: {
    backgroundColor: "#1f1f1f"
  },
  thumbnail: {
    width: "100%",
    height: 200
  },
  videoInfo: {
    padding: 12
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6
  },
  darkText: {
    color: "#fff"
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6
  },
  darkSubText: {
    color: "#aaa"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  likeText: {
    marginLeft: 6,
    fontSize: 14
  }
});

export default TrendsScreen;

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";
import { relatedVideos,fetchRelatedVideos } from "../src/data/videos";
import Icon from "react-native-vector-icons/FontAwesome";

export default function VideoPlayerPublic({ route, navigation }) {
  const { video } = route.params;
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(video);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);
  const [comments, setComments] = useState(video.comments);
  const [likedStatus, setLikedStatus] = useState(null); // null, 'like', 'dislike'

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("720p");

  const likeAnim = useRef(new Animated.Value(1)).current;
  const dislikeAnim = useRef(new Animated.Value(1)).current;

  // related video

    const [apiRelatedVideos, setRelatedVideos] = useState([]);
    
      // Load API Related Videos
      useEffect(() => {
        const load = async () => {
          const data = await fetchRelatedVideos();
          setRelatedVideos(data);
        };
        load();
      }, []);

  // Update screen title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentVideo.title,
      headerStyle: { backgroundColor: "#1a1a1a" },
      headerTintColor: "#fff",
    });
  }, [navigation, currentVideo]);

  // Check if URL is YouTube
  const isYouTube = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  // Get token from AsyncStorage
  const getToken = async () => await AsyncStorage.getItem("authToken");

  // Handle video loading state
  const handleLoadStart = () => setLoadingVideo(true);
  const handleLoadEnd = () => setLoadingVideo(false);

  // Load new video
  const loadNewVideo = async (item) => {
    if (videoRef.current && !isYouTube(item.video_url)) {
      await videoRef.current.stopAsync();
    }
    setCurrentVideo(item);
    setLikes(item.likes);
    setDislikes(item.dislikes);
    setComments(item.comments);
    setLikedStatus(null);
    setLoadingVideo(true);

    await addView(item.id); // call view endpoint
  };

  // API Calls
  const addView = async (video_id) => {
    try {
      const token = await getToken();
      const device_id = "123456"; // can use device info
      await axios.post(config.PLAY,
        { user_id: 1, video_id, device_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log("View API error:", error.message);
    }
  };

  const handleLikeAPI = async () => {
    if (likedStatus === "like") return; // already liked
    setLoadingAction(true);
    try {
      const token = await getToken();
      const device_id = "123456";
      await axios.post(config.LIKES,
        { user_id: 1, video_id: currentVideo.id, device_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      Alert.alert("Error", "Like failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDislikeAPI = async () => {
    if (likedStatus === "dislike") return; // already disliked
    setLoadingAction(true);
    try {
      const token = await getToken();
      const device_id = "123456";
      await axios.post(config.DISLIKES,
        { user_id: 1, video_id: currentVideo.id, device_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      Alert.alert("Error", "Dislike failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;

    setLoadingAction(true);
    try {
      const token = await getToken();
      const device_id = "123456";
      await axios.post(config.COMMENTS,
        {
          user_id: 1,
          video_id: currentVideo.id,
          device_id,
          comment: commentText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = { id: Date.now().toString(), user: "You", text: commentText };
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (error) {
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setLoadingAction(false);
    }
  };

  // Animation functions
  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(likeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    if (likedStatus === "like") {
      setLikes(likes - 1);
      setLikedStatus(null);
    } else {
      if (likedStatus === "dislike") setDislikes(dislikes - 1);
      setLikes(likes + 1);
      setLikedStatus("like");
      handleLikeAPI();
    }
  };

  const handleDislike = () => {
    Animated.sequence([
      Animated.timing(dislikeAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(dislikeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    if (likedStatus === "dislike") {
      setDislikes(dislikes - 1);
      setLikedStatus(null);
    } else {
      if (likedStatus === "like") setLikes(likes - 1);
      setDislikes(dislikes + 1);
      setLikedStatus("dislike");
      handleDislikeAPI();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* VIDEO PLAYER */}
      {isYouTube(currentVideo.video_url) ? (
        <WebView
          style={{ width: "100%", height: 300 }}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          source={{ uri: currentVideo.video_url.replace("watch?v=", "embed/") }}
        />
      ) : (
        <View style={{ width: "100%", height: 300, backgroundColor: "#000" }}>
          <Video
            ref={videoRef}
            source={{ uri: currentVideo.video_url }}
            style={{ width: "100%", height: 300 }}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            onLoadStart={handleLoadStart}
            onLoad={handleLoadEnd}
          />
          {loadingVideo && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#cb880a" />
            </View>
          )}
        </View>
      )}

      {/* TITLE */}
      <Text style={styles.title}>{currentVideo.title}</Text>

      {/* ACTION ROW */}
      <View style={styles.actionRow}>
        <Text style={styles.views}>{currentVideo.views} views | {currentVideo.likes} likes</Text>

     

      
      </View>

      {/* COMMENTS */}


      {/* VIDEO QUALITY FILTER */}
    

      {/* RELATED VIDEOS */}
      <Text style={styles.sectionTitle}>Related Trends Videos</Text>
      <FlatList
        data={apiRelatedVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.videoItem} onPress={() => loadNewVideo(item)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.smallText}>{item.views} views | {item.likes} likes</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", padding: 10 },
  actionRow: { flexDirection: "row", paddingHorizontal: 10, alignItems: "center", marginBottom: 10, gap: 10 },
  views: { color: "#cb880aff", fontSize: 13 },
  likeDislikeContainer: { flexDirection: "row", backgroundColor: "#222", borderRadius: 20, overflow: "hidden", alignItems: "center", flex: 1 },
  likeDislikeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 12 },
  likeDislikeBtnActive: { backgroundColor: "#1a3a52" },
  likeDislikeIcon: { fontSize: 18, marginRight: 6 },
  likeDislikeText: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  likeDislikeTextActive: { color: "#1a73e8" },
  divider: { width: 1, height: 20, backgroundColor: "#444" },
  commentBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, gap: 4 },
  commentIcon: { fontSize: 16 },
  commentCount: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  commentBox: { flexDirection: "row", alignItems: "center", marginVertical: 10, backgroundColor: "#222", borderRadius: 8, padding: 8 },
  input: { flex: 1, color: "#fff", paddingHorizontal: 10 },
  sendBtn: { backgroundColor: "#1a73e8", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  commentItem: { marginBottom: 10 },
  commentUser: { color: "#1a73e8", fontWeight: "600" },
  commentText: { color: "#fff" },
  sectionTitle: { color: "#fff", fontSize: 18, marginTop: 10, paddingHorizontal: 10 },
  videoItem: { flexDirection: "row", marginVertical: 10, paddingHorizontal: 10, alignItems: "center" },
  thumbnail: { width: 140, height: 80, borderRadius: 8 },
  videoTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  smallText: { color: "#aaa", fontSize: 12 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  qualityRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 10 },
  qualityBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: "#555" },
  qualityBtnActive: { borderColor: "#1a73e8", backgroundColor: "#222" },
  qualityText: { color: "#fff" },
});

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
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";
import { fetchStoreVideos } from "../src/data/videos";
import { getUserData, getUserIdFromToken } from "../screens/DashboardScreen";

export default function VideoPlayer({ route, navigation }) {
  const { video } = route.params;
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(video);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [apiRelatedVideos, setRelatedVideos] = useState([]);
  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);
  const [comments, setComments] = useState(video.comments);
  const [likedStatus, setLikedStatus] = useState(null);

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const likeAnim = useRef(new Animated.Value(1)).current;
  const dislikeAnim = useRef(new Animated.Value(1)).current;

  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);

  /* ------------------ LOAD USER ------------------ */
  useEffect(() => {
    const checkUser = async () => {
      const id = await getUserIdFromToken();
      if (!id) {
        await AsyncStorage.clear();
        navigation.replace("Login");
        return;
      }
      setUserId(id);

      const first_name = await getUserData();
      setFirstName(first_name);
    };
    checkUser();
  }, []);

  /* ------------------ LOAD RELATED VIDEOS ------------------ */
  useEffect(() => {
    const load = async () => {
      const data = await fetchStoreVideos();
      setRelatedVideos(data);
    };
    load();
  }, []);

  /* ------------------ HEADER ------------------ */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentVideo.title,
      headerStyle: { backgroundColor: "#000" },
      headerTintColor: "#fff",
    });
  }, [navigation, currentVideo]);

  /* ------------------ VIDEO HANDLERS ------------------ */
  const getToken = async () => await AsyncStorage.getItem("authToken");

  const handleLoadStart = () => setLoadingVideo(true);
  const handleLoadEnd = () => setLoadingVideo(false);

  const loadNewVideo = async (item) => {
    if (videoRef.current) await videoRef.current.stopAsync();

    setCurrentVideo(item);
    setLikes(item.likes);
    setDislikes(item.dislikes);
    setComments(item.comments);
    setLikedStatus(null);
    setLoadingVideo(true);

    await addView(item.id);
  };

  const addView = async (video_id) => {
    if (!userId) return;
    try {
      const token = await getToken();
      await axios.post(
        config.PLAY,
        { user_id: userId, video_id, device_id: "123456" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log("View API error:", error.message);
    }
  };

  /* ------------------ LIKE / DISLIKE ------------------ */
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

  const handleLikeAPI = async () => {
    if (likedStatus === "like") return;
    setLoadingAction(true);
    try {
      const token = await getToken();
      await axios.post(
        config.LIKES,
        { user_id: userId, video_id: currentVideo.id, device_id: "123456" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {}
    finally { setLoadingAction(false); }
  };

  const handleDislikeAPI = async () => {
    if (likedStatus === "dislike") return;
    setLoadingAction(true);
    try {
      const token = await getToken();
      await axios.post(
        config.DISLIKES,
        { user_id: userId, video_id: currentVideo.id, device_id: "123456" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {}
    finally { setLoadingAction(false); }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    setLoadingAction(true);
    try {
      const token = await getToken();
      await axios.post(
        config.COMMENTS,
        {
          user_id: userId,
          video_id: currentVideo.id,
          device_id: "123456",
          comment: commentText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newComment = { id: Date.now().toString(), user: "You", text: commentText };
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch {}
    finally { setLoadingAction(false); }
  };

  /* ------------------ UI ------------------ */
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* VIDEO PLAYER */}
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

      {/* TITLE */}
      <Text style={styles.title}>{currentVideo.title}</Text>

      {/* ACTION ROW */}
      <View style={styles.actionRow}>
        <Text style={styles.views}>{currentVideo.views} views</Text>

        <View style={styles.likeDislikeContainer}>
          <TouchableOpacity
            style={[styles.likeDislikeBtn, likedStatus === "like" && styles.likeDislikeBtnActive]}
            onPress={handleLike}
            disabled={loadingAction}
          >
            <Animated.Text style={[styles.likeDislikeIcon, { transform: [{ scale: likeAnim }] }]}>
              👍
            </Animated.Text>
            <Text style={[styles.likeDislikeText, likedStatus === "like" && styles.likeDislikeTextActive]}>
              {likes}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.likeDislikeBtn, likedStatus === "dislike" && styles.likeDislikeBtnActive]}
            onPress={handleDislike}
            disabled={loadingAction}
          >
            <Animated.Text style={[styles.likeDislikeIcon, { transform: [{ scale: dislikeAnim }] }]}>
              👎
            </Animated.Text>
            <Text style={[styles.likeDislikeText, likedStatus === "dislike" && styles.likeDislikeTextActive]}>
              {dislikes}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.commentBtn} onPress={() => setShowComments(!showComments)}>
          <Text style={styles.commentIcon}>💬 </Text>
          <Text style={styles.commentCount}>{currentVideo.total_comments} </Text>
        </TouchableOpacity>
      </View>

      {/* COMMENTS */}
      {showComments && (
        <View style={{ paddingHorizontal: 10 }}>
          <View style={styles.commentBox}>
            <TextInput
              style={styles.input}
              placeholder={`Add a comment...  ${currentVideo.total_comments}`}
              placeholderTextColor="#888"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment} disabled={loadingAction}>
              {loadingAction ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff" }}>Send</Text>}
            </TouchableOpacity>
          </View>

          {comments.map((c, index) => (
            <View key={`${c?.id ?? index}-${index}`} style={styles.commentItem}>
              <Text style={styles.commentUser}>{c.user}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* RELATED VIDEOS */}
      <Text style={styles.sectionTitle}> Videos List | Video Store</Text>
      <FlatList
        data={apiRelatedVideos}
        keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
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

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", padding: 10 },
  actionRow: { flexDirection: "row", paddingHorizontal: 10, alignItems: "center", marginBottom: 10, gap: 10 },
  views: { color: "#aaa", fontSize: 13 },
  likeDislikeContainer: { flexDirection: "row", backgroundColor: "#222", borderRadius: 20, overflow: "hidden", alignItems: "center", flex: 1 },
  likeDislikeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 12 },
  likeDislikeBtnActive: { backgroundColor: "#1a3a52" },
  likeDislikeIcon: { fontSize: 18, marginRight: 6 },
  likeDislikeText: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  likeDislikeTextActive: { color: "#062930" },
  divider: { width: 1, height: 20, backgroundColor: "#444" },
  commentBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, gap: 4 },
  commentIcon: { fontSize: 16 },
  commentCount: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  commentBox: { flexDirection: "row", alignItems: "center", marginVertical: 10, backgroundColor: "#222", borderRadius: 8, padding: 8 },
  input: { flex: 1, color: "#fff", paddingHorizontal: 10 },
  sendBtn: { backgroundColor: "#1a73e8", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  commentItem: { marginBottom: 10 },
  commentUser: { color: "#1a73e8", fontWeight: "600" },
  commentText: { color: "#e0e0e0" },
  sectionTitle: { color: "#fff", fontSize: 18, marginTop: 10, paddingHorizontal: 10 },
  videoItem: { flexDirection: "row", marginVertical: 10, paddingHorizontal: 10, alignItems: "center" },
  thumbnail: { width: 140, height: 80, borderRadius: 8 },
  videoTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  smallText: { color: "#aaa", fontSize: 12 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
});

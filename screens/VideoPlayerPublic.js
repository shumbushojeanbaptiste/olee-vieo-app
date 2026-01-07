import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";
import { fetchRelatedVideos } from "../src/data/videos";
import Icon from "react-native-vector-icons/FontAwesome";

export default function VideoPlayerPublic({ route, navigation }) {
  const { video } = route.params;
  const videoRef = useRef(null);

  const [currentVideo, setCurrentVideo] = useState(video);
  const [apiRelatedVideos, setRelatedVideos] = useState([]);

  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);
  const [likedStatus, setLikedStatus] = useState(null);

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [didFinish, setDidFinish] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const likeAnim = useRef(new Animated.Value(1)).current;
  const dislikeAnim = useRef(new Animated.Value(1)).current;

  const getToken = async () => await AsyncStorage.getItem("authToken");

  /* ------------------ LOAD RELATED ------------------ */
  useEffect(() => {
    const load = async () => {
      const data = await fetchRelatedVideos();
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

  /* ------------------ VIDEO STATUS ------------------ */
  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      setLoadingVideo(true);
      return;
    }

    if (!hasPlayed && loadingVideo) {
      setLoadingVideo(false);
      setHasPlayed(true);
    }

    setIsBuffering(status.isBuffering && status.isPlaying && !loadingVideo);

    if (status.didJustFinish) {
      setDidFinish(true);
    }
  };

  /* ------------------ AUTO PLAY NEXT ------------------ */
  useEffect(() => {
    if (didFinish) {
      setDidFinish(false);
      playNextVideo();
    }
  }, [didFinish]);

  const playNextVideo = () => {
    if (!apiRelatedVideos.length) return;

    const index = apiRelatedVideos.findIndex((v) => v.id === currentVideo.id);
    const next = apiRelatedVideos[index + 1] || apiRelatedVideos[0];
    loadNewVideo(next);
  };

  /* ------------------ LOAD NEW VIDEO ------------------ */
  const loadNewVideo = async (item) => {
    try {
      setLoadingVideo(true);
      setHasPlayed(false);

      if (videoRef.current) {
        await videoRef.current.unloadAsync();
      }

      setCurrentVideo(item);
      setLikes(item.likes);
      setDislikes(item.dislikes);
      setLikedStatus(null);

      await addView(item.id);

      if (videoRef.current) {
        await videoRef.current.loadAsync({ uri: item.video_url }, { shouldPlay: true });
      }
    } catch (e) {
      console.log("Switch error:", e.message);
      setLoadingVideo(false);
    }
  };

  /* ------------------ API ------------------ */
  const addView = async (video_id) => {
    try {
      const token = await getToken();
      await axios.post(
        config.PLAY,
        { user_id: 1, video_id, device_id: "123456" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {}
  };

  /* ------------------ LIKE / DISLIKE ------------------ */
  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeAnim, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(likeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (likedStatus === "like") {
      setLikes(likes - 1);
      setLikedStatus(null);
    } else {
      if (likedStatus === "dislike") setDislikes(dislikes - 1);
      setLikes(likes + 1);
      setLikedStatus("like");
    }
  };

  const handleDislike = () => {
    Animated.sequence([
      Animated.timing(dislikeAnim, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(dislikeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (likedStatus === "dislike") {
      setDislikes(dislikes - 1);
      setLikedStatus(null);
    } else {
      if (likedStatus === "like") setLikes(likes - 1);
      setDislikes(dislikes + 1);
      setLikedStatus("dislike");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* VIDEO */}
      <View style={{ height: 300 }}>
        <Video
          ref={videoRef}
          source={{ uri: currentVideo.video_url }}
          style={{ width: "100%", height: 300 }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          onLoadStart={() => setLoadingVideo(true)}
          onLoad={() => {
            setLoadingVideo(false);
            setHasPlayed(true);
          }}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />

        {loadingVideo && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#cb880a" />
            <Text style={{ color: "#fff", marginTop: 6 }}>Loading...</Text>
          </View>
        )}
      </View>

      {/* TITLE */}
      <Text style={styles.title}>{currentVideo.title}</Text>

      {/* RELATED */}
      <Text style={styles.section}>Related Trending Videos</Text>
      <FlatList
        data={apiRelatedVideos}
        keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => loadNewVideo(item)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.videoTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  title: { color: "#fff", fontSize: 18, fontWeight: "bold", padding: 10 },
  section: { color: "#fff", fontSize: 16, padding: 10 },
  item: { flexDirection: "row", padding: 10, alignItems: "center" },
  thumb: { width: 120, height: 70, borderRadius: 6, marginRight: 10 },
  videoTitle: { color: "#fff", fontWeight: "600" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});

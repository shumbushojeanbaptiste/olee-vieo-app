
import axios from "axios";

import config from "../../config/config";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, getUserIdFromToken,userId,firstName } from "../../screens/DashboardScreen";






export const fetchPurchasedVideos = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const res = await axios.get(config.MY_VIDEOS, {
      body: { user_id: userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) return [];

    return res.data.data.map((v) => ({
      id: v.video_id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.url,
      views: v.views_count,
      likes: v.likes_count,
      dislikes: 0,
      duration: "09:56",
      prices: v.price,
      category: v.category,
      comments: [], // You can load comments separately
    }));
  } catch (err) {
    console.log("Fetch purchased videos failed:", err.message);
    return [];
  }
};


export const videos = [
  {
    id: "1",
    title: "Umutwe Wa Video 1",
    thumbnail: "https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg",
    video_url: "http://192.168.0.100:5000/uploads/video/Israel%20Mbonyi%20-%20Nina%20Siri.mp4",
    category: "Music",
    views: 12900,
    likes: 340,
    dislikes: 12,
    prices: 100,
    category: "Music",
    comments: [
      { id: "c1", user: "John", text: "Iyi video ni nziza cyane!" },
      { id: "c2", user: "Aline", text: "Big up 👍" },
    ],
  },
  {
    id: "2",
    title: "OleePlay Demo Video",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    video_url: "https://www.w3schools.com/html/movie.mp4",
    category: "Entertainment",
    views: 5400,
    likes: 120,
    dislikes: 5,
     prices: 100,
     category: "Music",
    comments: [
        { id: "c3", user: "Mike", text: "Great content!" },
        { id: "c4", user: "Sara", text: "Loved the visuals!" },
    ],
  },
  {
    id: "3",
    title: "Tutorial Example",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4",
    category: "Education",
    views: 7800,
    likes: 200,
    dislikes: 8,
     prices: 100,
     category: "Music",
    comments: [
        { id: "c5", user: "Alice", text: "Very informative!" },
        { id: "c6", user: "Bob", text: "Helped me a lot, thanks!" },
    ],
  }
];

// Default trending videos (exported)
export const trendingVideos = [
  {
    id: "t1",
    title: "" + config.TRENDS_VIDEOS,
    thumbnail: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 15000,
    likes: 500,
    dislikes: 20,
     prices: 100,
     category: "Music",
    comments: [],
  },
];

export const fetchTrendingVideos = async () => {
  try {
    console.log("Fetching trending videos...");
    const res = await axios.get(config.TRENDS_VIDEOS);

    console.log("Response:", res.data);

    if (!res.data.success) return [];

    const videos = res.data.data.map(v => ({
      id: v.id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes || 0,
      duration: v.duration || "09:56",
      prices: v.price,
      category: v.category,
      owner: v.owner || "",
      comments: v.comments || [],
    }));

    return videos;
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};

export const fetchVideosByCategory = async () => {
   try {
    console.log("Fetching videos by category...");
    const res = await axios.get(config.VIDEO_CATEGORY);

    console.log("Response:", res.data);

    if (!res.data.success) return [];

    const categories = res.data.data.map(c => ({
      category_id: c.category_id.toString(),
      category_name: c.category_name,
    }));

    return categories;
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};


// related video rom API
export const fetchRelatedVideos = async () => {
  try {
    console.log("Fetching trending videos...");
    const res = await axios.get(config.RELATED_VIDEOS);

    console.log("Response:", res.data);

    if (!res.data.success) return [];

    const videos = res.data.data.map(v => ({
      id: v.id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes || 0,
      duration: v.duration || "09:56",
      prices: v.price,
      category: v.category,
      owner: v.owner || "",
      comments: v.comments || [],
    }));

    return videos;
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};


// related Store video from API
export const fetchMyVideos = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const res = await axios.get(config.MY_VIDEOS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) return [];

    return res.data.data.map(v => ({
      id: v.id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes || 0,
      duration: v.duration || "09:56",
      prices: v.price,
      category: v.category,
      owner: v.owner || "",
      comments: v.comments || [],
    }));
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};

// internal latest store
export const fetchInternalLatestVideos = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const res = await axios.get(config.INTERNAL_LATEST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) return [];

    return res.data.data.map(v => ({
      id: v.id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes || 0,
      duration: v.duration || "09:56",
      prices: v.price,
      category: v.category,
      owner: v.owner || "",
      comments: v.comments || [],
    }));
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};

// related my video from API
export const fetchStoreVideos = async () => {
   try {
    const token = await AsyncStorage.getItem("authToken");

    const res = await axios.get(config.MY_VIDEOS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) return [];

    return res.data.data.map(v => ({
      id: v.id.toString(),
      title: v.title,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes || 0,
      duration: v.duration || "09:56",
      prices: v.price,
      category: v.category,
      owner: v.owner || "",
      comments: v.comments || [],
    }));
  } catch (err) {
    console.log("Fetch failed:", err.message);
    return [];
  }
};
export const relatedVideos = [];
  export const myVideos = [];





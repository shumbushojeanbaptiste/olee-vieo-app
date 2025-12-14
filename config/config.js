// config.js
const BASE_URL = "http://192.168.0.100:5000/api"; // Base API URL

export default {
  BASE_URL,

  // -------- AUTH --------
  LOGIN: `${BASE_URL}/accounts/login`,
  REGISTER: `${BASE_URL}/accounts/register`,
  LOGOUT: `${BASE_URL}/accounts/logout`,

  // -------- VIDEO ENDPOINTS --------
  VIDEO_LIST: `${BASE_URL}/videos`,
  VIDEO_TRENDING: `${BASE_URL}/videos/trending`,
  TRENDS_VIDEOS: `${BASE_URL}/videos/trends`, // Trending videos (top 20)
  VIDEO_CATEGORY: `${BASE_URL}/settings/videoCategories`,
  RELATED_VIDEOS: `${BASE_URL}/videos/trends`,
  STORE_VIDEOS: `${BASE_URL}/videos/trends`,
  

  BUY_VIDEO: `${BASE_URL}/payments/buy-video`,
  BALANCE: `${BASE_URL}/payments/balance`,
  RECHARGE: `${BASE_URL}/payments/init-deposit`,

  // -------- CATEGORIES / METADATA --------
  CATEGORIES: `${BASE_URL}/categories`,

  // -------- PLAYBACK & INTERACTIONS --------
  PLAY: `${BASE_URL}/watching/play`,
  LIKES: `${BASE_URL}/watching/likes`,
  DISLIKES: `${BASE_URL}/watching/dislikes`,
  COMMENTS: `${BASE_URL}/watching/comments`,

  // -------- USER VIDEOS --------
  MY_VIDEOS: `${BASE_URL}/videos/trends`,

  // -------- FUTURE ENDPOINTS --------
  // Add any new endpoints here as needed
};

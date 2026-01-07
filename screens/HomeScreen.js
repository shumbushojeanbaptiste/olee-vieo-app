import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  fetchTrendingVideos,
  fetchVideosByCategory,
  fetchCategoricalVideos,   // ✅ ADDED
} from "../src/data/videos";

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apiVideos, setApiVideos] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const scrollViewRef = useRef(null);

  // refresh & loading
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const loadTrending = async () => {
    const data = await fetchTrendingVideos();
    setApiVideos(data || []);
  };

  const loadCategories = async () => {
    const data = await fetchVideosByCategory();
    setApiCategories(data || []);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadTrending(), loadCategories()]);
    setRefreshing(false);
  };

  // initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadTrending(), loadCategories()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // auto slider
  useEffect(() => {
    if (apiVideos.length === 0) return;

    const interval = setInterval(() => {
      const next = (currentSlide + 1) % apiVideos.length;
      setCurrentSlide(next);
      scrollViewRef.current?.scrollTo({ x: next * width, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, apiVideos]);

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => navigation.navigate('VideoPlayerPublic', { video: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.videoMeta}>
          <Text style={styles.videoViews}>{item.views?.toLocaleString()} views</Text>
          <Text style={styles.videoDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={(e) => setIsAtTop(e.nativeEvent.contentOffset.y <= 0)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={isAtTop} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Olee Play</Text>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 100, height: 30, resizeMode: 'contain' }}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {apiCategories.map((cat, index) => (
            <TouchableOpacity
              key={`category-${cat?.category_id ?? index}-${index}`}
              style={[
                styles.categoryButton,
                selectedCategory === cat.category_name && styles.categoryButtonActive,
              ]}
              onPress={async () => {
                setSelectedCategory(cat.category_name);
                setLoading(true);

                try {
                  if (cat.category_name === 'All') {
                    const data = await fetchTrendingVideos();
                    setApiVideos(data);
                  } else {
                    const data = await fetchCategoricalVideos(cat.category_id);
                    setApiVideos(data);
                  }
                } catch (err) {
                  console.log('Category fetch failed:', err);
                } finally {
                  setLoading(false);
                }
              }}
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

        {/* Trending Slider */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
        >
          {apiVideos.map((video, index) => (
            <TouchableOpacity
              key={`${video?.id ?? index}-${index}`}
              style={styles.slide}
              onPress={() => navigation.navigate('VideoPlayerPublic', { video })}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.slideImage} />
              <Text style={styles.slideTitle}>{video.title} | {video.owner}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Horizontal List */}
        <FlatList
          data={apiVideos}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.videoList}
        />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: '#cb880aff' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.mainButtonText}>
            Next and Connect <Icon name="long-arrow-right" size={18} color="#000" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {(loading || refreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#cb880aff" />
        </View>
      )}
    </View>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  appTitle: { fontSize: 22, fontWeight: 'bold', color: '#cb880aff' },

  categoryScroll: { paddingVertical: 10, paddingHorizontal: 5 },
  categoryButton: {
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
  },
  categoryButtonActive: { backgroundColor: '#cb880aff' },
  categoryText: { color: '#fff', fontWeight: '600' },
  categoryTextActive: { color: '#000' },

  slider: { height: 250, marginVertical: 10 },
  slide: { width: width - 40, marginHorizontal: 20, borderRadius: 10, overflow: 'hidden' },
  slideImage: { width: '100%', height: 200 },
  slideTitle: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    color: '#fff',
    fontWeight: 'bold',
  },

  videoList: { paddingHorizontal: 10, paddingVertical: 20 },
  videoCard: {
    marginRight: 10,
    width: 160,
    backgroundColor: '#1c1c1c',
    borderRadius: 5,
    overflow: 'hidden',
  },
  videoThumbnail: { width: '100%', height: 100 },
  videoInfo: { padding: 10 },
  videoTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  videoMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  videoViews: { color: '#bbb', fontSize: 12 },
  videoDuration: { color: '#bbb', fontSize: 12 },

  bottomButtons: { position: 'absolute', bottom: 80, width: '100%', alignItems: 'center' },
  mainButton: { width: '80%', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 10 },
  mainButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { width: '80%', padding: 12, borderRadius: 25, alignItems: 'center', backgroundColor: '#fff' },
  secondaryButtonText: { color: '#333', fontWeight: '600' },

  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

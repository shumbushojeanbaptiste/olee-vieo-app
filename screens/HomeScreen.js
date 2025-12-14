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
  RefreshControl,   // ← ADD THIS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { fetchTrendingVideos,trendingVideos,fetchVideosByCategory } from "../src/data/videos";  // FIXED

import { categories } from "../src/data/category";

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apiVideos, setApiVideos] = useState([]);  
  const [apiCategories, setApiCategories] = useState([]); 
  const scrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  //refresh
  const [refreshing, setRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

const loadTrending = async () => {
  const data = await fetchTrendingVideos();
  setApiVideos(data);
};

const loadCategories = async () => {
  const data = await fetchVideosByCategory();
  setApiCategories(data);
};

const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([loadTrending(), loadCategories()]);
  setRefreshing(false);
};

  // Load API Videos
  useEffect(() => {
    const load = async () => {
      const data = await fetchTrendingVideos();
      setApiVideos(data);
    };
    load();
  }, []);

    // Load API Categories
  useEffect(() => {
    const load = async () => {
      const data = await fetchVideosByCategory();
      setApiCategories(data);
    };
    load();
  }, []);

  // Auto-slide only AFTER videos load
  useEffect(() => {
    if (apiVideos.length === 0) return;

    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % apiVideos.length;
      setCurrentSlide(nextSlide);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextSlide * width, animated: true });
      }
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
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.videoViews}>{item.views.toLocaleString()} views</Text>
          <Text style={styles.videoDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setIsAtTop(y <= 0);
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={isAtTop} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>OleePlay & Live</Text>
          <TouchableOpacity style={styles.createButton}>
            <Icon name="video-camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
                
        <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false} 
  style={styles.categoryScroll}
>
  {apiCategories.map((cat) => (
    <TouchableOpacity
      key={cat.category_id}
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


        {/* Trending Slider */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
        >
          {apiVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.slide}
              onPress={() => navigation.navigate('VideoPlayerPublic', { video })}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.slideImage} />
              <Text style={styles.slideTitle}>{video.title} | {video.owner}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Horizontal video list */}
        <FlatList
          data={apiVideos}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id}
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
          <Text style={styles.mainButtonText}>Next and Connect <Icon name="long-arrow-right" size={20} color="#fff" /></Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#fff' }]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // dark theme
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    padding: 10,
  },
  categoryScroll: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#cb880aff',
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
  },
  slider: {
    height: 250,
    marginVertical: 10,
  },
  slide: {
    width: width - 40,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  slideTitle: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  videoList: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  videoCard: {
    marginRight: 10,
    width: 160,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1c1c1c',
  },
  videoThumbnail: {
    width: '100%',
    height: 100,
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  videoViews: {
    color: '#bbb',
    fontSize: 12,
  },
  videoDuration: {
    color: '#bbb',
    fontSize: 12,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  mainButton: {
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    width: '80%',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
});

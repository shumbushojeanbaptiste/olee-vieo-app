import React, { useState, useRef, useEffect, use } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileDrawer from '../components/ProfileDrawer';
import { fetchStoreSearchVideos, fetchMyVideos, fetchInternalLatestVideos } from '../src/data/videos';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Purchased videos and pay drawer
  const [apiMyVideos, setApiMyVideos] = useState([]);
  const [videoToBuy, setVideoToBuy] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => { loadMyVideos(); loadLatestVideos(); }, []);

  const loadMyVideos = async () => {
    try {
      const data = await fetchMyVideos();
      setApiMyVideos(data || []);
    } catch (err) {
      console.log('Load my videos failed:', err?.message || err);
    }
  };

  const loadLatestVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchInternalLatestVideos();
      if (Array.isArray(data)) setResults(data);
      else setResults([]);
    } catch (err) {
      console.log('Load latest videos failed:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const isOwned = (video) => apiMyVideos.some(v => v.id === String(video.id));

  const handleVideoPress = (video) => {
    if (isOwned(video)) return navigation.navigate('VideoPlayer', { video });

    Alert.alert(
      'Purchase Video',
      `Do you want to buy "${video.title}" for ${video.prices} RWF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: () => { setVideoToBuy(video); setDrawerVisible(true); } },
      ]
    );
  };

  const handlePurchaseSuccess = (video) => {
    setApiMyVideos(prev => [video, ...prev]);
    setVideoToBuy(null);
    setDrawerVisible(false);
  }; 

  const runSearch = async (q) => {
    const trimmed = (q || '').trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    setLoading(true);
    const data = await fetchStoreSearchVideos(trimmed);
    setResults(data);
    setLoading(false);
  };
  // want laodin video if opening this screen fetchInternalLatestVideos
  useEffect(() => {
    const loadLatestVideos = async () => {
      try {
        const data = await fetchInternalLatestVideos();
        setResults(data);
      } catch (err) {
        console.log('Load latest videos failed:', err?.message || err);
      }
    };
    loadLatestVideos();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
    >
      <View style={styles.thumbnailWrapper}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.duration && (
          <View style={styles.durationBox}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>{item.views?.toLocaleString() || 0} views</Text>
        {!isOwned(item) && (
          <Text style={styles.purchaseLabel}>{item.prices} RWF</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search videos..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => runSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }} style={styles.clearBtn}>
            <Icon name="times" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      ) : results.length === 0 && query.trim() ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No results found for  "{query.trim()}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
          contentContainerStyle={{ padding: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        videoToBuy={videoToBuy}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

       {/* Bottom navigation menu */}
                 <View style={styles.bottomNav}>
                   <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
                     <Icon name="home" size={20} color="#fff" />
                     <Text style={styles.navLabel}> </Text>
                   </TouchableOpacity>
           
                   <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
                     <Icon name="user" size={20} color="#fff" />
                     <Text style={styles.navLabel}> </Text>
                   </TouchableOpacity>
           
                   <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyVideo')}>
                     <Icon name="film" size={20} color="#fff" />
                     <Text style={styles.navLabel}> </Text>
                   </TouchableOpacity>
           
                   <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search') }>
                     <Icon name="search" size={20} color="#fff" />
                     <Text style={styles.navLabel}> </Text>
                   </TouchableOpacity>
                 </View>


    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 12,
    backgroundColor: '#666',
    borderRadius: 30,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#fff',
    height: 40,
  },
  clearBtn: { padding: 6 },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbnailWrapper: { position: 'relative' },
  thumbnail: { width: 140, height: 80 },
  durationBox: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#fff', fontSize: 12 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 15, fontWeight: '700' },
  meta: { color: '#bbb', marginTop: 4, fontSize: 13 },
  purchaseLabel: { color: '#cb880a', fontSize: 14, marginTop: 6, fontWeight: 'bold' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#bbb', fontSize: 16 },
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
});

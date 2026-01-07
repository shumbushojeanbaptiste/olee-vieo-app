import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchMyVideos } from '../src/data/videos';

export default function MyVideoScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchMyVideos();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Load my videos failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => navigation.navigate('VideoPlayer', { video: item })}
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
        <Text style={styles.meta}>
          {item.views?.toLocaleString() || 0} views
        </Text>
        {item.prices && (
          <Text style={styles.price}>{item.prices} RWF</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#cb880a" />
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>You have no videos yet.</Text>
            </View>
          )}
        />
      )}

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="home" size={20} color="#cb880a" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={20} color="#cb880a" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="film" size={20} color="#cb880a" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={20} color="#cb880a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#fff', fontSize: 12 },

  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 15, fontWeight: '700' },
  meta: { color: '#bbb', marginTop: 4, fontSize: 13 },
  price: { color: '#cb880a', fontSize: 14, marginTop: 6, fontWeight: 'bold' },

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
    elevation: 6,
  },
  navButton: { alignItems: 'center', justifyContent: 'center' },
});

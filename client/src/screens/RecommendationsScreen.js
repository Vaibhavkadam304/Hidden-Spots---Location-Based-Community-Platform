// client/src/screens/RecommendationsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import { getNearbySpots } from '../../services/api';

function SpotCard({ spot, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {spot.images[0] && (
        <Image source={{ uri: spot.images[0] }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{spot.name}</Text>
        <Text style={styles.cardRating}>
          {spot.compositeRating} ★
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RecommendationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [spots, setSpots]     = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync();
        const res = await getNearbySpots(
          coords.latitude,
          coords.longitude
        );
        // sort descending by compositeRating
        const sorted = res.data.sort(
          (a, b) => b.compositeRating - a.compositeRating
        );
        setSpots(sorted);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex:1 }} size="large" />;
  }

  return (
    <FlatList
      data={spots}
      keyExtractor={s => s._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <SpotCard
          spot={item}
          onPress={() =>
            navigation.navigate('SpotDetails', { spotId: item._id })
          }
        />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          No spots found nearby.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2
  },
  cardImage: {
    width: 100,
    height: 100
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  cardRating: {
    fontSize: 14,
    color: '#777'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#555'
  }
});

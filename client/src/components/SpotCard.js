import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import RatingBar from './RatingBar';

export default function SpotCard({ spot, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: spot.images[0] }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.name}>{spot.name}</Text>
        <RatingBar rating={spot.compositeRating} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', margin: 8, background: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 2 },
  thumb: { width: 80, height: 80 },
  info: { flex: 1, padding: 8, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' }
});
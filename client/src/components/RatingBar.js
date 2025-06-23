import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function RatingBar({ rating, onRate }) {
  const fullStars = Math.round(rating);
  return (
    <View style={styles.container}>
      {[1,2,3,4,5].map(i => (
        <TouchableOpacity key={i} onPress={() => onRate && onRate(i)}>
          <Entypo name={i <= fullStars ? 'star' : 'star-outlined'} size={16} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flexDirection: 'row' } });
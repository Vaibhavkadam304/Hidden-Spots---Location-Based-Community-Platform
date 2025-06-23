// client/src/screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Text,
  Platform,
  Alert,
  Button,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbySpots } from '../../services/api';
import { Picker } from '@react-native-picker/picker';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        const res = await getNearbySpots(loc.coords.latitude, loc.coords.longitude);
        setSpots(res.data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to load hidden spots.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !location) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  const filteredSpots = spots.filter(spot => {
    const matchesCategory =
      filterCategory === 'All' || spot.category === filterCategory;
    const matchesSearch =
      spot.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Recommended Feed Button */}
      <View style={styles.topButtons}>
        <Button
          title="Recommended"
          onPress={() => navigation.navigate('Recommendations')}
        />
      </View>

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name…"
        value={search}
        onChangeText={setSearch}
      />

      {/* Category picker */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Category:</Text>
        <Picker
          selectedValue={filterCategory}
          onValueChange={setFilterCategory}
          style={styles.picker}
          mode={Platform.OS === 'ios' ? 'dropdown' : 'dialog'}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Romantic" value="Romantic" />
          <Picker.Item label="Serene" value="Serene" />
          <Picker.Item label="Creative" value="Creative" />
        </Picker>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {filteredSpots.map(spot => (
          <Marker
            key={spot._id}
            coordinate={{
              latitude: spot.location.coordinates[1],
              longitude: spot.location.coordinates[0],
            }}
            pinColor={
              spot.category === 'Romantic'
                ? 'red'
                : spot.category === 'Serene'
                ? 'blue'
                : 'green'
            }
            onPress={() =>
              navigation.navigate('SpotDetails', { spotId: spot._id })
            }
          >
            <Callout>
              <Text style={{ fontWeight: '600' }}>{spot.name}</Text>
              <Text style={{ color: '#555', fontSize: 12 }}>
                Tap for details
              </Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Add Spot button */}
      <View style={styles.addButtonContainer}>
        <Button title="+ Add Spot" onPress={() => navigation.navigate('AddSpot')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1 },
  map: { flex: 1 },
  topButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 3,
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
  },
  searchInput: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 2,
  },
  pickerWrapper: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  pickerLabel: { marginRight: 8 },
  picker: { flex: 1 },
  addButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 2,
  },
});

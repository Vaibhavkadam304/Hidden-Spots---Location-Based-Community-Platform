// client/src/screens/AddSpotScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addSpot } from '../../services/api';
import { Picker } from '@react-native-picker/picker';

export default function AddSpotScreen({ navigation }) {
  const [name, setName] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState('Romantic');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    console.log('🔍 pickImage handler started');
    Alert.alert('Debug', 'pickImage invoked');

    // 1) Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Need access to your photos.');
      return;
    }

    // 2) Launch picker
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    console.log('📸 picker assets:', assets, 'canceled:', canceled);
    Alert.alert('Debug', `Picker canceled: ${canceled}`);

    // 3) Set URI if selected
    if (!canceled && assets && assets.length > 0) {
      const uri = assets[0].uri;
      setImageUri(uri);
      console.log('✅ imageUri set to', uri);
      Alert.alert('Debug', `Image selected: ${uri}`);
    }
  };

  const handleSubmit = async () => {
    if (!name || !story || !imageUri) {
      Alert.alert('Missing info', 'Please fill all fields and pick an image.');
      return;
    }

    let loc;
    try {
      loc = await Location.getCurrentPositionAsync({});
    } catch (err) {
      console.error('🚨 Location error:', err);
      Alert.alert('Error', 'Could not fetch location.');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('story', story);
    form.append('category', category);
    form.append('lat', loc.coords.latitude.toString());
    form.append('lng', loc.coords.longitude.toString());
    form.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      await addSpot(form);
      Alert.alert('Success', 'Spot added!');
      navigation.goBack();
    } catch (err) {
      console.error('🚨 addSpot error:', err);
      Alert.alert('Error', 'Failed to add spot.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Spot Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
      >
        <Picker.Item label="Romantic" value="Romantic" />
        <Picker.Item label="Serene"   value="Serene" />
        <Picker.Item label="Creative" value="Creative" />
      </Picker>

      <TextInput
        placeholder="Your Story"
        value={story}
        onChangeText={setStory}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.debugButton} onPress={pickImage}>
        <Text style={styles.debugButtonText}>📷 Pick Image (Debug)</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Spot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  picker: {
    marginVertical: 8,
  },
  debugButton: {
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 4,
  },
  debugButtonText: {
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 4,
  },
  submitButton: {
    padding: 14,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginVertical: 12,
    borderRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

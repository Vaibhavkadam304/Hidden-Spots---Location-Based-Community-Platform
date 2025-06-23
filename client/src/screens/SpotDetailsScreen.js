// client/src/screens/SpotDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  Switch
} from 'react-native';
import { getSpotById, getComments, addComment, rateSpot } from '../../services/api';

export default function SpotDetailsScreen({ route, navigation }) {
  const { spotId } = route.params;
  const [spot, setSpot]             = useState(null);
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');

  // Anonymous/Public toggle
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [username, setUsername]       = useState('');

  // Rating states (omitted for brevity)...

  useEffect(() => {
    async function load() {
      try {
        const [{ data: s }, { data: c }] = await Promise.all([
          getSpotById(spotId),
          getComments(spotId),
        ]);
        setSpot(s);
        setComments(c);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not load spot details.');
      }
    }
    load();
  }, [spotId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Empty', 'Please enter a comment.');
      return;
    }
    if (!isAnonymous && !username.trim()) {
      Alert.alert('Username required', 'Please enter your name or switch to anonymous.');
      return;
    }
    try {
      await addComment(spotId, {
        text: newComment,
        isAnonymous,
        author: isAnonymous ? undefined : username.trim()
      });
      const { data: refreshed } = await getComments(spotId);
      setComments(refreshed);
      setNewComment('');
      if (!isAnonymous) setUsername('');
    } catch (err) {
      console.error('addComment error:', err);
      Alert.alert('Error', 'Could not post comment.');
    }
  };

  if (!spot) {
    return <ActivityIndicator style={{ flex:1 }} size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... existing Spot header, gallery, stories, ratings ... */}

      <Text style={styles.section}>Comments</Text>
      {comments.map(c => (
        <View key={c._id} style={styles.comment}>
          <Text style={styles.commentAuthor}>
            {c.isAnonymous ? 'Anonymous' : c.author}
          </Text>
          <Text>{c.text}</Text>
        </View>
      ))}

      {/* Anonymous/Public toggle */}
      <View style={styles.toggleRow}>
        <Text>Post as Anonymous</Text>
        <Switch
          value={isAnonymous}
          onValueChange={setIsAnonymous}
        />
        <Text>Post Publicly</Text>
      </View>

      {/* Username field (shown only in public mode) */}
      {!isAnonymous && (
        <TextInput
          placeholder="Your name"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      )}

      {/* Comment input */}
      <TextInput
        placeholder="Add a comment…"
        value={newComment}
        onChangeText={setNewComment}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleAddComment}>
        <Text style={styles.buttonText}>Submit Comment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { padding:16 },
  section:      { marginTop:24, fontSize:18, fontWeight:'600' },
  comment:      { paddingVertical:8, borderBottomWidth:1, borderColor:'#eee' },
  commentAuthor:{ fontWeight:'600', marginBottom:4 },
  toggleRow:    {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginVertical:12
  },
  input:        {
    borderWidth:1,
    borderColor:'#ccc',
    padding:8,
    borderRadius:4,
    marginVertical:8
  },
  button:       {
    backgroundColor:'#007bff',
    padding:12,
    borderRadius:6,
    alignItems:'center',
    marginTop:12
  },
  buttonText:   { color:'white', fontWeight:'600' }
});

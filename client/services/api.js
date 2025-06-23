// client-1/services/api.js
import axios from 'axios';

// since you're on a real device and your .env uses PORT=5000:
const BASE_URL = 'http://192.168.1.6:5000';

export const getNearbySpots = (lat, lng, radius = 5000) =>
  axios.get(`${BASE_URL}/api/spots/nearby`, { params:{ lat, lng, radius } });

export const getSpotById = id =>
  axios.get(`${BASE_URL}/api/spots/${id}`);

export const addSpot = formData =>
  axios.post(`${BASE_URL}/api/spots`, formData, {
    headers:{ 'Content-Type':'multipart/form-data' },
  });

export const rateSpot = (id, ratings) =>
  axios.post(`${BASE_URL}/api/spots/${id}/rate`, ratings);

export const getComments = id =>
  axios.get(`${BASE_URL}/api/spots/${id}/comments`);

export const addComment = (id, commentObj) =>
  axios.post(`${BASE_URL}/api/spots/${id}/comments`, commentObj);

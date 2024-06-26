import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.1.153:8000/api',
  responseType:'json',
  withCredentials:true
});

ApiManager.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);



export const user_register = async (data) => {
  try {
    const result = await ApiManager.post('/users/register/', data);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};



export const fetchCommunities = () => {
  return ApiManager.get('/communities/');
};

export const joinCommunity = (communityId) => {
  return ApiManager.post(`/communities/${communityId}/join/`);
};

export const leaveCommunity = (communityId) => {
  return ApiManager.post(`/communities/${communityId}/leave/`);
};

export const fetchCommunityDetails = (communityId) => {
  return ApiManager.get(`/communities/${communityId}/`);
};

export const fetchMessages = (communityId) => {
  return ApiManager.get(`/messages/?community=${communityId}`);
};

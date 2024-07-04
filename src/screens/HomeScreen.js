import { View,Alert, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity} from 'react-native';
import React, { useLayoutEffect, useContext,UserType, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [communities, setCommunities] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>IzolaCommuno Chat</Text>
      ),

      headerRight:()=> <Button style={styles.status} onPress={handleSignOut} title="Sign Out"/>

    
        });
  }, []);

useEffect(() => {
  fetchCommunities();
}, []);
useEffect(() => {
  checkAuthentication();
}, []);

const checkAuthentication = async () => {
  const token = await AsyncStorage.getItem('AccessToken');
  if (token) {
    setIsAuthenticated(true);
  }
};



const fetchCommunities = async () => {
  try {
    const token = await AsyncStorage.getItem('AccessToken');
    if (!token) throw new Error("No access token found");

    const response = await axios.get('http://192.168.1.23:8000/api/communities/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setCommunities(response.data);
  } catch (error) {
    console.error("Fetch Communities Error:", error.response ? error.response.data : error.message);
  }
};

const handleSignOut = async () => {
  await AsyncStorage.removeItem('AccessToken');
  setIsAuthenticated(false);
  navigation.navigate('Login');
};

const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('RefreshToken');
  if (!refreshToken) throw new Error("No refresh token found");

  try {
    const response = await axios.post('http://192.168.1.23:8000/api/token/refresh/', {
      refresh: refreshToken
    });

    const { access, refresh } = response.data;
    await AsyncStorage.setItem('AccessToken', access);
    await AsyncStorage.setItem('RefreshToken', refresh);
    return access;
  } catch (error) {
    console.error("Token Refresh Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const handleJoinLeave = async (item, action) => {
  try {
    let token = await AsyncStorage.getItem('AccessToken');
    if (!token) throw new Error("No access token found");

    let response = await axios.post(`http://192.168.1.23:8000/api/communities/${item.id}/${action}/`, {}, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 200) {
      setCommunities(prevCommunities => prevCommunities.map(community =>
        community.id === item.id ? { ...community, joined: action === 'join' } : community
      ));
    } else if (response.status === 401) {
      token = await refreshToken();
      response = await axios.post(`http://192.168.1.23:8000/api/communities/${item.id}/${action}/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCommunities(prevCommunities => prevCommunities.map(community =>
          community.id === item.id ? { ...community, joined: action === 'join' } : community
        ));
      } else {
        console.error("Join/Leave Error:", response.data);
      }
    } else {
      console.error("Join/Leave Error:", response.data);
    }
  } catch (error) {
    console.error("Join/Leave Error:", error.response ? error.response.data : error.message);
  }
};

const navigateToCommunityDetail = (item) => {
  if (item.joined) {
    navigation.navigate('Chat', { communityId: item.id });
  } else {
    Alert.alert(`You need to join ${item.name} community to view details.`);
    console.log(`You need to join ${item.name} community to view details.`);
  }
};


const renderItem = ({ item }) => (
  <View style={styles.communityItem}>
    <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
    <View style={styles.icon}>
          <Text style={styles.iconText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
    </TouchableOpacity>
    <View style={styles.textContainer}>
      <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
    </View>
    <Button style={styles.status} title={item.joined ? 'Leave' : 'Join'} onPress={() => handleJoinLeave(item, item.joined ? 'leave' : 'join')} />
    </View>
);

return (
  <View style={styles.container}>
      <View>
    <Text style={{ fontSize: 16}}>Select Your Group and join community Chats</Text>

    </View>
    <FlatList
      data={communities}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16,
},
communityItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  elevation: 3,
},
icon: {
  width: 50,
  height: 50,
  marginRight: 16,
  backgroundColor: '#11cfc5',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25,
  color: '#fff',

},
textContainer: {
  flex: 1,
},
name: {
  fontSize: 18,
  fontWeight: 'bold',
},
description: {
  color: '#666',
},
status:{
  backgroundColor: '#11cfc5',
  borderRadius: 15,
},
});
export default HomeScreen



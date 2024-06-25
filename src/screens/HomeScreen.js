import { View, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity} from 'react-native';
import React, { useLayoutEffect, useContext,UserType, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { ApiManager } from '../api/api';


const HomeScreen = () => {
  const navigation = useNavigation();
  // const { communityDetails, setCommunityDetails } = useContext(UserType);

  const [communities, setCommunities] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>IzolaCommuno Chat</Text>
      ),

      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    
        });
  }, []);

useEffect(() => {
  fetchCommunities();
}, []);

const fetchCommunities = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const response = await axios.get('http://192.168.1.153:8000/api/communities/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setCommunities(response.data);
  } catch (error) {
    console.error("Fetch Communities Error:", error.response ? error.response.data : error.message);
  }
};


const handleJoinLeave = async (item) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    const response = await axios.post(`http://192.168.1.153:8000/api/communities/${item.id}/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    fetchCommunities();
  } catch (error) {
    console.error(error);
  }
};

const navigateToCommunityDetail = (item) => {
  if (item.joined) {
    navigation.navigate('Chat', { communityId: item.id });
  } else {
    console.log(`You need to join ${item.name} community to view details.`);
  }
};


const renderItem = ({ item }) => (
  <View style={styles.communityItem}>
    <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
      <Image
        source={{ uri: 'http://192.168.1.153:8000/' + item.icon }}
        style={styles.icon}
        onError={(error) => console.error('Image loading error:', error)}
      />
    </TouchableOpacity>
    <View style={styles.textContainer}>
      <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToCommunityDetail(item)}>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
    </View>
    <Button title={item.joined ? 'Leave' : 'Join'} onPress={() => handleJoinLeave(item)} />
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
});
export default HomeScreen



// screens/CommunityScreen.js
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';


const CommunityScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

    useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Find Your Community Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons onPress={() => navigation.navigate("Messages")} name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons
            onPress={() => navigation.navigate("CommunityDetail")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://192.168.100.170:8000/api/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);
  return (
    <View>
    <View>
    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Select Your Group Chart Here and Keep Chatting</Text>

    </View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      },
      text: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'orange',
      },
      navBarText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'orange',
      },
      button: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        borderRadius: 5,
        marginTop: 25,
      },
      textButton: {
        color: 'white',
        fontWeight: '700',
      },
      navBarBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'grey',
        padding: 5,
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: 5
      },
      innerContainer: {
        flex: 7
      },
      checkDeviceButton: {
        padding: 10,
        margin: 10
      }
});

export default CommunityScreen;

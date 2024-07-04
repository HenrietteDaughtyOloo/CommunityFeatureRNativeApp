import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import WebSocket from 'react-native-websocket';
import CryptoJS from 'crypto-js';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const token = localStorage.getItem('token');
    const socket = new WebSocket(`ws://http://192.168.1.23:8000/ws/chat/${community_id}/?token=${token}`);    
    const { communityId } = route.params;
    const secretKey = 'alFocG1CuOmiEXBakswlcxHO9Uhx8dDoJbPXIFllpPw=';

    useEffect(() => {
        fetchMessages();
        const socketUrl = `ws://192.168.1.23:8000/ws/chat/${communityId}/`;
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const decryptedMessage = decryptMessage(data.message.content, secretKey);
            setMessages((prevMessages) => [...prevMessages, { ...data.message, content: decryptedMessage }]);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [communityId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://192.168.1.23:8000/api/messages/?community_id=${communityId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    console.log('Authorization error: User not authenticated');
                } else if (error.response && error.response.status === 404) {
                    console.log('Resource not found');
                } else {
                    console.log('Other Axios error:', error.message);
                }
            } else {
                console.error('Unknown error:', error);
            }
        }
    };
    
    const encryptMessage = (message, secretKey) => {
        return CryptoJS.AES.encrypt(message, secretKey).toString();
    };

    const decryptMessage = (encryptedMessage, secretKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const sendMessage = async () => {
        if (newMessage.trim()) {
            const encryptedMessage = encryptMessage(newMessage, secretKey);
            socketRef.current.send(JSON.stringify({
                message: encryptedMessage,
            }));
            setNewMessage('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.messageItem}>
            <Text style={styles.sender}>{item.sender.username}</Text>
            <Text style={styles.timestamp}>{new Date(item.sent_at).toLocaleString()}</Text>
            <Text style={styles.message}>{item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messageItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#11cfc5',
        borderRadius: 5,
    },
    sender: {
        fontWeight: 'bold',
    },
    message: {
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#000',
        padding: 5,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
});

export default ChatScreen;

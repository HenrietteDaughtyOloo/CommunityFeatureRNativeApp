import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { user_login } from '../api/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);


  const checkPasswordValidity = value => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain Whitespaces.';
    }
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
      return 'Password must be 8-16 Characters Long.';
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character.';
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character.';
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return 'Password must contain at least one Digit.';
    }

    return null;
  };


  const handleLogin = async () => {
    const checkPassword = checkPasswordValidity(password);
  
    if (!username || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  
    if (!checkPassword) {
    try {
      
      const response = await axios.post('http://192.168.1.23:8000/api/users/login/', {
        username,
        password,
      });

      if (response.status === 200 && response.data.access) {
        await AsyncStorage.setItem('AccessToken', response.data.access);
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Please check your email and password.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    }
  };

  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Already{'\n'}have an{'\n'}Account?</Text>
          <Image source={require('../images/comm.png')} style={styles.heroImage} />
        </View>

        <Input
          placeholder="Username"
          leftIcon={<Icon name="envelope" size={24} color="black" />}
          containerStyle={styles.inputContainer}
          value={username}
          onChangeText={setUsername}
          // onChangeText={text => handleCheckEmail(text)}
          // keyboardType=""
          // autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          leftIcon={<Icon name="lock" size={24} color="black" />}
          secureTextEntry={!seePassword}
          containerStyle={styles.inputContainer}
          value={password}
          onChangeText={setPassword}
          />
        <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
          <Text style={styles.forgotPasswordText}>{seePassword ? 'Show Password' : 'Hide Password'}</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity           onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerText}>New user? Register Now</Text>
        </TouchableOpacity>

        <View style={styles.otherMethodsContainer}>
          <View style={styles.line} />
          <Text style={styles.otherMethodsText}>Use other Methods</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <Image source={require('../images/google.png')} style={[styles.socialIcon, styles.googleIcon]} />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addImageContainer} onPress={() => navigation.goBack()}>
        <Image source={require('../images/back.png')} style={styles.addImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11cfc5',
    paddingHorizontal:20,

  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    
  },
  heroImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '90%',
    marginVertical: 10,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 27,
  },
  registerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 17,
    marginTop: 20,
  },
  otherMethodsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
  },
  otherMethodsText: {
    width: 'auto',
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  googleIcon: {
    marginLeft: 10,
  },
  addImageContainer: {
    position: 'absolute',
    bottom: 30,
    right: 0,
  },
  addImage: {
    width: 50,
    height: 50,
  },
});

export default LoginScreen;

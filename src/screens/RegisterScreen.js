import React, { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useAuth } from '../context/AuthContext'
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript';
import { user_register } from '../api/api';

const RegisterScreen = ({ navigation }) => {
  const { onRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState('')
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const handleCheckEmail = text => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

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

  const generateKeys = async () => {
    const identityKeyPair = await libsignal.KeyHelper.generateIdentityKeyPair();
    const registrationId = await libsignal.KeyHelper.generateRegistrationId();
    const preKeys = await libsignal.KeyHelper.generatePreKeys(0, 100);
    const signedPreKey = await libsignal.KeyHelper.generateSignedPreKey(identityKeyPair, 0);
  
    return {
      identityKeyPair,
      registrationId,
      preKeys,
      signedPreKey,
    };
  };

  const handleRegister = async () => {
    const checkPassword = checkPasswordValidity(password);
  
    if (!username || !email || !phone_number || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  
    if (!checkPassword) {
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
  
      try {
        const result = await user_register({
          username,
          email: email.toLowerCase(),
          password,
          phone_number,
        });
  
        if (result.access && result.refresh) {
          await AsyncStorage.setItem('AccessToken', result.access);
          await AsyncStorage.setItem('RefreshToken', result.refresh);
          Alert.alert('Success', 'Registration successful', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        } else {
          console.error(result);
          Alert.alert('Error', 'Registration failed');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'An error occurred during registration');
      }
    } else {
      alert(checkPassword);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Register to Proceed!</Text>
          <Image source={require('../images/comm.png')} style={styles.headerImage} />
        </View>

        <Card containerStyle={styles.card}>
          <Input
            placeholder="Name"
            leftIcon={<Icon name="user" size={24} color="black" />}
            containerStyle={styles.inputContainer}
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Email"
            leftIcon={<Icon name="envelope" size={24} color="black" />}
            containerStyle={styles.inputContainer}
            value={email}
            onChangeText={text => handleCheckEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Mobile Number"
            leftIcon={<Icon name="phone" size={24} color="black" />}
            containerStyle={styles.inputContainer}
            value={phone_number}
            onChangeText={setMobile}
          />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="lock" size={24} color="black" />}
            secureTextEntry={!seePassword}
            containerStyle={styles.inputContainer}
            value={password}
            onChangeText={setPassword}
          />
        <Input
          placeholder="Confirm Password"
          leftIcon={<Icon name="lock" size={24} color="black" />}
          secureTextEntry={!seePassword}
          containerStyle={styles.inputContainer}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          
        />
        <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
          <Text style={styles.forgotPasswordText}>{seePassword ? 'Show Password' : 'Hide Password'}</Text>
        </TouchableOpacity>

          
          <Button
            title="Register"
            buttonStyle={styles.registerButton}
            onPress={handleRegister}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an account?</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.otherMethodsContainer}>
          <View style={styles.line} />
          <Text style={styles.otherMethodsText}>Use other Methods</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <Image source={require('../images/google.png')} style={styles.socialIcon} />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.backImageContainer} onPress={() => navigation.goBack()}>
        <Image source={require('../images/back.png')} style={styles.backImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#11cfc5',
    fontSize: 25,
  },
  headerImage: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  card: {
    width: '80%',
    borderRadius: 15,
    paddingBottom: 1,
  },
  inputContainer: {
    marginVertical: 0,
    color: '#11cfc5',
  },
  registerButton: {
    backgroundColor: '#11cfc5',
    borderRadius: 15,
    marginTop: 10,
  },
  loginText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#11cfc5',
    fontSize: 17,
    marginTop: 20,
  },
  otherMethodsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#11cfc5',
  },
  otherMethodsText: {
    width: 'auto',
    color: '#11cfc5',
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  socialIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  googleIcon: {
    marginLeft: 10,
  },
  sideBg: {
    position: 'absolute',
    top: 20,
    right: 0,
  },
  sideBgImage: {
    width: 15,
    height: '100%',
  },
  backImageContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
  },
  backImage: {
    width: 60,
    height: 60,
  },
});

export default RegisterScreen;
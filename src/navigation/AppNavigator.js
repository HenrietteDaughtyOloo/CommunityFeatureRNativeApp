import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CommunityScreen from '../screens/CommunityScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { Button } from 'react-native-elements';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/Splash';
import ChatScreen from '../screens/ChatScreen';


const Stack = createStackNavigator();

export default function AppNavigator(){
  return(
    <AuthProvider>
    <Layout></Layout>
    </AuthProvider>
  )
}

export const Layout = () => {
  const {authState, onLogout} = useAuth();
  return(
  <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Izola Community" component={SplashScreen} />
    {authState?.authenticated ? (
    <Stack.Screen name="Home" component={HomeScreen} options={{
      headerRight:()=> <Button onPress={onLogout} title="Sign Out"/>
    }}></Stack.Screen>) :
    <Stack.Screen name="Registration" component={RegisterScreen}></Stack.Screen>}
    
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="CommunityList" component={CommunityScreen} />
    </Stack.Navigator>
  </NavigationContainer>
)
};
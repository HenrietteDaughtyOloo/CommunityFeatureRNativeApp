import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://192.168.1.153:8000/api';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
            setIsLoading(false);
        }
        loadToken();
    }, []);

    const register = async (email, password, username, phone_number) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/users/register/`, { email, password, username, phone_number });
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setIsLoading(false);
            console.error("Registration Error:", error);    
      if (error.response && error.response.data && error.response.data.detail) {
        return { error: true, msg: error.response.data.detail };
      } else {
        return { error: true, msg: "Registration failed" };
      }
    }
  };

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/users/login/`, { username, password });
            setAuthState({
                token: response.data.access,
                authenticated: true
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            await SecureStore.setItemAsync(TOKEN_KEY, response.data.access);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setIsLoading(false);
            return { error: true, msg: error.response.data.detail };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token: null,
            authenticated: false
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        isLoading
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

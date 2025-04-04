import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import Register from './register/Register';
import Login from './login/Login';

export default function Index() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [componentType, setComponentType] = useState<string>('Login');

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsLoading(false);
            if (token) {
                router.replace('/home');
            }
        };
        checkAuth();
    }, []);

    if (isLoading) return null;


    return (
        componentType === 'register' ? <Register setComponentType={setComponentType} /> : <Login setComponentType={setComponentType} />
    );
}


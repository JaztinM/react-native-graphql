import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import Register from './register';
import Login from './login';

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [componentType, setComponentType] = useState('Login');

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


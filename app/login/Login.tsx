import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../graphql/mutations';
import styles from './login.styles';


export default function Login({ setComponentType }: { setComponentType: (type: string) => void }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { loading }] = useMutation(CREATE_USER);

    const handleLogin = async () => {
        if (email && password) {
            try {
                await login({
                    variables: {
                        username: email,
                    }
                });
            } catch (e) {
                alert(e);
            }

            await AsyncStorage.setItem('token', 'dummy-token');
            await AsyncStorage.setItem('username', email);
            router.replace('/home');
        } else {
            alert('Please fill in both fields');
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Text style={styles.register}>
                    No Account Yet?{' '}
                    <Text style={styles.registerLink} onPress={() => setComponentType('register')}>
                        Register Here
                    </Text>
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

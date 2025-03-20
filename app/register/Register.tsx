import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
import { CREATE_USER } from '../graphql/mutations';
import { useMutation } from '@apollo/client';
import styles from './register.styles';

export default function Register({ setComponentType }: { setComponentType: (type: string) => void }) {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [createUser, { loading }] = useMutation(CREATE_USER);

    const handleRegister = async () => {
        if (password && username) {
            try {
                const { data } = await createUser({
                    variables: {
                        username: username,
                    }
                })
                alert(`User created successfully ${data}`);
            } catch (e) {
                alert(e);
            }
        } else {
            alert('Please fill in both fields');
        }
    };


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
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
                    <Text style={styles.registerLink} onPress={() => setComponentType('login')}>
                        Already have an account?
                    </Text>
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
export default function Login({ setComponentType }: { setComponentType: (type: string) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (email && password) {
            await AsyncStorage.setItem('token', 'dummy-token');
            router.replace('/home');
        } else {
            alert('Please fill in both fields');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, maxWidth: 320, alignSelf: 'center', width: '100%' },
    title: { fontSize: 24, marginBottom: 30, fontWeight: '600' },
    register: { fontSize: 12, alignSelf: 'flex-start', marginTop: -7, marginLeft: 2 },
    registerLink: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        maxWidth: 300
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        maxWidth: 300
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
});
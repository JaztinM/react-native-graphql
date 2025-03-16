import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
import { CREATE_USER } from '@/utils/graphqlQueries';
import { useMutation } from '@apollo/client';

export default function Register({ setComponentType }: { setComponentType: (type: string) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

    const handleRegister = async () => {
        if (email && password && username) {
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
                    <Text style={styles.registerLink} onPress={() => setComponentType('login')}>
                        Already have an account?
                    </Text>
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        maxWidth: 320,
        alignSelf: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
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
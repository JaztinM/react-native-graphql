import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { Dimensions } from 'react-native';
import { Message } from '@/types';

export default function Messages() {

    const myId = '1';
    const { sender_id } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender_id: '1', receiver_id: '2', username: 'John Doe', message: 'Hello, how are you?' },
        { id: '2', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you2?' },
        { id: '3', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you3?' },
        { id: '4', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you4?' },
        { id: '5', sender_id: '2', receiver_id: '1', username: 'JohnDoe2', message: 'Hello, how are you5?' },
        { id: '6', sender_id: '3', receiver_id: '2', username: 'JohnDoe3', message: 'Hello, how are you6?' },
        { id: '7', sender_id: '4', receiver_id: '2', username: 'JohnDoe4', message: 'Hello, how are you7?' }
    ]);
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {

        if (sender_id) {
            const data = messages.filter((message) => message.sender_id === sender_id);
            navigation.setOptions({ title: `${data[0].username}`, headerShown: true });
        } else {
            navigation.setOptions({ title: "Loading...", headerShown: true });
        }

    }, [navigation, sender_id]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const newMessage = { id: `${messages.length + 1}`, sender_id: myId, message, username: 'Jasper', receiver_id: `${sender_id}` };
        setMessages([newMessage, ...messages]);
        setMessage('');
    };

    const ourMessages = messages.filter((message) => (message.sender_id === myId && message.receiver_id === sender_id) || (message.sender_id === sender_id && message.receiver_id === myId));


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <FlatList
                style={{ flexGrow: 1, padding: 10, overflow: 'scroll', display: 'flex', }}
                data={ourMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender_id === myId ? styles.myMessage : styles.theirMessage]}>
                        <Text style={styles.messageText}>{item.message}</Text>
                    </View>
                )}
                inverted // Scrolls from bottom to top automatically
            />

            {/* Sticky Input Field */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#f5f5f5', display: 'flex', flex: 1 },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '75%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#a5a5a5',
    },
    messageText: { color: '#fff', fontSize: 16 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 20, borderColor: '#ddd' },
    sendButton: { marginLeft: 10, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#007bff', borderRadius: 20 },
    sendButtonText: { color: '#fff', fontSize: 16 },
});
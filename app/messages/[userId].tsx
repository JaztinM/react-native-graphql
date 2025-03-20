import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES } from '../graphql/queries';
import { SEND_MESSAGE } from '../graphql/mutations';
import styles from './messages.styles';
import { getMyId } from '@/utils/getMyId';
import { Message } from '@/types';

export default function Messages() {

    const { isAuthenticated, isLoading } = useAuthCheck();
    const { userId } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]);

    const [myId, setMyId] = useState<string | null>(null);
    useEffect(() => {
        getMyId().then(setMyId);
    }, []);


    const { data: userMessages, loading: userLoading, } = useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId }, skip: !myId });
    const { data: myMessages, loading: myLoading, } = useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId }, skip: !myId });
    const [message, setMessage] = useState<string>('');

    const [onSendMessage, { loading: sendMessageLoading }] = useMutation(SEND_MESSAGE, {
        update(cache, { data: { sendMessage } }) {
            if (!sendMessage) return;
            cache.updateQuery(
                { query: GET_MESSAGES, variables: { sender_Id: myId, receiver_Id: userId } },
                (existingData) => ({
                    messages: [...(existingData?.messages || []), sendMessage],
                })
            );
        },
    });

    const messages: Message[] = useMemo(() => {
        const mergedMessages = [
            ...(userMessages?.messages || []),
            ...(myMessages?.messages || [])
        ];

        return mergedMessages.sort((a, b) => b.id - a.id);
    }, [userMessages, myMessages]);



    useEffect(() => {
        navigation.setOptions({
            title: userId ? `User ${userId}` : "Loading...",
            headerShown: true
        });
    }, [userId, navigation]);

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessage('');
        onSendMessage({
            variables: {
                senderId: String(myId),
                receiverId: String(userId),
                message: message
            }
        });
    };


    if (isLoading || userLoading || myLoading || !myId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <FlatList
                style={{ flexGrow: 1, padding: 10, overflow: 'scroll', display: 'flex', }}
                data={messages}
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
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={sendMessageLoading}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

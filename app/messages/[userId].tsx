import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { Dimensions } from 'react-native';
import { Message } from '@/types';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE, MESSAGE_SUBSCRIPTION } from '@/utils/graphqlQueries';
import styles from './messages.styles';

export default function Messages() {

    const { isAuthenticated, isLoading } = useAuthCheck();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]);

    const myId = '1';
    const { userId } = useLocalSearchParams();

    const { data: userMessages, loading: userLoading, error: userError } = useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId } });
    const { data: myMessages, loading: myLoading, error: myError } = useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId } });
    const [onSendMessage, { data: sendMessageData, loading: sendMessageLoading, error: sendMessageError }] = useMutation(SEND_MESSAGE, {
        update(cache, { data: { sendMessage } }) {
            // Only update the query where `myId` is the sender
            cache.updateQuery(
                { query: GET_MESSAGES, variables: { sender_Id: myId, receiver_Id: userId } },
                (existingData) => ({
                    messages: [...(existingData?.messages || []), sendMessage],
                })
            );
        }
    });

    const messages = useMemo(() => {
        const mergedMessages = [
            ...(userMessages?.messages || []),
            ...(myMessages?.messages || [])
        ];

        return mergedMessages.sort((a, b) => b.id - a.id);
    }, [userMessages, myMessages]);

    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {

        if (userId && !userLoading && !myLoading) {
            navigation.setOptions({ title: `Messages with ${userId}`, headerShown: true });
        } else {
            navigation.setOptions({ title: "Loading...", headerShown: true });
        }

    }, [navigation, userId, userLoading, myLoading]);

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

    if (isLoading || userLoading || myLoading) {
        return null; // Show nothing while checking auth
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

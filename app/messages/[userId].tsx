import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE } from '@/utils/graphqlQueries';
import styles from './messages.styles';
import { getMyId } from '@/utils/getMyId';
import { Message } from '@/types';

export default function Messages() {

    const { isAuthenticated, isLoading } = useAuthCheck();
    const { userId } = useLocalSearchParams();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]);


    const [myId, setMyId] = useState<string | null>(null);
    useEffect(() => {
        getMyId().then(setMyId);
    }, []);


    const { data: userMessages, loading: userLoading, refetch: refetchUserMessages } = useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId }, skip: !myId });
    const { data: myMessages, loading: myLoading, refetch: refetchMyMessages } = useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId }, skip: !myId });
    const [users, setUsers] = useState([{ id: '1', username: 'User 1' }, { id: '2', username: 'User 2' }, { id: '3', username: 'User 3' }, { id: '8', username: 'User 8' }]);

    const possibleUsers = [1, 2, 11];
    const [onSendMessage, { loading: sendMessageLoading }] = useMutation(SEND_MESSAGE, {
        update(cache, { data: { sendMessage } }) {
            if (!sendMessage) return;
            possibleUsers.forEach(userId => {
                cache.updateQuery(
                    { query: GET_MESSAGES, variables: { sender_Id: userId, receiver_Id: myId } },
                    (existingData) => ({
                        messages: [...(existingData?.messages || []), sendMessage],
                    })
                );

                cache.updateQuery(
                    { query: GET_MESSAGES, variables: { sender_Id: myId, receiver_Id: userId } },
                    (existingData) => ({
                        messages: [...(existingData?.messages || []), sendMessage],
                    })
                );
            });
        },
        onCompleted: () => {
            refetchUserMessages();
            refetchMyMessages();
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

import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
import { User } from '@/types';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from '@/utils/graphqlQueries';
import Search from '../../components/Search';
import styles from './home.styles';
import { getMyId } from '@/utils/getMyId';

export default function Home() {

    const { isAuthenticated, isLoading } = useAuthCheck();
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


    const users = [{ id: '1', username: 'User 1' }, { id: '2', username: 'User 2' }, { id: '3', username: 'User 3' }, { id: '11', username: 'User 11' }].filter(user => user.id !== myId);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [newMessages, setNewMessages] = useState<string[]>([]);

    const possibleUsers = [1, 2, 11]; // Example list of known userIds

    const userQueries = possibleUsers.map(userId =>
        useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId }, skip: !myId })
    );

    const myQueries = possibleUsers.map(userId =>
        useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId }, skip: !myId })
    );

    const messagesByUser = useMemo(() => {
        return [
            ...userQueries.flatMap(({ data }) => data?.messages || []),
            ...myQueries.flatMap(({ data }) => data?.messages || [])
        ];
    }, [userQueries, myQueries]);

    const MAX_RETRIES = 3;
    let retryCount = 0;

    const restartFunctions = useRef(new Map()); // Store restart() functions per user

    possibleUsers.forEach(userId => {
        const { restart } = useSubscription(MESSAGE_SUBSCRIPTION, {
            variables: { receiverId: myId, senderId: userId },
            skip: !myId,
            onData({ client, data }) {
                const newMessage = data.data.newMessage;

                client.cache.updateQuery(
                    { query: GET_MESSAGES, variables: { sender_Id: userId, receiver_Id: myId } },
                    (existingData) => ({
                        messages: [...(existingData?.messages || []), newMessage]
                    })
                );

                setNewMessages(prev => [...prev, newMessage.sender_id]);

                restartFunctions.current.set(userId, restart); // Store restart function
                restart(); // Restart subscription immediately
            },
            onError(error) {
                console.error(`Subscription error for user ${userId}:`, error);

                if (restartFunctions.current.has(userId)) {
                    console.log(`Restarting subscription for user ${userId}...`);
                    restartFunctions.current.get(userId)(); // Restart only this user's subscription
                }
            }
        });
    });

    const messages = useMemo(() => {
        return messagesByUser.sort((a, b) => b.id - a.id); // Sort by newest first
    }, [messagesByUser]);

    // Step 1: Get unique conversations
    const uniqueConversations = Array.from(
        new Set(messages.map(m => [m.sender_id, m.receiver_id].sort().join('-')))
    ).map(key => {
        const [sender_id, receiver_id] = key.split('-');
        return { sender_id, receiver_id };
    });

    // Step 2: Get the latest message for each conversation
    const latestMessagesMap = new Map();

    messages.forEach(msg => {
        const key = [msg.sender_id, msg.receiver_id].sort().join('-');

        // If no message stored yet or this one is newer, update it
        if (!latestMessagesMap.has(key) || msg.id > latestMessagesMap.get(key).id) {
            latestMessagesMap.set(key, msg);
        }
    });

    // Convert to an array
    const latestMessages = uniqueConversations.map(convo => {
        const key = [convo.sender_id, convo.receiver_id].sort().join('-');
        return latestMessagesMap.get(key);
    });

    // Filter only conversations where myId is involved
    const myConversations = latestMessages.filter(
        msg => msg && (msg.sender_id === myId || msg.receiver_id === myId)
    );

    useLayoutEffect(() => {
        navigation.setOptions({ title: "Home Page", headerShown: !searching });
    }, [searching]);

    const searchClicked = () => {
        setSearching(true);
    };

    const backSearchClicked = () => {
        setSearch('');
        setSearching(false);
    }

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text.trim() === "") {
            setFilteredUsers([]); // Reset to all users if search is empty
        } else {
            const results = users.filter((user) =>
                user.username.toLowerCase().startsWith(text.toLowerCase())
            );
            setFilteredUsers(results);
        }
    };

    if (isLoading || !myId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <>
            <Search search={search} searchClicked={searchClicked} handleSearch={handleSearch} searching={searching} backSearchClicked={backSearchClicked} />
            <View style={styles.container}>
                {!searching ?
                    (myConversations.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{ ...styles.messageContainer, backgroundColor: newMessages.includes(item.sender_id) || newMessages.includes(item.receiver_id) ? "#e1e1e1" : 'white' }}
                            onPress={() => {
                                setNewMessages(newMessages.filter((d) => d !== item.sender_id && d !== item.receiver_id))
                                router.push(`../messages/${item.sender_id === myId ? item.receiver_id : item.sender_id}`);
                            }}
                        >
                            <Avatar
                                size={45}
                                rounded
                                title={item.receiver_id}  // First letter of username
                                containerStyle={{ backgroundColor: "#ccc" }}
                            />
                            <View style={styles.messageDetails}>
                                <Text style={styles.senderText}>
                                    {`User ${item.sender_id == myId ? item.receiver_id : item.sender_id}`}
                                </Text>
                                <Text style={styles.messageText}>{item.message}</Text> {/* Latest message */}
                            </View>

                        </TouchableOpacity>
                    ))) : (filteredUsers.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.messageContainer}
                            onPress={() => router.push(`../messages/${item.id}`)}
                        >
                            <Avatar
                                size={45}
                                rounded
                                title={item.id}  // First letter of username
                                containerStyle={{ backgroundColor: "#ccc" }}
                            />
                            <View style={styles.messageDetails}>
                                <Text style={styles.senderText}>{item.username}</Text>
                            </View>

                        </TouchableOpacity>
                    )))}
            </View>
        </>

    );
}

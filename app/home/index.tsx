import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Message, User } from '@/types';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from '@/utils/graphqlQueries';
import styles from './home.styles';

export default function Home() {

    const { isAuthenticated, isLoading } = useAuthCheck();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]);

    const myId = '1';
    const userId = '2';
    const navigation = useNavigation();

    const [users, setUsers] = useState([{ id: '1', username: 'John Doe' }, { id: '2', username: 'John Doe2' }, { id: '3', username: 'John Doe3' }, { id: '4', username: 'John Doe4' }]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);

    const [newMessages, setNewMessages] = useState<string[]>([]);

    const { data: userMessages, loading: userLoading, error: userError } = useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId } });
    const { data: myMessages, loading: myLoading, error: myError } = useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId } });


    const MAX_RETRIES = 3;
    let retryCount = 0;
    const { data: newMessageSubscriptionData, restart } = useSubscription(MESSAGE_SUBSCRIPTION, {
        variables: { receiverId: myId },
        onData({ client, data }) {
            const newMessage = data.data.newMessage;

            // Update the query where `userId` is the sender and `myId` is the receiver
            client.cache.updateQuery(
                { query: GET_MESSAGES, variables: { sender_Id: userId, receiver_Id: myId } },
                (existingData) => ({
                    messages: [...(existingData?.messages || []), newMessage]
                })
            );

            setNewMessages([...newMessages, newMessage.sender_id])
            restart();
        },
        onError(error) {
            console.error("Subscription error:", error);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`Retrying subscription... Attempt ${retryCount}`);
                restart(); // Restart the subscription
            } else {
                console.error("Max retries reached. Stopping further attempts.");
            }
        }
    });

    const messages = useMemo(() => {
        const mergedMessages = [
            ...(userMessages?.messages || []),
            ...(myMessages?.messages || [])
        ];

        return mergedMessages.sort((a, b) => b.id - a.id);
    }, [userMessages, myMessages]);

    const uniqueConversations = Array.from(
        new Set(messages.map(m => [m.sender_id, m.receiver_id].sort().join('-')))
    ).map(key => {
        const [sender_id, receiver_id] = key.split('-');
        return { sender_id, receiver_id };
    });

    // Filter conversations where myId is involved
    const myConversations = uniqueConversations.filter(
        convo => convo.sender_id === myId || convo.receiver_id === myId
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

    if (isLoading) {
        return null; // Show nothing while checking auth
    }

    return (
        <>
            <TouchableOpacity style={styles.searchContainer} onPress={searchClicked}  >
                {
                    searching ?
                        <TouchableOpacity onPress={backSearchClicked} style={{ padding: 10, paddingLeft: 0 }}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity> : null
                }

                <TextInput
                    placeholder="Search User"
                    value={search}
                    onChangeText={handleSearch}
                    style={{
                        width: "100%",  // Full width
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        fontSize: 14,
                        backgroundColor: "#fff",
                    }}
                />
            </TouchableOpacity>
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
                            <View style={styles.profile}></View>
                            <View style={styles.messageDetails}>
                                <Text style={styles.senderText}>User {messages.find((d) => (d.receiver_id === myId))?.sender_id || messages.find((d) => (d.sender_id === myId))?.receiver_id}</Text>
                                <Text style={styles.messageText}>{messages.find((d) => (d.sender_id === myId) || (d.receiver_id === myId))?.message}</Text>
                            </View>

                        </TouchableOpacity>
                    ))) : (filteredUsers.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.messageContainer}
                            onPress={() => router.push(`../messages/${item.id}`)}
                        >
                            <View style={styles.profile}></View>
                            <View style={styles.messageDetails}>
                                <Text style={styles.senderText}>{item.username}</Text>
                            </View>

                        </TouchableOpacity>
                    )))}
            </View>
        </>

    );
}

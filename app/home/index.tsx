import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Icon } from "react-native-elements";
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
import { User } from '@/types';
import { useAuthCheck } from '@/utils/authUtil';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../../graphql/queries';
import { MESSAGE_SUBSCRIPTION } from '../../graphql/subscriptions';
import Search from '../../components/Search';
import styles from './home.styles';
import { getMyId } from '@/utils/getMyId';
import { Message } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


    //users variable is for the list of searchable users currently hardcoded because api doesnt work for creating users
    // possibleUsers id exluding the current userId that messaged will be fetched, currently hardcoded also

    const possibleUsers = ['1', '2', '14'];
    const users = possibleUsers.map(userId => ({ id: userId, username: `User ${userId}` }));

    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [newMessages, setNewMessages] = useState<Message[]>([]);
    const [highlightedNewMessages, setHighlightedNewMessages] = useState<string[]>([]);

    const userQueries = possibleUsers.map(userId =>
        useQuery(GET_MESSAGES, { variables: { sender_Id: userId, receiver_Id: myId }, skip: !myId })
    );

    const myQueries = possibleUsers.map(userId =>
        useQuery(GET_MESSAGES, { variables: { sender_Id: myId, receiver_Id: userId }, skip: !myId })
    );

    const messagesByUser: Message[] = useMemo(() => {
        return [
            ...userQueries.flatMap(({ data }) => data?.messages || []),
            ...myQueries.flatMap(({ data }) => data?.messages || []),
            ...newMessages
        ];
    }, [userQueries, myQueries, newMessages]);

    const maxRetrys = 5;
    const retryCount = useRef(0);

    const { restart } = useSubscription(MESSAGE_SUBSCRIPTION, {
        variables: { receiverId: '2' }, skip: !myId,
        onData({ client, data }) {
            const newMessage = data.data.newMessage;

            // Update the query where `userId` is the sender and `myId` is the receiver
            client.cache.updateQuery(
                { query: GET_MESSAGES, variables: { sender_Id: newMessage.sender_id, receiver_Id: myId } },
                (existingData) => ({
                    messages: [...(existingData?.messages || []), newMessage]
                })
            );

            setNewMessages([...newMessages, newMessage])
            setHighlightedNewMessages([...highlightedNewMessages, newMessage.sender_id]);
            retryCount.current = 0;
            restart();
        },
        onError(error) {
            if (retryCount.current >= maxRetrys) return;
            retryCount.current++; // Increment retry count without resetting on re-renders
            console.log(`Retrying... Attempt ${retryCount.current}`);
            console.log(error);
            restart()
        }
    });

    const messages = useMemo(() => {
        return messagesByUser.sort((a, b) => Number(b.id) - Number(a.id)); // Ensure numeric comparison
    }, [messagesByUser, newMessages]);


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


    const conversationsWithLatestMessage = myConversations.map(convo => {
        const conversationMessages = messages.filter(
            msg =>
                (msg.sender_id === convo.sender_id && msg.receiver_id === convo.receiver_id) ||
                (msg.sender_id === convo.receiver_id && msg.receiver_id === convo.sender_id)
        );

        // Get the latest message for this conversation
        const latestMessage = conversationMessages.length > 0 ? conversationMessages[0] : null;

        return {
            ...convo,
            message: latestMessage?.message || "No messages yet", // Ensures valid text
        };
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Home Page",
            headerShown: !searching,
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        AsyncStorage.removeItem("token");
                        AsyncStorage.removeItem("username");
                        router.replace("/");
                    }}
                >
                    <Icon name="logout" type="material" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [searching, navigation]);

    const searchClicked = () => {
        if (!searching) {
            setSearching(true);
        }
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
                    (conversationsWithLatestMessage.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{ ...styles.messageContainer, backgroundColor: highlightedNewMessages.includes(item.sender_id) || highlightedNewMessages.includes(item.receiver_id) ? "#e1e1e1" : 'white' }}
                            onPress={() => {
                                setHighlightedNewMessages(highlightedNewMessages.filter((d) => d !== item.sender_id && d !== item.receiver_id))
                                router.push(`../messages/${item.sender_id === myId ? item.receiver_id : item.sender_id}`);
                            }}
                        >
                            <Avatar
                                size={45}
                                rounded
                                title={`${item.sender_id == myId ? item.receiver_id : item.sender_id}`} // Ensure it's a string
                                containerStyle={{ backgroundColor: "#ccc" }}
                            />
                            <View style={styles.messageDetails}>
                                <Text style={styles.senderText}>
                                    {`User ${item.sender_id == myId ? item.receiver_id : item.sender_id}`}
                                </Text>
                                <Text style={styles.messageText}>
                                    {item.message ? item.message.toString() : "No messages yet"}
                                </Text>
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
                                title={item.id?.toString()} // Ensure it's a string
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

import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { useNavigation } from 'expo-router';
export default function Search() {

    const myId = '1';

    const [users, setUsers] = useState([{ id: '1', username: 'John Doe' }, { id: '2', username: 'John Doe2' }, { id: '3', username: 'John Doe3' }, { id: '4', username: 'John Doe4' }]);
    const [search, setSearch] = useState("");

    const [data, setData] = useState([
        { id: '1', sender_id: '1', receiver_id: '2', username: 'John Doe', message: 'Hello, how are you?' },
        { id: '2', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you2?' },
        { id: '3', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you3?' },
        { id: '4', sender_id: '2', receiver_id: '1', username: 'John Doe', message: 'Hello, how are you4?' },
        { id: '5', sender_id: '2', receiver_id: '1', username: 'JohnDoe2', message: 'Hello, how are you5?' },
        { id: '6', sender_id: '3', receiver_id: '2', username: 'JohnDoe3', message: 'Hello, how are you6?' },
        { id: '7', sender_id: '4', receiver_id: '2', username: 'JohnDoe4', message: 'Hello, how are you7?' }
    ]);

    const uniqueConversations = Array.from(
        new Set(data.map(m => [m.sender_id, m.receiver_id].sort().join('-')))
    ).map(key => {
        const [sender_id, receiver_id] = key.split('-');
        return { sender_id, receiver_id };
    });

    // Filter conversations where myId is involved
    const myConversations = uniqueConversations.filter(
        convo => convo.sender_id === myId || convo.receiver_id === myId
    );

    return (
        <>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search User"
                    value={search}
                    onChangeText={setSearch}
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
            </View>
            <View style={styles.container}>
                {myConversations.map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.messageContainer}
                        onPress={() => router.push(`../messages/${item.sender_id === myId ? item.receiver_id : item.sender_id}`)}
                    >
                        <View style={styles.profile}></View>
                        <View style={styles.messageDetails}>
                            <Text style={styles.senderText}>{data.find((d) => (d.receiver_id === myId))?.username}</Text>
                            <Text style={styles.messageText}>{data.find((d) => (d.sender_id === myId) || (d.receiver_id === myId))?.message}</Text>
                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, display: 'flex', gap: 10, flexDirection: 'column', overflow: 'scroll' },
    messageContainer: { justifyContent: 'flex-start', alignItems: 'center', padding: 10, height: 100, width: '100%', flexDirection: 'row', display: 'flex', backgroundColor: 'white', borderRadius: 10, gap: 10 },
    senderText: { fontWeight: 'bold', fontSize: 16 },
    messageDetails: { display: 'flex', flexDirection: 'column', gap: 3 },
    messageText: { fontSize: 14, color: '#555' },
    profile: { borderRadius: '50%', width: 50, height: 50, backgroundColor: '#ccc' },
    searchContainer: { display: 'flex', flexDirection: 'row', backgroundColor: 'white', padding: 10 }
});

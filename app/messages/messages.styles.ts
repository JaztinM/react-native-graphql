import { StyleSheet } from 'react-native';

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

export default styles; 
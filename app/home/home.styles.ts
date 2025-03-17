import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, display: 'flex', gap: 10, flexDirection: 'column', overflow: 'scroll' },
    messageContainer: { justifyContent: 'flex-start', alignItems: 'center', padding: 10, height: 100, width: '100%', flexDirection: 'row', display: 'flex', backgroundColor: 'white', borderRadius: 10, gap: 10 },
    senderText: { fontWeight: 'bold', fontSize: 16 },
    messageDetails: { display: 'flex', flexDirection: 'column', gap: 3 },
    messageText: { fontSize: 14, color: '#555' },
    profile: { borderRadius: '50%', width: 50, height: 50, backgroundColor: '#ccc' },
    searchContainer: { display: 'flex', flexDirection: 'row', backgroundColor: 'white', padding: 10 }
});

export default styles; 

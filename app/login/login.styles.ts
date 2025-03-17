import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        maxWidth: 320,
        alignSelf: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: { fontSize: 24, marginBottom: 30, fontWeight: '600' },
    register: { fontSize: 12, alignSelf: 'flex-start', marginTop: -7, marginLeft: 2 },
    registerLink: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        maxWidth: 300
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        maxWidth: 300
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
});

export default styles; 
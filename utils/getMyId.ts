import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyId = async () => {
    try {
        return await AsyncStorage.getItem('username');
    } catch (error) {
        console.error('Error fetching myId:', error);
        return null;
    }
};

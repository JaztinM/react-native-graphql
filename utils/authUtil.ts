import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useAuthCheck = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace("/"); // Redirect to login
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    return { isAuthenticated, isLoading };
};

import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { getToken } from "@/services/authService";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        (async () => {
          try {
            const token = await getToken();
            setIsAuthenticated(!!token);
        } catch (e) {
            setIsAuthenticated(false);
        } finally {
            setChecking(false);
        }
        })();
    }, []);

    useEffect(() => {
        if (!checking) {
            if (!isAuthenticated) {
                router.replace("/login");
            }
        }
    }, [checking, isAuthenticated]);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="scan-result" options={{ title: "Resultado" }} />
            <Stack.Screen name="card/[id]" options={{ title: "Detalle de la carta" }} />
        </Stack>
    );
}
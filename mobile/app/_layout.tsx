import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="scan-result" options={{ title: "Resultado" }} />
            <Stack.Screen name="card/[id]" options={{ title: "Detalle de carta" }} />
        </Stack>
    );
}
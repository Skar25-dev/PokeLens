import { useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { CameraView } from "@/components/CameraView";
import { useScanCard } from "@/hooks/useScanCard";

export default function ScanScreen() {
    const { scan, loading, error, reset } = useScanCard();
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    async function handleCapture(uri: string) {
        setPhotoUri(uri);
        const result = await scan(uri);
        if (result) {
            router.push({
                pathname: "/scan-result",
                params: { data: JSON.stringify(result) },
            });
            setPhotoUri(null);
            reset();
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Identificando la carta...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView onCapture={handleCapture} />
            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, fontSize: 15, color: "#555" },
    errorBanner: {
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: "#fdecea",
        borderRadius: 8,
        padding: 12,
    },
    errorText: { color: "#d63939", textAlign: "center"},
});
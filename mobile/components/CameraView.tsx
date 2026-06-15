import { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { CameraView as ExpoCameraView, useCameraPermissions } from "expo-camera";

interface Props {
    onCapture: (uri: string) => void;
}

export function CameraView({ onCapture }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<ExpoCameraView>(null);
    const [isReady, setIsReady] = useState(false);

    if (!permission) {
        return <View style={styles.center} />
    }

    if (!permission.granted) {
        return(
            <View style={styles.center}>
                <Text style={styles.message}>
                    Necesitamos permiso para usar la cámara y escanear tus cartas.
                </Text>
                <Pressable style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Conceder permiso</Text>
                </Pressable>
            </View>
        );
    }

    async function takePicture() {
        if (!cameraRef.current || !isReady) return;
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo?.uri) {
            onCapture(photo.uri);
        }
    }

    return (
        <View style={styles.container}>
            <ExpoCameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                onCameraReady={() => setIsReady(true)}
            />
            <View style={styles.overlay}>
                <View style={styles.frame} />
            </View>
            <View style={styles.controls}>
                <Pressable style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureInner} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    message: { textAlign: "center", marginBottom: 16, fontSize: 15 },
    button: { backgroundColor: "#3b5bdb", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    buttonText: {color: "#fff", fontWeight: 600 },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    frame: {
        width: "75%",
        aspectRatio: 0.7,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.8)",
        borderRadius: 12,
    },
    controls: {
        position: "absolute",
        bottom: 32,
        width: "100%",
        alignItems: "center",
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#fff",
    },
});
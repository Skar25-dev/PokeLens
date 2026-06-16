import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { login, register } from "@/services/authService";
import { ApiError } from "@/services/api";

export default function LoginScreen() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        setLoading(true);
        setError(null);
        try {
            if (isRegister) {
                await register(email, password, name || undefined);
            } else {
                await login(email, password);
            }
            router.replace("/(tabs)");
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PokéLens</Text>
            <Text style={styles.subtitle}>{isRegister ? "Crea tu cuenta" : "Inicia Sesión"}</Text>

            {isRegister && (
                <TextInput
                    style={styles.input}
                    placeholder="Nombre (opcional)"
                    value={name}
                    onChangeText={setName}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{isRegister ? "Registrarse" : "Entrar"}</Text>
                )}
            </Pressable>

            <Pressable onPress={() => setIsRegister(!isRegister)}>
                <Text style={styles.switchText}>
                    {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 24 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 15,
    },
    button: {
        backgroundColor: "#3b5bdb",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    error: { color: "#d63939", marginBottom: 8, textAlign: "center" },
    switchText: { color: "#3b5bdb", textAlign: "center", marginTop: 16 },
});
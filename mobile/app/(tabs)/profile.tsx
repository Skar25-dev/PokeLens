import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getMe, logout, UserOut } from "@/services/authService";

export default function ProfileScreen() {
    const [user, setUser] = useState <UserOut | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe()
        .then(setUser)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    async function handleLogout() {
        await logout();
        router.replace("/login");
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            {user && (
                <View style={styles.info}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email}</Text>
                    {user.name && (
                        <>
                            <Text style={styles.label}>Nombre</Text>
                            <Text style={styles.value}>{user.name}</Text>
                        </>
                    )}
                </View>
            )}

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16},
    info: { marginBottom: 24 },
    label: { color: "#999", fontSize: 12, marginTop: 8 },
    value: { fontSize: 16, fontWeight: "500" },
    logoutButton: {
        borderWidth: 1,
        borderColor: "#d63939",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: "auto",
    },
    logoutText: { color: "#d63939", fontWeight: "600" },
});
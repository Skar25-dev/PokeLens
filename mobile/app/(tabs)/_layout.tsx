import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Colección" }} />
            <Tabs.Screen name="scan" options={{ title: "Escanear" }} />
            <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
        </Tabs>
    );
}
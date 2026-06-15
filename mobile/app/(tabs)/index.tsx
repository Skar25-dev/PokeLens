import { FlatList, View, Text, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { useCollection } from "@/hooks/useCollection";
import { CollectionSummaryView } from "@/components/CollectionSummary";
import { CardListItem } from "@/components/CardListItem";

export default function CollectionSummary() {
    const { data, loading, error, refresh } = useCollection();

    if (loading && !data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>
                    Tu colección está vacía.{"\n"}Ve a la pestaña "Escanear" para añadir tu primera carta.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data.items}
            keyExtractor={(item) => String(item.id)}
            renderItem={({item}) => <CardListItem item={item} />}
            ListHeaderComponent={<CollectionSummaryView summary={data} />}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        />
    );
}

const styles = StyleSheet.create({
    
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    error: { color: "#d63939", textAlign: "center" },
    empty: { textAlign: "center", color: "#666", lineHeight: 22 },
});
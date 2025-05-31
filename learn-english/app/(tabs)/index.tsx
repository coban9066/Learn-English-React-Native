import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Ana Sayfa' }} />
      <Text style={styles.header}>👋 İngilizce Öğren!</Text>

      <Link href="/game" asChild>
        <Button title="🎮 Oyuna Başla" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  header: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
});

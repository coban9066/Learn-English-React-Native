import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ Hakkında</Text>
      <Text style={styles.text}>
        Bu uygulama, kullanıcıların İngilizce kelime dağarcığını oyun yoluyla artırması için geliştirildi.
      </Text>
      <Text style={styles.text}>
        Sürüm: 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 }
});

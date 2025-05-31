import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';

const API_URL = 'http://localhost:3000'; 

export default function SettingsScreen() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [words, setWords] = useState([]);
  const [newEn, setNewEn] = useState('');
  const [newTr, setNewTr] = useState('');

  const fetchWords = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/word`);
      const data = await response.json();
      setWords(data);
    } catch (error) {
      Alert.alert('Hata', 'Kelime verileri alınamadı.');
    }
  };

  const handleLogin = () => {
    if (password === 'zabaza01') {
      setIsAdmin(true);
      fetchWords();
    } else {
      Alert.alert('Hatalı şifre', 'Şifre yanlış.');
    }
  };

  const handleAddWord = async () => {
    if (!newEn || !newTr) return;

    try {
      const response = await fetch(`${API_URL}/admin/word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en: newEn, tr: newTr })
      });
      const result = await response.json();
      if (result.word) {
        setNewEn('');
        setNewTr('');
        fetchWords();
      }
    } catch (error) {
      Alert.alert('Hata', 'Kelime eklenemedi.');
    }
  };

  const handleDeleteWord = async (index: number) => {
    try {
      await fetch(`${API_URL}/admin/word/${index}`, { method: 'DELETE' });
      fetchWords();
    } catch (error) {
      Alert.alert('Hata', 'Kelime silinemedi.');
    }
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Admin Girişi</Text>
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Giriş Yap" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Paneli</Text>

      <TextInput
        placeholder="İngilizce"
        value={newEn}
        onChangeText={setNewEn}
        style={styles.input}
      />
      <TextInput
        placeholder="Türkçe"
        value={newTr}
        onChangeText={setNewTr}
        style={styles.input}
      />
      <Button title="Kelime Ekle" onPress={handleAddWord} />

      <FlatList
        data={words}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.wordRow}>
            <Text style={styles.wordText}>{item.en} - {item.tr}</Text>
            <Button title="Sil" onPress={() => handleDeleteWord(index)} />
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    borderRadius: 5
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  wordText: {
    fontSize: 16
  }
});

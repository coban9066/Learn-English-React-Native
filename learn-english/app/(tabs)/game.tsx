import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import useWords from '../../hooks/useWords';
import { supabase } from '../../screens/supabase';

export default function GameScreen() {
  const { wordPairs, loading, fetchWords } = useWords();

  const [enWords, setEnWords] = useState<string[]>([]);
  const [trWords, setTrWords] = useState<string[]>([]);
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const startGame = async () => {
    setScore(0);
    setWrong(0);
    setSelectedEn(null);
    setTimeLeft(60);
    setGameOver(false);
    setName('');
    setSubmitted(false);
    await fetchWords();
  };

  useEffect(() => {
    if (!loading && wordPairs.length > 0) {
      setEnWords(wordPairs.map(w => w.en));
      setTrWords(shuffleArray(wordPairs.map(w => w.tr)));
    }
  }, [wordPairs, loading]);

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const shuffleArray = (arr: string[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const handleMatch = async (tr: string) => {
    if (!selectedEn) return;

    const match = wordPairs.find(w => w.en === selectedEn && w.tr === tr);
    if (match) {
      setScore(prev => prev + 1);
      await fetchWords();
    } else {
      setWrong(prev => prev + 1);
    }

    setSelectedEn(null);
  };

  const handleSubmit = async () => {
    if (name.trim() === '') return;
    try {
      const { error } = await supabase.from('scores').insert([
        { name, score, wrong }
      ]);
      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Skor kaydedilirken hata:", error);
    }
  };

  if (loading) return <Text style={styles.header}>Yükleniyor...</Text>;

  if (gameOver && !submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🛑 Oyun Bitti!</Text>
        <Text style={styles.header}>✅ Doğru: {score} | ❌ Hatalı: {wrong}</Text>
        <TextInput
          placeholder="Ad Soyad"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.restartButton} onPress={handleSubmit}>
          <Text style={styles.restartText}>📤 Skoru Kaydet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameOver && submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🎉 Skorunuz kaydedildi, teşekkürler {name}!</Text>
        <TouchableOpacity style={styles.restartButton} onPress={startGame}>
          <Text style={styles.restartText}>🔁 Yeniden Başla</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⏱️ Süre: {timeLeft} | ✅ {score} | ❌ {wrong}</Text>

      <View style={styles.row}>
        {enWords.map((en, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.wordBox, selectedEn === en && styles.selected]}
            onPress={() => setSelectedEn(en)}
          >
            <Text>{en}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {trWords.map((tr, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.wordBox}
            onPress={() => handleMatch(tr)}
          >
            <Text>{tr}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff',
  },
  header: {
    fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#000',
  },
  row: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20,
  },
  wordBox: {
    padding: 10, margin: 5, borderWidth: 1, borderColor: '#aaa',
    borderRadius: 5, minWidth: 80, alignItems: 'center', backgroundColor: '#f0f0f0',
  },
  selected: {
    backgroundColor: '#c0f0c0',
  },
  restartButton: {
    padding: 15, backgroundColor: '#4CAF50', borderRadius: 10, marginTop: 30, alignSelf: 'center',
  },
  restartText: {
    color: 'white', fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
});

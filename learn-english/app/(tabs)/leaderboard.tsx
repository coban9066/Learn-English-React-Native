import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vgszbdapatsdkxkzefzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnc3piZGFwYXRzZGt4a3plZnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODIzODAsImV4cCI6MjA2MzI1ODM4MH0.HwxplxVHuyCMZrB0QAbRCihrv-5MqMQR7zXSfWS9H04';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Score {
  name: string;
  score: number;
  wrong: number;
  net: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("name, score, wrong");

      if (error) {
        console.error("Error fetching scores:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const calculatedScores = data.map((item) => ({
          ...item,
          net: item.score - item.wrong,
        }));

        const sortedScores = calculatedScores.sort((a, b) => b.net - a.net);
        setLeaderboard(sortedScores);
      }

      setLoading(false);
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1 }]}>Rank</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Name</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Net</Text>
      </View>
      <FlatList
        data={leaderboard}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{item.name}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.net}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444',
  },
  cell: {
    textAlign: 'center',
    color: '#555',
  },
});

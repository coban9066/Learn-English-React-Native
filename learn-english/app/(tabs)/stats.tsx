'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://vgszbdapatsdkxkzefzl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnc3piZGFwYXRzZGt4a3plZnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODIzODAsImV4cCI6MjA2MzI1ODM4MH0.HwxplxVHuyCMZrB0QAbRCihrv-5MqMQR7zXSfWS9H04'
);

const Stats = () => {
  const [totalGames, setTotalGames] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('scores').select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (data) {
        setTotalGames(data.length);
        setTotalScore(data.reduce((acc, item) => acc + (item.score || 0), 0));
        setTotalWrong(data.reduce((acc, item) => acc + (item.wrong || 0), 0));
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>İstatistikler</h1>
      <div style={styles.card}>
        <p style={styles.label}>Oynanan Oyun:</p>
        <p style={styles.value}>{totalGames}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.label}>Toplam Skor:</p>
        <p style={styles.value}>{totalScore}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.label}>Toplam Yanlış:</p>
        <p style={styles.value}>{totalWrong}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '24px',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '16px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: '18px',
    color: '#666',
  },
  value: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#222',
  },
};

export default Stats;

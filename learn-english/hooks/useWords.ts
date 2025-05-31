import { useEffect, useState } from 'react';
import axios from 'axios';

export interface WordPair {
  en: string;
  tr: string;
}

const useWords = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await axios.get<WordPair[]>('http://localhost:3000/words?limit=4');
      setWordPairs(res.data);
    } catch (error) {
      console.error('Kelime çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return { wordPairs, loading, fetchWords };
};

export default useWords;

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // ✅ JSON gövde desteği

const dataFile = path.join(__dirname, 'words.json');

// 📌 OYUN: Rastgele 4 kelime
app.get('/words', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    const words = JSON.parse(data);
    const shuffled = words.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, 4);
    res.json(limited);
  });
});

// 📌 ADMIN: Tüm kelimeleri getir
app.get('/admin/word', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    res.json(JSON.parse(data));
  });
});

// 📌 ADMIN: Yeni kelime ekle
app.post('/admin/word', (req, res) => {
  const newWord = req.body; // { en: 'apple', tr: 'elma' }
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    const words = JSON.parse(data);
    words.push(newWord);
    fs.writeFile(dataFile, JSON.stringify(words, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Yazılamadı.' });
      res.json({ message: 'Kelime eklendi.', word: newWord });
    });
  });
});

// 📌 ADMIN: Kelime sil (index üzerinden)
app.delete('/admin/word/:index', (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    let words = JSON.parse(data);
    if (index < 0 || index >= words.length) {
      return res.status(400).json({ error: 'Geçersiz index.' });
    }
    const deleted = words.splice(index, 1);
    fs.writeFile(dataFile, JSON.stringify(words, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Silinemedi.' });
      res.json({ message: 'Kelime silindi.', deleted });
    });
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

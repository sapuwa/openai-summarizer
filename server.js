const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// ✅ CORS設定（完全バージョン）
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/summarize', async (req, res) => {
  try {
    const userText = req.body.text;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "以下の日本語の文章をわかりやすく要約してください。" },
        { role: "user", content: userText }
      ],
      temperature: 0.5
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '要約に失敗しました' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});

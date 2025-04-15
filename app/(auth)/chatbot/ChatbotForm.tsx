'use client';

import { useState } from 'react';

export default function ChatbotForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  type AskResponse = {
    reply?: string;
  };

  async function handleAsk() {
    if (!question) {
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('http://localhost:5328/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data: AskResponse = await res.json();
      setAnswer(data.reply || 'No response.');
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Something went wrong.');
    }

    setLoading(false);
  }

  return (
    <main>
      <h1>AI Movie Assistant</h1>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.currentTarget.value)}
        rows={4}
        placeholder="Ask me anything about a movie..."
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {answer && <div>{answer}</div>}
    </main>
  );
}

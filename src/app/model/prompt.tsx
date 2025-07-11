'use client';

import { useState } from 'react';
import type { GenerateResponse } from '../types/api';

export default function PromptBox() {
  const [prompt, setPrompt] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());
      const data: GenerateResponse = await res.json();
      setAnswer(data.text);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col gap-4 max-w-xl mx-auto p-6 text-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? '...' : 'Go'}
        </button>
      </form>

      {answer && (
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-3">
          {answer}
        </pre>
      )}
    </main>
  );
}

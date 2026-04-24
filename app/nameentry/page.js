'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadResults, saveResults, clearResults } from '../store';
import dynamic from 'next/dynamic';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function NameEntryPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadResults();
    if (!saved) {
      router.push('/');
      return;
    }
    setResults(saved);
    setHydrated(true);
  }, []);

  async function submitScore() {
    if (!playerName.trim() || !results) return;
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: playerName.trim(),
        level: results.level,
        topic: results.topic,
        score: results.score,
        total: results.total,
        percentage: results.percentage,
        time: results.elapsedTime,
      }),
    });
    saveResults({ ...results, playerName: playerName.trim() });
    router.push('/results');
  }

  function skip() {
    router.push('/results');
  }

  if (!hydrated || !results) return null;

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem' }}>Quiz complete!</h1>
      <div style={{ fontSize: '52px', fontWeight: '500', color: '#002395', margin: '1rem 0' }}>{results.score}/{results.total}</div>
      <div style={{ fontSize: '16px', color: '#999', marginBottom: '1rem' }}>Time: {formatTime(results.elapsedTime)}</div>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Enter your name to save your score to the leaderboard.</p>
      <input
        type="text"
        placeholder="Your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submitScore()}
        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', marginBottom: '1rem', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={submitScore} disabled={!playerName.trim()} style={{ flex: 1, padding: '0.85rem', background: playerName.trim() ? '#002395' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: playerName.trim() ? 'pointer' : 'not-allowed' }}>
          Save Score
        </button>
        <button onClick={skip} style={{ flex: 1, padding: '0.85rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Skip
        </button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(NameEntryPage), { ssr: false });
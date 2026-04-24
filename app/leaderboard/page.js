'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadQuizState, saveQuizState, clearResults } from '../store';
import dynamic from 'next/dynamic';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function LeaderboardPage() {
  const router = useRouter();
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadQuizState();
    if (!saved?.level || !saved?.topic) {
      router.push('/');
      return;
    }
    setLevel(saved.level);
    setTopic(saved.topic);
    fetchLeaderboard(saved.level, saved.topic);
    setHydrated(true);
  }, []);

  async function fetchLeaderboard(level, topic) {
    setLoading(true);
    const res = await fetch(`/api/scores?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setLeaderboard(data);
    setLoading(false);
  }

  async function startQuiz() {
    const res = await fetch(`/api/questions?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const questions = await res.json();
    saveQuizState({ level, topic, questions, current: 0, score: 0, elapsedTime: 0, wrongAnswers: [] });
    clearResults();
    router.push('/quiz');
  }

  if (!hydrated) return null;

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.25rem' }}>Leaderboard</h1>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '1.5rem' }}>{level} — {topic}</p>

      {loading ? (
        <p style={{ color: '#999', fontSize: '14px' }}>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ color: '#999', fontSize: '14px' }}>No scores yet for this level and topic. Be the first!</p>
      ) : (
        <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: '500', color: '#555' }}>#</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: '500', color: '#555' }}>Name</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '500', color: '#555' }}>Score</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '500', color: '#555' }}>Time</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '500', color: '#555' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr key={i} style={{ borderTop: '1px solid #eee', background: i === 0 ? '#e8ecf7' : 'white' }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: i === 0 ? '#002395' : '#666', fontWeight: i === 0 ? '500' : '400' }}>{i + 1}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#333' }}>{entry.name}</td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#333' }}>{entry.score}/{entry.total} ({entry.percentage}%)</td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#333' }}>{formatTime(entry.time)}</td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#999' }}>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={startQuiz} style={{ flex: 1, padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Start Quiz
        </button>
        <button onClick={() => router.push('/')} style={{ flex: 1, padding: '0.85rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Back to start
        </button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(LeaderboardPage), { ssr: false });
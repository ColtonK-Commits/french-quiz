'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadResults, clearResults } from '../store';
import dynamic from 'next/dynamic';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadResults();
    if (!saved) {
      router.push('/');
      return;
    }
    setResults(saved);
    fetchLeaderboard(saved.level, saved.topic);
    setHydrated(true);
  }, []);

  async function fetchLeaderboard(level, topic) {
    setLeaderboardLoading(true);
    const res = await fetch(`/api/scores?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setLeaderboard(data);
    setLeaderboardLoading(false);
  }

  function goHome() {
    clearResults();
    router.push('/');
  }

  if (!hydrated || !results) return null;

  const msg = results.percentage >= 80 ? 'Excellent work!' : results.percentage >= 60 ? 'Good effort, keep practising!' : 'Keep going — repetition is key!';

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>Results</h1>
      <div style={{ fontSize: '52px', fontWeight: '500', color: '#002395', margin: '1rem 0', textAlign: 'center' }}>{results.score}/{results.total}</div>
      <div style={{ fontSize: '16px', color: '#999', textAlign: 'center', marginBottom: '0.5rem' }}>Time: {formatTime(results.elapsedTime)}</div>
      <p style={{ color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>{msg}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        {[['Correct', results.score], ['Incorrect', results.total - results.score], ['Score', `${results.percentage}%`]].map(([label, val]) => (
          <div key={label} style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: '500' }}>{val}</div>
          </div>
        ))}
      </div>

      {results.wrongAnswers?.length > 0 && (
        <button onClick={() => router.push('/review')} style={{ width: '100%', padding: '0.85rem', background: '#ED2939', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '1.5rem' }}>
          Review {results.wrongAnswers.length} incorrect answer{results.wrongAnswers.length > 1 ? 's' : ''} →
        </button>
      )}

      <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Leaderboard — {results.level} {results.topic}</h2>
      {leaderboardLoading ? (
        <p style={{ color: '#999', fontSize: '14px' }}>Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ color: '#999', fontSize: '14px' }}>No scores yet for this level and topic.</p>
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
                <tr key={i} style={{ borderTop: '1px solid #eee', background: entry.name === results.playerName ? '#e8ecf7' : 'white' }}>
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

      <button onClick={goHome} style={{ width: '100%', padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>Back to start</button>
    </main>
  );
}

export default dynamic(() => Promise.resolve(ResultsPage), { ssr: false });
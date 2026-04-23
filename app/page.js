'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

function FrenchFlag({ opacity = 0.13 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = opacity;
      const cols = [['#002395', W * 0.333], ['#FFFFFF', W * 0.667], ['#ED2939', W]];
      let x = 0;
      cols.forEach(([color, endX]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let px = x; px <= endX; px++) {
          const wave = Math.sin((px / W) * Math.PI * 6 + t) * 18 + Math.sin((px / W) * Math.PI * 3 + t * 0.7) * 10;
          ctx.lineTo(px, wave + 20);
        }
        for (let px = endX; px >= x; px--) {
          const wave = Math.sin((px / W) * Math.PI * 6 + t) * 18 + Math.sin((px / W) * Math.PI * 3 + t * 0.7) * 10;
          ctx.lineTo(px, H + wave - 20);
        }
        ctx.closePath();
        ctx.fill();
        x = endX;
      });
      ctx.restore();
      t += 0.025;
      animRef.current = requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

function Home() {
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [screen, setScreen] = useState('start');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const levels = ['A1', 'A2', 'B1', 'B2'];
  const topics = ['French Grammar', 'French History & Geography', 'French Regional Food & Cooking'];

  async function startQuiz() {
    setLoading(true);
    const res = await fetch(`/api/questions?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setQuestions(data);
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setLoading(false);
    setScreen('quiz');
  }

  async function fetchLeaderboard() {
    setLeaderboardLoading(true);
    const res = await fetch(`/api/scores?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setLeaderboard(data);
    setLeaderboardLoading(false);
  }

  async function viewLeaderboard() {
    await fetchLeaderboard();
    setScreen('leaderboard');
  }

  function selectAnswer(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === questions[current].answer) setScore(s => s + 1);
  }

  function next() {
    if (current + 1 >= questions.length) {
      setScreen('nameentry');
    } else {
      setCurrent(c => c + 1);
      setAnswered(false);
      setSelected(null);
    }
  }

  async function submitScore() {
    if (!playerName.trim()) return;
    const percentage = Math.round((score / questions.length) * 100);
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName.trim(), level, topic, score, total: questions.length, percentage }),
    });
    await fetchLeaderboard();
    setScreen('results');
  }

  function restart() {
    setLevel('');
    setTopic('');
    setPlayerName('');
    setLeaderboard([]);
    setScreen('start');
  }

  const canStart = level && topic;

  if (screen === 'start') return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FrenchFlag opacity={0.13} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', padding: '2rem 1.5rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '0.5rem', color: '#111' }}>French Quiz</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Choose your level and topic to begin.</p>

        <h2 style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>LEVEL</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {levels.map((l) => (
            <button key={l} onClick={() => setLevel(l)} style={{ padding: '0.6rem 1.5rem', border: level === l ? '2px solid #002395' : '1px solid #ccc', borderRadius: '8px', background: level === l ? '#e8ecf7' : 'rgba(255,255,255,0.85)', color: level === l ? '#002395' : '#333', cursor: 'pointer', fontWeight: level === l ? '500' : '400', fontSize: '15px' }}>{l}</button>
          ))}
        </div>

        <h2 style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>TOPIC</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
          {topics.map((t) => (
            <button key={t} onClick={() => setTopic(t)} style={{ padding: '0.75rem 1rem', border: topic === t ? '2px solid #ED2939' : '1px solid #ccc', borderRadius: '8px', background: topic === t ? '#fdecea' : 'rgba(255,255,255,0.85)', color: topic === t ? '#a01020' : '#333', cursor: 'pointer', textAlign: 'left', fontWeight: topic === t ? '500' : '400', fontSize: '15px' }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button disabled={!canStart || loading} onClick={startQuiz} style={{ flex: 1, padding: '0.85rem', background: canStart ? '#002395' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: canStart ? 'pointer' : 'not-allowed' }}>
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
          <button disabled={!canStart} onClick={viewLeaderboard} style={{ flex: 1, padding: '0.85rem', background: canStart ? 'rgba(255,255,255,0.85)' : '#eee', color: canStart ? '#002395' : '#999', border: canStart ? '2px solid #002395' : '2px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: canStart ? 'pointer' : 'not-allowed' }}>
            Leaderboard
          </button>
        </div>
      </div>
    </main>
  );

  if (screen === 'quiz') {
    const q = questions[current];
    const pct = Math.round((current / questions.length) * 100);
    return (
      <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', marginBottom: '8px' }}>
          <span>{level} — {topic}</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div style={{ background: '#eee', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
          <div style={{ background: '#002395', height: '6px', borderRadius: '99px', width: `${pct}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '17px', fontWeight: '500', marginBottom: '1.25rem', lineHeight: '1.5', color: '#111' }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((o, i) => {
              let bg = 'white', border = '1px solid #ccc', color = '#333';
              if (answered) {
                if (i === q.answer) { bg = '#EAF3DE'; border = '1px solid #3B6D11'; color = '#27500A'; }
                else if (i === selected) { bg = '#FCEBEB'; border = '1px solid #A32D2D'; color = '#501313'; }
              }
              return <button key={i} onClick={() => selectAnswer(i)} disabled={answered} style={{ padding: '0.75rem 1rem', border, borderRadius: '8px', background: bg, color, cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontSize: '15px' }}>{o}</button>;
            })}
          </div>
          {answered && <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f5f5f5', borderLeft: '3px solid #002395', borderRadius: '0 8px 8px 0', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{q.explanation}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#999' }}>Score: {score} / {current + (answered ? 1 : 0)}</span>
          {answered && <button onClick={next} style={{ padding: '0.6rem 1.25rem', border: '1px solid #ccc', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>{current + 1 < questions.length ? 'Next →' : 'Finish →'}</button>}
        </div>
      </main>
    );
  }

  if (screen === 'nameentry') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem' }}>Quiz complete!</h1>
        <div style={{ fontSize: '52px', fontWeight: '500', color: '#002395', margin: '1rem 0' }}>{score}/{questions.length}</div>
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
          <button onClick={() => { fetchLeaderboard(); setScreen('results'); }} style={{ flex: 1, padding: '0.85rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            Skip
          </button>
        </div>
      </main>
    );
  }

  if (screen === 'results') {
    const pct = Math.round((score / questions.length) * 100);
    const msg = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort, keep practising!' : 'Keep going — repetition is key!';
    return (
      <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem', textAlign: 'center' }}>Results</h1>
        <div style={{ fontSize: '52px', fontWeight: '500', color: '#002395', margin: '1rem 0', textAlign: 'center' }}>{score}/{questions.length}</div>
        <p style={{ color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>{msg}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
          {[['Correct', score], ['Incorrect', questions.length - score], ['Score', `${pct}%`]].map(([label, val]) => (
            <div key={label} style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '20px', fontWeight: '500' }}>{val}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Leaderboard — {level} {topic}</h2>
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
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '500', color: '#555' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #eee', background: entry.name === playerName ? '#e8ecf7' : 'white' }}>
                    <td style={{ padding: '0.6rem 0.75rem', color: i === 0 ? '#002395' : '#666', fontWeight: i === 0 ? '500' : '400' }}>{i + 1}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#333' }}>{entry.name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#333' }}>{entry.score}/{entry.total} ({entry.percentage}%)</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#999' }}>{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={restart} style={{ width: '100%', padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>Back to start</button>
      </main>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.25rem' }}>Leaderboard</h1>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '1.5rem' }}>{level} — {topic}</p>
        {leaderboardLoading ? (
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
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '500', color: '#555' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #eee', background: i === 0 ? '#e8ecf7' : 'white' }}>
                    <td style={{ padding: '0.6rem 0.75rem', color: i === 0 ? '#002395' : '#666', fontWeight: i === 0 ? '500' : '400' }}>{i + 1}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#333' }}>{entry.name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#333' }}>{entry.score}/{entry.total} ({entry.percentage}%)</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#999' }}>{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={startQuiz} style={{ flex: 1, padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
          <button onClick={restart} style={{ flex: 1, padding: '0.85rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            Back to start
          </button>
        </div>
      </main>
    );
  }
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
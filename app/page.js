'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { saveQuizState, clearQuizState, clearResults } from './store';
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

function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const topics = ['French Grammar', 'French History & Geography', 'French Regional Food & Cooking'];
  const canStart = level && topic;

  async function startQuiz() {
    setLoading(true);
    clearQuizState();
    clearResults();
    const res = await fetch(`/api/questions?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topic)}`);
    const questions = await res.json();
    saveQuizState({ level, topic, questions, current: 0, score: 0, elapsedTime: 0, wrongAnswers: [] });
    router.push('/quiz');
  }

  function viewLeaderboard() {
    saveQuizState({ level, topic });
    router.push('/leaderboard');
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FrenchFlag opacity={0.13} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', padding: '2rem 1.5rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#111', margin: 0 }}>French Quiz</h1>
            {session?.user?.name && <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>Signed in as {session.user.name}</p>}
          </div>
          {session ? (
            <button onClick={() => signOut()} style={{ padding: '0.4rem 0.9rem', border: '1px solid #ccc', borderRadius: '8px', background: 'rgba(255,255,255,0.85)', color: '#666', cursor: 'pointer', fontSize: '13px' }}>Sign out</button>
          ) : (
            <button onClick={() => signIn('google')} style={{ padding: '0.4rem 0.9rem', border: '1px solid #002395', borderRadius: '8px', background: 'rgba(255,255,255,0.85)', color: '#002395', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Sign in with Google</button>
          )}
        </div>

        {!session && (
          <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '13px', color: '#666' }}>
            Sign in with Google to save your scores automatically. Or play as a guest and enter your name at the end.
          </div>
        )}

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
}

export default dynamic(() => Promise.resolve(StartPage), { ssr: false });
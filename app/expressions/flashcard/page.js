'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function FrenchFlag() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" style={{ borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
      <rect width="11" height="22" fill="#002395" />
      <rect x="11" width="10" height="22" fill="#FFFFFF" />
      <rect x="21" width="11" height="22" fill="#ED2939" />
    </svg>
  );
}

function AmericanFlag() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" style={{ borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
      {/* Stripes */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
        <rect key={i} x="0" y={i * (22/13)} width="32" height={22/13} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
      ))}
      {/* Blue canton */}
      <rect x="0" y="0" width="13" height="11" fill="#3C3B6E" />
      {/* Stars - simplified as small dots */}
      {[0,1,2,3,4].map(row => (
        [0,1,2,3,4,5].map(col => (
          <circle key={`${row}-${col}`} cx={1.2 + col * 2.1} cy={1.1 + row * 2.1} r="0.5" fill="white" />
        ))
      ))}
      {[0,1,2,3].map(row => (
        [0,1,2,3,4].map(col => (
          <circle key={`b${row}-${col}`} cx={2.2 + col * 2.1} cy={2.1 + row * 2.1} r="0.5" fill="white" />
        ))
      ))}
    </svg>
  );
}

function FlashcardPage() {
  const router = useRouter();
  const [expressions, setExpressions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [language, setLanguage] = useState('french');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('expressionsMode');
    if (!saved) { router.push('/expressions'); return; }
    const mode = JSON.parse(saved);
    setLanguage(mode.language || 'french');

    fetch('/api/expressions')
      .then(res => res.json())
      .then(data => {
        setExpressions(data);
        setHydrated(true);
      });
  }, []);

  function next() {
    setFlipped(false);
    setTimeout(() => setCurrent(c => Math.min(c + 1, expressions.length - 1)), 150);
  }

  function prev() {
    setFlipped(false);
    setTimeout(() => setCurrent(c => Math.max(c - 1, 0)), 150);
  }

  if (!hydrated || expressions.length === 0) return null;

  const expr = expressions[current];
  const front = language === 'french' ? expr.french : expr.english;
  const back = language === 'french' ? expr.english : expr.french;
  const pct = Math.round(((current + 1) / expressions.length) * 100);

  const frontIsFrench = language === 'french';
  const FrontFlag = frontIsFrench ? FrenchFlag : AmericanFlag;
  const BackFlag = frontIsFrench ? AmericanFlag : FrenchFlag;

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', marginBottom: '8px' }}>
        <span>Flashcards — {language === 'french' ? 'French → English' : 'English → French'}</span>
        <span>{current + 1} / {expressions.length}</span>
      </div>
      <div style={{ background: '#eee', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
        <div style={{ background: '#002395', height: '6px', borderRadius: '99px', width: `${pct}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          minHeight: '200px',
          background: flipped ? '#e8ecf7' : 'white',
          border: `2px solid ${flipped ? '#002395' : '#eee'}`,
          borderRadius: '16px',
          padding: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: '1.5rem',
          transition: 'background 0.2s, border-color 0.2s',
          position: 'relative',
        }}
      >
        {/* Flag in top left */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          {flipped ? <BackFlag /> : <FrontFlag />}
        </div>

        <div style={{ fontSize: '20px', fontWeight: '500', color: flipped ? '#002395' : '#111', lineHeight: '1.5' }}>
          {flipped ? back : front}
        </div>
        {!flipped && (
          <div style={{ fontSize: '12px', color: '#ccc', marginTop: '1.5rem' }}>Tap to reveal</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
        <button onClick={prev} disabled={current === 0} style={{ flex: 1, padding: '0.85rem', background: current === 0 ? '#eee' : 'white', color: current === 0 ? '#ccc' : '#333', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', cursor: current === 0 ? 'not-allowed' : 'pointer' }}>
          ← Previous
        </button>
        <button onClick={next} disabled={current === expressions.length - 1} style={{ flex: 1, padding: '0.85rem', background: current === expressions.length - 1 ? '#eee' : '#002395', color: current === expressions.length - 1 ? '#ccc' : 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: current === expressions.length - 1 ? 'not-allowed' : 'pointer' }}>
          Next →
        </button>
      </div>

      {current === expressions.length - 1 && (
        <button onClick={() => { setCurrent(0); setFlipped(false); }} style={{ width: '100%', padding: '0.85rem', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '1rem' }}>
          Start over
        </button>
      )}

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Return to home</button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(FlashcardPage), { ssr: false });
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadResults } from '../store';
import dynamic from 'next/dynamic';

function ReviewPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadResults();
    if (!saved || !saved.wrongAnswers?.length) {
      router.push('/');
      return;
    }
    setResults(saved);
    setHydrated(true);
  }, []);

  if (!hydrated || !results) return null;

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.25rem' }}>Review</h1>
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '1.5rem' }}>
        {results.wrongAnswers.length} incorrect answer{results.wrongAnswers.length > 1 ? 's' : ''} — {results.level} {results.topic}
      </p>

      {results.wrongAnswers.map((item, idx) => (
        <div key={idx} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '1rem', lineHeight: '1.5', color: '#111' }}>{item.question.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {item.question.options.map((o, i) => {
              let bg = 'white', border = '1px solid #eee', color = '#999';
              if (i === item.question.answer) { bg = '#EAF3DE'; border = '1px solid #3B6D11'; color = '#27500A'; }
              else if (i === item.selectedAnswer) { bg = '#FCEBEB'; border = '1px solid #A32D2D'; color = '#501313'; }
              return (
                <div key={i} style={{ padding: '0.6rem 0.9rem', border, borderRadius: '8px', background: bg, color, fontSize: '14px' }}>
                  {o}
                  {i === item.question.answer && <span style={{ marginLeft: '8px', fontSize: '12px' }}>✓ Correct</span>}
                  {i === item.selectedAnswer && i !== item.question.answer && <span style={{ marginLeft: '8px', fontSize: '12px' }}>✗ Your answer</span>}
                </div>
              );
            })}
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#f5f5f5', borderLeft: '3px solid #002395', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
            {item.question.explanation}
          </div>
        </div>
      ))}

      <button onClick={() => router.push('/results')} style={{ width: '100%', padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '0.5rem' }}>
        Back to results
      </button>
    </main>
  );
}

export default dynamic(() => Promise.resolve(ReviewPage), { ssr: false });
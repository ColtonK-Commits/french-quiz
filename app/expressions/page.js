'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function ExpressionsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('');
  const [format, setFormat] = useState('');
  const [questionCount, setQuestionCount] = useState('all');

  function start() {
    localStorage.setItem('expressionsMode', JSON.stringify({ language, format, questionCount }));
    router.push(`/expressions/${format}`);
  }

  const canStart = language && format;

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem' }}>Learn New Expressions</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '15px' }}>Choose how you want to study.</p>

      <h2 style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>LANGUAGE DIRECTION</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
        {[
          { value: 'french', label: 'Start in French', desc: 'See French — guess the English' },
          { value: 'english', label: 'Start in English', desc: 'See English — guess the French' },
        ].map((opt) => (
          <button key={opt.value} onClick={() => setLanguage(opt.value)} style={{ padding: '0.75rem 1rem', border: language === opt.value ? '2px solid #002395' : '1px solid #ccc', borderRadius: '8px', background: language === opt.value ? '#e8ecf7' : 'white', color: language === opt.value ? '#002395' : '#333', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontWeight: '500', fontSize: '15px' }}>{opt.label}</div>
            <div style={{ fontSize: '13px', color: language === opt.value ? '#002395' : '#999', marginTop: '2px' }}>{opt.desc}</div>
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>FORMAT</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
        {[
          { value: 'flashcard', label: 'Flashcards', desc: 'Flip through cards at your own pace' },
          { value: 'quiz', label: 'Quiz', desc: 'Choose the correct answer from 4 options' },
        ].map((opt) => (
          <button key={opt.value} onClick={() => setFormat(opt.value)} style={{ padding: '0.75rem 1rem', border: format === opt.value ? '2px solid #ED2939' : '1px solid #ccc', borderRadius: '8px', background: format === opt.value ? '#fdecea' : 'white', color: format === opt.value ? '#a01020' : '#333', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontWeight: '500', fontSize: '15px' }}>{opt.label}</div>
            <div style={{ fontSize: '13px', color: format === opt.value ? '#a01020' : '#999', marginTop: '2px' }}>{opt.desc}</div>
          </button>
        ))}
      </div>

      {format === 'quiz' && (
        <>
          <h2 style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>NUMBER OF QUESTIONS</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: 'all', label: 'All' },
            ].map((opt) => (
              <button key={opt.value} onClick={() => setQuestionCount(opt.value)} style={{ padding: '0.6rem 1.5rem', border: questionCount === opt.value ? '2px solid #1D9E75' : '1px solid #ccc', borderRadius: '8px', background: questionCount === opt.value ? '#EAF3DE' : 'white', color: questionCount === opt.value ? '#27500A' : '#333', cursor: 'pointer', fontWeight: questionCount === opt.value ? '500' : '400', fontSize: '15px' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      <button disabled={!canStart} onClick={start} style={{ width: '100%', padding: '0.85rem', background: canStart ? '#002395' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: canStart ? 'pointer' : 'not-allowed', marginBottom: '1rem' }}>
        Start
      </button>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Return to home</button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(ExpressionsPage), { ssr: false });
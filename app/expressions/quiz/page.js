'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function FrenchFlag() {
  return (
    <svg width="28" height="19" viewBox="0 0 32 22" style={{ borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginRight: '8px', verticalAlign: 'middle' }}>
      <rect width="11" height="22" fill="#002395" />
      <rect x="11" width="10" height="22" fill="#FFFFFF" />
      <rect x="21" width="11" height="22" fill="#ED2939" />
    </svg>
  );
}

function AmericanFlag() {
  return (
    <svg width="28" height="19" viewBox="0 0 32 22" style={{ borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginRight: '8px', verticalAlign: 'middle' }}>
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
        <rect key={i} x="0" y={i * (22/13)} width="32" height={22/13} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
      ))}
      <rect x="0" y="0" width="13" height="11" fill="#3C3B6E" />
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

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function ExpressionsQuizPage() {
  const router = useRouter();
  const [expressions, setExpressions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [language, setLanguage] = useState('french');
  const [hydrated, setHydrated] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('expressionsMode');
    if (!saved) { router.push('/expressions'); return; }
    const mode = JSON.parse(saved);
    setLanguage(mode.language || 'french');

    fetch('/api/expressions')
      .then(res => res.json())
      .then(data => {
        const shuffled = shuffle(data);
        const count = mode.questionCount === 'all' ? shuffled.length : Math.min(mode.questionCount, shuffled.length);
        setExpressions(shuffled.slice(0, count));
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!hydrated || expressions.length === 0) return;
    generateOptions(current);
  }, [current, hydrated, expressions]);

  function generateOptions(idx) {
    const correct = expressions[idx];
    const others = expressions.filter((_, i) => i !== idx);
    const wrong = shuffle(others).slice(0, 3);
    const allOptions = shuffle([correct, ...wrong]);
    setOptions(allOptions);
    setAnswered(false);
    setSelected(null);
  }

  function selectAnswer(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
  }

  function next() {
    if (current + 1 >= expressions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  }

  function restart() {
    setExpressions(prev => shuffle(prev));
    setCurrent(0);
    setDone(false);
    setAnswered(false);
    setSelected(null);
  }

  if (!hydrated || expressions.length === 0) return null;

  const expr = expressions[current];
  const question = language === 'french' ? expr.french : expr.english;
  const pct = Math.round(((current + 1) / expressions.length) * 100);
  const QuestionFlag = language === 'french' ? FrenchFlag : AmericanFlag;

  if (done) return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '52px', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem' }}>All done!</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>You went through all {expressions.length} expressions.</p>
      <button onClick={restart} style={{ width: '100%', padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '1rem' }}>
        Go again
      </button>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Return to home</button>
      </div>
    </main>
  );

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', marginBottom: '8px' }}>
        <span>Quiz — {language === 'french' ? 'French → English' : 'English → French'}</span>
        <span>{current + 1} / {expressions.length}</span>
      </div>
      <div style={{ background: '#eee', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
        <div style={{ background: '#002395', height: '6px', borderRadius: '99px', width: `${pct}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
          <QuestionFlag />
          <p style={{ fontSize: '17px', fontWeight: '500', lineHeight: '1.5', color: '#111', margin: 0 }}>{question}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, i) => {
            const answer = language === 'french' ? opt.english : opt.french;
            const isCorrect = opt.id === expr.id;
            let bg = 'white', border = '1px solid #ccc', color = '#333';
            if (answered) {
              if (isCorrect) { bg = '#EAF3DE'; border = '1px solid #3B6D11'; color = '#27500A'; }
              else if (i === selected) { bg = '#FCEBEB'; border = '1px solid #A32D2D'; color = '#501313'; }
            }
            return (
              <button key={i} onClick={() => selectAnswer(i)} disabled={answered} style={{ padding: '0.75rem 1rem', border, borderRadius: '8px', background: bg, color, cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontSize: '15px' }}>
                {answer}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span />
        {answered && (
          <button onClick={next} style={{ padding: '0.6rem 1.25rem', border: '1px solid #ccc', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
            {current + 1 < expressions.length ? 'Next →' : 'Finish →'}
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Return to home</button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(ExpressionsQuizPage), { ssr: false });
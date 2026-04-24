'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loadQuizState, saveQuizState, saveResults, clearQuizState } from '../store';
import dynamic from 'next/dynamic';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [state, setState] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = loadQuizState();
    if (!saved || !saved.questions?.length) {
      router.push('/');
      return;
    }
    setState(saved);
    setTimeout(() => setHydrated(true), 50);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (!prev) return prev;
        const updated = { ...prev, elapsedTime: (prev.elapsedTime || 0) + 1 };
        saveQuizState(updated);
        return updated;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hydrated]);

  function selectAnswer(i) {
    if (answered || !state) return;
    setSelected(i);
    setAnswered(true);
    const q = state.questions[state.current];
    const isCorrect = i === q.answer;
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newWrongAnswers = isCorrect
      ? state.wrongAnswers
      : [...state.wrongAnswers, { question: q, selectedAnswer: i }];
    setState(prev => ({ ...prev, score: newScore, wrongAnswers: newWrongAnswers }));
  }

  function next() {
    if (!state) return;
    const isLast = state.current + 1 >= state.questions.length;
    if (isLast) {
      clearInterval(timerRef.current);
      clearQuizState();
      const percentage = Math.round((state.score / state.questions.length) * 100);
      saveResults({
        level: state.level,
        topic: state.topic,
        score: state.score,
        total: state.questions.length,
        percentage,
        elapsedTime: state.elapsedTime,
        wrongAnswers: state.wrongAnswers,
        playerName: session?.user?.name || '',
      });
      if (session?.user?.name) {
        submitScore(session.user.name, state.score, state.questions.length, percentage, state.elapsedTime);
        router.push('/results');
      } else {
        router.push('/nameentry');
      }
    } else {
      const updated = { ...state, current: state.current + 1 };
      setState(updated);
      saveQuizState(updated);
      setAnswered(false);
      setSelected(null);
    }
  }

  async function submitScore(name, score, total, percentage, time) {
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, level: state.level, topic: state.topic, score, total, percentage, time }),
    });
  }

  if (!hydrated || !state) return null;

  const q = state.questions[state.current];
  const pct = Math.round((state.current / state.questions.length) * 100);

  return (
    <main style={{ maxWidth: '480px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', marginBottom: '8px' }}>
        <span>{state.level} — {state.topic}</span>
        <span style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: state.elapsedTime > 120 ? '#ED2939' : '#999' }}>⏱ {formatTime(state.elapsedTime)}</span>
          <span>{state.current + 1} / {state.questions.length}</span>
        </span>
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
        <span style={{ fontSize: '13px', color: '#999' }}>Score: {state.score} / {state.current + (answered ? 1 : 0)}</span>
        {answered && <button onClick={next} style={{ padding: '0.6rem 1.25rem', border: '1px solid #ccc', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>{state.current + 1 < state.questions.length ? 'Next →' : 'Finish →'}</button>}
      </div>
      <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        <button onClick={() => { clearInterval(timerRef.current); clearQuizState(); router.push('/'); }} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Return to home</button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(QuizPage), { ssr: false });
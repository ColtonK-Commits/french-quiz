'use client';

import { useState, useEffect } from 'react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TOPICS = ['French Grammar', 'French History & Geography', 'French Regional Food & Cooking'];

const emptyQuestion = {
  level: 'A1',
  topic: 'French Grammar',
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  answer: 0,
  explanation: '',
};

const emptyExpression = { french: '', english: '' };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('questions');

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(emptyQuestion);

  // Expressions state
  const [expressions, setExpressions] = useState([]);
  const [expressionsLoading, setExpressionsLoading] = useState(false);
  const [editingExprId, setEditingExprId] = useState(null);
  const [editExprForm, setEditExprForm] = useState({});
  const [showAddExprForm, setShowAddExprForm] = useState(false);
  const [addExprForm, setAddExprForm] = useState(emptyExpression);
  const [exprSearch, setExprSearch] = useState('');

  async function login() {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', password, question: emptyQuestion }),
    });
    if (res.status === 401) { setAuthError('Incorrect password.'); return; }
    setSavedPassword(password);
    setAuthed(true);
    loadQuestions();
    loadExpressions();
  }

  async function loadQuestions() {
    setQuestionsLoading(true);
    const params = new URLSearchParams();
    if (filterLevel) params.append('level', filterLevel);
    if (filterTopic) params.append('topic', filterTopic);
    const res = await fetch(`/api/admin?${params.toString()}`);
    const data = await res.json();
    setQuestions(data);
    setQuestionsLoading(false);
  }

  async function loadExpressions() {
    setExpressionsLoading(true);
    const res = await fetch('/api/expressions');
    const data = await res.json();
    setExpressions(data);
    setExpressionsLoading(false);
  }

  useEffect(() => { if (authed) loadQuestions(); }, [filterLevel, filterTopic]);

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  // Question actions
  async function saveEdit(id) {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'edit', password: savedPassword, question: { ...editForm, id } }),
    });
    setEditingId(null);
    showMessage('Question updated!');
    loadQuestions();
  }

  async function deleteQuestion(id) {
    if (!confirm('Delete this question?')) return;
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', password: savedPassword, question: { id } }),
    });
    showMessage('Question deleted!');
    loadQuestions();
  }

  async function addQuestion() {
    const required = [addForm.question, addForm.option_a, addForm.option_b, addForm.option_c, addForm.option_d, addForm.explanation];
    if (required.some(f => !f || !f.trim())) { showMessage('Please fill in all fields.'); return; }
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', password: savedPassword, question: addForm }),
    });
    setAddForm(emptyQuestion);
    setShowAddForm(false);
    showMessage('Question added!');
    loadQuestions();
  }

  // Expression actions
  async function addExpression() {
    if (!addExprForm.french.trim() || !addExprForm.english.trim()) { showMessage('Please fill in both fields.'); return; }
    await fetch('/api/admin/expressions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', password: savedPassword, expression: addExprForm }),
    });
    setAddExprForm(emptyExpression);
    setShowAddExprForm(false);
    showMessage('Expression added!');
    loadExpressions();
  }

  async function saveExprEdit(id) {
    await fetch('/api/admin/expressions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'edit', password: savedPassword, expression: { ...editExprForm, id } }),
    });
    setEditingExprId(null);
    showMessage('Expression updated!');
    loadExpressions();
  }

  async function deleteExpression(id) {
    if (!confirm('Delete this expression?')) return;
    await fetch('/api/admin/expressions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', password: savedPassword, expression: { id } }),
    });
    showMessage('Expression deleted!');
    loadExpressions();
  }

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '6px' };
  const labelStyle = { fontSize: '12px', color: '#999', display: 'block', marginBottom: '2px' };

  const filteredExpressions = expressions.filter(e =>
    e.french.toLowerCase().includes(exprSearch.toLowerCase()) ||
    e.english.toLowerCase().includes(exprSearch.toLowerCase())
  );

  if (!authed) return (
    <main style={{ maxWidth: '400px', margin: '8rem auto', fontFamily: 'sans-serif', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '0.5rem' }}>Admin Panel</h1>
      <p style={{ color: '#999', marginBottom: '2rem', fontSize: '14px' }}>Enter the admin password to continue.</p>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} style={{ ...inputStyle, marginBottom: '1rem', fontSize: '16px', padding: '0.75rem 1rem' }} />
      {authError && <p style={{ color: '#ED2939', fontSize: '14px', marginBottom: '1rem' }}>{authError}</p>}
      <button onClick={login} style={{ width: '100%', padding: '0.85rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>Login</button>
    </main>
  );

  return (
    <main style={{ maxWidth: '900px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', margin: 0 }}>Admin Panel</h1>
        <a href="/" style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', color: '#666', textDecoration: 'none' }}>← Back to quiz</a>
      </div>

      {message && <div style={{ background: '#EAF3DE', border: '1px solid #3B6D11', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '14px', color: '#27500A' }}>{message}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0' }}>
        {['questions', 'expressions'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.6rem 1.25rem', border: 'none', borderBottom: activeTab === tab ? '2px solid #002395' : '2px solid transparent', background: 'none', color: activeTab === tab ? '#002395' : '#999', fontWeight: activeTab === tab ? '500' : '400', fontSize: '15px', cursor: 'pointer', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '0.5rem 1rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
              {showAddForm ? 'Cancel' : '+ Add Question'}
            </button>
          </div>

          {showAddForm && (
            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Add New Question</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelStyle}>Level</label>
                  <select value={addForm.level} onChange={(e) => setAddForm({ ...addForm, level: e.target.value })} style={inputStyle}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Topic</label>
                  <select value={addForm.topic} onChange={(e) => setAddForm({ ...addForm, topic: e.target.value })} style={inputStyle}>
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <label style={labelStyle}>Question</label>
              <textarea value={addForm.question} onChange={(e) => setAddForm({ ...addForm, question: e.target.value })} style={{ ...inputStyle, height: '70px', resize: 'vertical' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, i) => (
                  <div key={opt}>
                    <label style={labelStyle}>Option {['A', 'B', 'C', 'D'][i]}</label>
                    <input value={addForm[opt]} onChange={(e) => setAddForm({ ...addForm, [opt]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
              </div>
              <label style={labelStyle}>Correct Answer</label>
              <select value={addForm.answer} onChange={(e) => setAddForm({ ...addForm, answer: parseInt(e.target.value) })} style={inputStyle}>
                {['A (0)', 'B (1)', 'C (2)', 'D (3)'].map((opt, i) => <option key={i} value={i}>{opt}</option>)}
              </select>
              <label style={labelStyle}>Explanation</label>
              <textarea value={addForm.explanation} onChange={(e) => setAddForm({ ...addForm, explanation: e.target.value })} style={{ ...inputStyle, height: '70px', resize: 'vertical' }} />
              <button onClick={addQuestion} style={{ padding: '0.75rem 1.5rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '0.5rem' }}>Save Question</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px' }}>
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px' }}>
              <option value="">All Topics</option>
              {TOPICS.map(t => <option key={t}>{t}</option>)}
            </select>
            <span style={{ fontSize: '14px', color: '#999' }}>{questions.length} questions</span>
          </div>

          {questionsLoading ? <p style={{ color: '#999' }}>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questions.map((q) => (
                <div key={q.id} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.25rem' }}>
                  {editingId === q.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>Level</label>
                          <select value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })} style={inputStyle}>
                            {LEVELS.map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Topic</label>
                          <select value={editForm.topic} onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })} style={inputStyle}>
                            {TOPICS.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <label style={labelStyle}>Question</label>
                      <textarea value={editForm.question} onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} style={{ ...inputStyle, height: '70px', resize: 'vertical' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, i) => (
                          <div key={opt}>
                            <label style={labelStyle}>Option {['A', 'B', 'C', 'D'][i]}</label>
                            <input value={editForm[opt]} onChange={(e) => setEditForm({ ...editForm, [opt]: e.target.value })} style={inputStyle} />
                          </div>
                        ))}
                      </div>
                      <label style={labelStyle}>Correct Answer</label>
                      <select value={editForm.answer} onChange={(e) => setEditForm({ ...editForm, answer: parseInt(e.target.value) })} style={inputStyle}>
                        {['A (0)', 'B (1)', 'C (2)', 'D (3)'].map((opt, i) => <option key={i} value={i}>{opt}</option>)}
                      </select>
                      <label style={labelStyle}>Explanation</label>
                      <textarea value={editForm.explanation} onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })} style={{ ...inputStyle, height: '70px', resize: 'vertical' }} />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                        <button onClick={() => saveEdit(q.id)} style={{ padding: '0.5rem 1rem', background: '#002395', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '12px', padding: '2px 8px', background: '#e8ecf7', color: '#002395', borderRadius: '99px' }}>{q.level}</span>
                          <span style={{ fontSize: '12px', padding: '2px 8px', background: '#fdecea', color: '#a01020', borderRadius: '99px' }}>{q.topic}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditingId(q.id); setEditForm(q); }} style={{ padding: '0.3rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', background: 'white', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => deleteQuestion(q.id)} style={{ padding: '0.3rem 0.75rem', border: '1px solid #ED2939', borderRadius: '6px', background: 'white', color: '#ED2939', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </div>
                      <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '0.75rem', color: '#111' }}>{q.question}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '0.75rem' }}>
                        {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
                          <div key={i} style={{ fontSize: '13px', padding: '0.4rem 0.75rem', background: i === q.answer ? '#EAF3DE' : '#f5f5f5', color: i === q.answer ? '#27500A' : '#555', borderRadius: '6px' }}>
                            {['A', 'B', 'C', 'D'][i]}. {opt}
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0, fontStyle: 'italic' }}>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Expressions Tab */}
      {activeTab === 'expressions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              placeholder="Search expressions..."
              value={exprSearch}
              onChange={(e) => setExprSearch(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', width: '60%' }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#999' }}>{filteredExpressions.length} expressions</span>
              <button onClick={() => setShowAddExprForm(!showAddExprForm)} style={{ padding: '0.5rem 1rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                {showAddExprForm ? 'Cancel' : '+ Add'}
              </button>
            </div>
          </div>

          {showAddExprForm && (
            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Add New Expression</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>French</label>
                  <textarea value={addExprForm.french} onChange={(e) => setAddExprForm({ ...addExprForm, french: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="French expression..." />
                </div>
                <div>
                  <label style={labelStyle}>English</label>
                  <textarea value={addExprForm.english} onChange={(e) => setAddExprForm({ ...addExprForm, english: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="English translation..." />
                </div>
              </div>
              <button onClick={addExpression} style={{ padding: '0.75rem 1.5rem', background: '#002395', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '0.5rem' }}>Save Expression</button>
            </div>
          )}

          {expressionsLoading ? <p style={{ color: '#999' }}>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredExpressions.map((expr) => (
                <div key={expr.id} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  {editingExprId === expr.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                        <div>
                          <label style={labelStyle}>French</label>
                          <textarea value={editExprForm.french} onChange={(e) => setEditExprForm({ ...editExprForm, french: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                        </div>
                        <div>
                          <label style={labelStyle}>English</label>
                          <textarea value={editExprForm.english} onChange={(e) => setEditExprForm({ ...editExprForm, english: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => saveExprEdit(expr.id)} style={{ padding: '0.5rem 1rem', background: '#002395', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditingExprId(null)} style={{ padding: '0.5rem 1rem', background: 'white', color: '#666', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
                        <div style={{ fontSize: '14px', color: '#111' }}>{expr.french}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{expr.english}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button onClick={() => { setEditingExprId(expr.id); setEditExprForm(expr); }} style={{ padding: '0.3rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', background: 'white', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deleteExpression(expr.id)} style={{ padding: '0.3rem 0.75rem', border: '1px solid #ED2939', borderRadius: '6px', background: 'white', color: '#ED2939', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
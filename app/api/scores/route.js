import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const topic = searchParams.get('topic');

  if (!level || !topic) {
    return Response.json({ error: 'Level and topic are required' }, { status: 400 });
  }

  try {
    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));
    const scores = db.prepare(`
      SELECT name, score, total, percentage, time, date 
      FROM scores 
      WHERE level = ? AND topic = ? 
      ORDER BY percentage DESC, score DESC, time ASC
      LIMIT 10
    `).all(level, topic);
    db.close();
    return Response.json(scores);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, level, topic, score, total, percentage, time } = body;

    if (!name || !level || !topic || score === undefined || !total || !percentage) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));
    const date = new Date().toLocaleDateString('en-GB');
    
    db.prepare(`
      INSERT INTO scores (name, level, topic, score, total, percentage, time, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, level, topic, score, total, percentage, time || 0, date);
    
    db.close();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
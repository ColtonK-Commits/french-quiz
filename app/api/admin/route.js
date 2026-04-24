import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const topic = searchParams.get('topic');

  try {
    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));
    let query = 'SELECT * FROM questions';
    const params = [];

    if (level && topic) {
      query += ' WHERE level = ? AND topic = ?';
      params.push(level, topic);
    } else if (level) {
      query += ' WHERE level = ?';
      params.push(level);
    } else if (topic) {
      query += ' WHERE topic = ?';
      params.push(topic);
    }

    query += ' ORDER BY level, topic, id';
    const questions = db.prepare(query).all(...params);
    db.close();
    return Response.json(questions);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, password, question } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));

    if (action === 'add') {
      db.prepare(`
        INSERT INTO questions (level, topic, question, option_a, option_b, option_c, option_d, answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(question.level, question.topic, question.question, question.option_a, question.option_b, question.option_c, question.option_d, question.answer, question.explanation);
    }

    if (action === 'edit') {
      db.prepare(`
        UPDATE questions SET level=?, topic=?, question=?, option_a=?, option_b=?, option_c=?, option_d=?, answer=?, explanation=? WHERE id=?
      `).run(question.level, question.topic, question.question, question.option_a, question.option_b, question.option_c, question.option_d, question.answer, question.explanation, question.id);
    }

    if (action === 'delete') {
      db.prepare('DELETE FROM questions WHERE id = ?').run(question.id);
    }

    db.close();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
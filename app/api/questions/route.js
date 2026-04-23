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
    const questions = db.prepare(
      'SELECT * FROM questions WHERE level = ? AND topic = ? ORDER BY RANDOM()'
    ).all(level, topic);
    db.close();

    const formatted = questions.map(q => ({
      q: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      answer: q.answer,
      explanation: q.explanation,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));
    const expressions = db.prepare('SELECT * FROM expressions ORDER BY RANDOM()').all();
    db.close();
    return Response.json(expressions);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
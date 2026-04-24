import Database from 'better-sqlite3';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, password, expression } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = new Database(path.join(process.cwd(), 'french_quiz.db'));

    if (action === 'add') {
      db.prepare(`
        INSERT INTO expressions (french, english)
        VALUES (?, ?)
      `).run(expression.french, expression.english);
    }

    if (action === 'edit') {
      db.prepare(`
        UPDATE expressions SET french=?, english=? WHERE id=?
      `).run(expression.french, expression.english, expression.id);
    }

    if (action === 'delete') {
      db.prepare('DELETE FROM expressions WHERE id = ?').run(expression.id);
    }

    db.close();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
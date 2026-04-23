import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'french_quiz.db'));

const insert = db.prepare(`
  INSERT INTO questions (level, topic, question, option_a, option_b, option_c, option_d, answer, explanation)
  VALUES (@level, @topic, @question, @option_a, @option_b, @option_c, @option_d, @answer, @explanation)
`);

const newQuestions = [
  {
    level: 'A1',
    topic: 'French Grammar',
    question: 'Complete: Je ___ faim.',
    option_a: 'suis',
    option_b: 'ai',
    option_c: 'est',
    option_d: 'as',
    answer: 1,
    explanation: "In French you say 'avoir faim' (to have hunger) not 'être faim'. Je ai faim = I am hungry."
  },
  {
    

];

const insertMany = db.transaction((qs) => {
  for (const q of qs) insert.run(q);
});

insertMany(newQuestions);
console.log(`${newQuestions.length} new questions added successfully!`);
db.close();
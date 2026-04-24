// Migration run: March 2026 — Initial database setup (questions table)
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'french_quiz.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    answer INTEGER NOT NULL,
    explanation TEXT NOT NULL
  )
`);

const insert = db.prepare(`
  INSERT INTO questions (level, topic, question, option_a, option_b, option_c, option_d, answer, explanation)
  VALUES (@level, @topic, @question, @option_a, @option_b, @option_c, @option_d, @answer, @explanation)
`);

const questions = [
  { level: 'A1', topic: 'French Grammar', question: 'Choose the correct article: ___ chat est mignon.', option_a: 'Le', option_b: 'La', option_c: 'Les', option_d: 'Un', answer: 0, explanation: "'Chat' is masculine so we use 'le'. Le chat = the cat." },
  { level: 'A1', topic: 'French Grammar', question: 'Choose the correct article: ___ maison est grande.', option_a: 'Le', option_b: 'La', option_c: 'Un', option_d: 'Des', answer: 1, explanation: "'Maison' is feminine so we use 'la'. La maison = the house." },
  { level: 'A1', topic: 'French Grammar', question: 'Complete: Je ___ étudiant.', option_a: 'es', option_b: 'est', option_c: 'suis', option_d: 'êtes', answer: 2, explanation: "'Être' conjugated for 'je' is 'suis'. Je suis étudiant = I am a student." },
  { level: 'A1', topic: 'French Grammar', question: 'Complete: Vous ___ français?', option_a: 'suis', option_b: 'sommes', option_c: 'êtes', option_d: 'sont', answer: 2, explanation: "'Êtes' is the 'vous' form of être." },
  { level: 'A1', topic: 'French Grammar', question: 'Complete: Elle ___ un chien.', option_a: 'ai', option_b: 'as', option_c: 'avez', option_d: 'a', answer: 3, explanation: "'A' is the 'elle/il' form of avoir. Elle a un chien = She has a dog." },
  { level: 'A1', topic: 'French Grammar', question: 'Make negative: Je mange une pomme.', option_a: 'Je mange pas une pomme.', option_b: 'Je ne mange pas une pomme.', option_c: 'Je ne mange une pomme pas.', option_d: 'Je pas mange une pomme.', answer: 1, explanation: "French negation uses 'ne...pas' around the verb." },
  { level: 'A1', topic: 'French Grammar', question: 'How do you say 15 in French?', option_a: 'Cinq', option_b: 'Douze', option_c: 'Quinze', option_d: 'Treize', answer: 2, explanation: "Quinze = 15." },
  { level: 'A1', topic: 'French History & Geography', question: 'What is the capital of France?', option_a: 'Lyon', option_b: 'Marseille', option_c: 'Paris', option_d: 'Bordeaux', answer: 2, explanation: "Paris has been the capital of France since the 10th century." },
  { level: 'A1', topic: 'French History & Geography', question: 'Which river runs through Paris?', option_a: 'Loire', option_b: 'Rhône', option_c: 'Garonne', option_d: 'Seine', answer: 3, explanation: "The Seine runs through the heart of Paris." },
  { level: 'A1', topic: 'French History & Geography', question: 'What famous tower is in Paris?', option_a: 'Big Ben', option_b: 'Eiffel Tower', option_c: 'Colosseum', option_d: 'Sagrada Familia', answer: 1, explanation: "The Eiffel Tower was built in 1889 for the World Fair." },
  { level: 'A1', topic: 'French History & Geography', question: 'France shares a border with which country?', option_a: 'Poland', option_b: 'Sweden', option_c: 'Spain', option_d: 'Greece', answer: 2, explanation: "France borders Spain to the south via the Pyrenees mountains." },
  { level: 'A1', topic: 'French History & Geography', question: 'What is the largest region in France by area?', option_a: 'Bretagne', option_b: 'Normandie', option_c: 'Nouvelle-Aquitaine', option_d: 'Occitanie', answer: 2, explanation: "Nouvelle-Aquitaine is the largest region in France." },
  { level: 'A1', topic: 'French History & Geography', question: 'In what year did the French Revolution begin?', option_a: '1750', option_b: '1789', option_c: '1810', option_d: '1832', answer: 1, explanation: "The French Revolution began in 1789 with the storming of the Bastille." },
  { level: 'A1', topic: 'French History & Geography', question: 'What ocean borders France to the west?', option_a: 'Indian Ocean', option_b: 'Pacific Ocean', option_c: 'Arctic Ocean', option_d: 'Atlantic Ocean', answer: 3, explanation: "The Atlantic Ocean borders France to the west." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'Which region is known for croissants and baguettes?', option_a: 'Bretagne', option_b: 'Alsace', option_c: 'Île-de-France', option_d: 'Provence', answer: 2, explanation: "Île-de-France, particularly Paris, is most associated with croissants and baguettes." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'What is a baguette?', option_a: 'A French cheese', option_b: 'A long thin bread', option_c: 'A type of wine', option_d: 'A French dessert', answer: 1, explanation: "A baguette is the iconic long thin French bread loaf." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'Which region is famous for its wine and Boeuf Bourguignon?', option_a: 'Normandie', option_b: 'Bretagne', option_c: 'Bourgogne', option_d: 'Alsace', answer: 2, explanation: "Bourgogne (Burgundy) is famous for its wine and Boeuf Bourguignon." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'What is crème brûlée?', option_a: 'A type of bread', option_b: 'A custard dessert with caramelised sugar top', option_c: 'A savoury tart', option_d: 'A cheese dish', answer: 1, explanation: "Crème brûlée is a creamy custard dessert with a hard caramelised sugar crust on top." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'Bouillabaisse is a famous dish from which city?', option_a: 'Paris', option_b: 'Lyon', option_c: 'Marseille', option_d: 'Bordeaux', answer: 2, explanation: "Bouillabaisse is a traditional Provençal fish stew originating from Marseille." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'What is a quiche?', option_a: 'A French soup', option_b: 'A savoury tart with egg and cream filling', option_c: 'A type of cheese', option_d: 'A sweet pastry', answer: 1, explanation: "A quiche is a savoury open tart with a filling of eggs, cream and various ingredients." },
  { level: 'A1', topic: 'French Regional Food & Cooking', question: 'Which region is known for crepes?', option_a: 'Provence', option_b: 'Alsace', option_c: 'Bretagne', option_d: 'Bourgogne', answer: 2, explanation: "Bretagne (Brittany) is the home of the crepe and the heartier buckwheat galette." },
  { level: 'A2', topic: 'French Grammar', question: 'Which is correct: "J\'___ allé au cinéma hier."', option_a: 'ai', option_b: 'suis', option_c: 'avoir', option_d: 'être', answer: 1, explanation: "'Aller' uses 'être' as auxiliary in passé composé. Je suis allé = I went." },
  { level: 'A2', topic: 'French Grammar', question: 'Complete with the correct pronoun: "___ livre est intéressant."', option_a: 'Ce', option_b: 'Cet', option_c: 'Cette', option_d: 'Ces', answer: 0, explanation: "'Livre' is masculine and starts with a consonant so we use 'ce'. Ce livre = this book." },
  { level: 'A2', topic: 'French Grammar', question: 'Which sentence uses the imparfait correctly?', option_a: 'Hier, je mange une pizza.', option_b: "Quand j'étais enfant, je jouais au foot.", option_c: 'Demain, je jouais au tennis.', option_d: "Je suis allé à l'école hier.", answer: 1, explanation: "The imparfait describes habitual past actions. 'Quand j'étais enfant' = when I was a child." },
  { level: 'A2', topic: 'French Grammar', question: 'Complete: "Tu dois ___ tes devoirs."', option_a: 'faire', option_b: 'fais', option_c: 'fait', option_d: 'faites', answer: 0, explanation: "After modal verbs like 'devoir' the following verb stays in the infinitive." },
  { level: 'A2', topic: 'French Grammar', question: 'Which word means "however" in French?', option_a: 'Donc', option_b: 'Puis', option_c: 'Cependant', option_d: 'Alors', answer: 2, explanation: "'Cependant' means however or nevertheless." },
  { level: 'A2', topic: 'French Grammar', question: 'Complete: "Il y ___ beaucoup de monde."', option_a: 'a', option_b: 'est', option_c: 'sont', option_d: 'ont', answer: 0, explanation: "'Il y a' means there is/there are. It is a fixed expression in French." },
  { level: 'A2', topic: 'French Grammar', question: 'Which is the correct plural?', option_a: 'Les cheval', option_b: 'Les chevals', option_c: 'Les chevaux', option_d: 'Les chevauxs', answer: 2, explanation: "Cheval (horse) has an irregular plural — chevaux. Many words ending in -al change to -aux in the plural." },
  { level: 'A2', topic: 'French History & Geography', question: 'Who was the first Emperor of France?', option_a: 'Louis XIV', option_b: 'Napoleon Bonaparte', option_c: 'Charles de Gaulle', option_d: 'François I', answer: 1, explanation: "Napoleon Bonaparte became the first Emperor of France in 1804." },
  { level: 'A2', topic: 'French History & Geography', question: 'What is the name of the French national anthem?', option_a: 'La Parisienne', option_b: 'Le Tricolore', option_c: 'La Marseillaise', option_d: 'Chant du Départ', answer: 2, explanation: "La Marseillaise has been the French national anthem since 1795." },
  { level: 'A2', topic: 'French History & Geography', question: 'Which mountain range separates France from Italy?', option_a: 'Pyrenees', option_b: 'Vosges', option_c: 'Massif Central', option_d: 'Alps', answer: 3, explanation: "The Alps form the border between France and Italy to the southeast." },
  { level: 'A2', topic: 'French History & Geography', question: 'Which French king was known as the Sun King?', option_a: 'Louis XIII', option_b: 'Louis XIV', option_c: 'Louis XV', option_d: 'Louis XVI', answer: 1, explanation: "Louis XIV was known as the Sun King and built the Palace of Versailles." },
  { level: 'A2', topic: 'French History & Geography', question: 'What sea borders the south of France?', option_a: 'North Sea', option_b: 'Black Sea', option_c: 'Mediterranean Sea', option_d: 'Baltic Sea', answer: 2, explanation: "The Mediterranean Sea borders the south of France." },
  { level: 'A2', topic: 'French History & Geography', question: 'In which century was the Eiffel Tower built?', option_a: '17th century', option_b: '18th century', option_c: '19th century', option_d: '20th century', answer: 2, explanation: "The Eiffel Tower was built in 1889 — the 19th century." },
  { level: 'A2', topic: 'French History & Geography', question: "What does the French flag's motto 'Liberté, Égalité, Fraternité' mean?", option_a: 'Land, sea and sky', option_b: 'Liberty, equality, fraternity', option_c: 'Past, present and future', option_d: 'Army, navy and airforce', answer: 1, explanation: "Liberté, Égalité, Fraternité — Liberty, Equality, Fraternity — is the motto of the French Republic." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'What cooking technique is "confit"?', option_a: 'Grilling over high heat', option_b: 'Slow cooking in its own fat', option_c: 'Steaming over water', option_d: 'Deep frying in oil', answer: 1, explanation: "Confit is a preservation technique where meat is slow cooked and preserved in its own fat." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'Which region produces Camembert cheese?', option_a: 'Provence', option_b: 'Alsace', option_c: 'Normandie', option_d: 'Bourgogne', answer: 2, explanation: "Camembert originates from Normandie in northern France." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'What is a roux used for in French cooking?', option_a: 'Sweetening desserts', option_b: 'Thickening sauces', option_c: 'Marinating meat', option_d: 'Preserving vegetables', answer: 1, explanation: "A roux is a mixture of butter and flour cooked together — the base for thickening classic French sauces." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'Cassoulet is a slow cooked casserole from which region?', option_a: 'Bretagne', option_b: 'Normandie', option_c: 'Languedoc', option_d: 'Alsace', answer: 2, explanation: "Cassoulet is a rich slow cooked casserole of white beans and meat from the Languedoc region." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'What is the main ingredient in vichyssoise?', option_a: 'Tomato', option_b: 'Carrot', option_c: 'Leek and potato', option_d: 'Mushroom', answer: 2, explanation: "Vichyssoise is a classic French cold cream soup made from leeks and potatoes." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'What does "sauté" mean in French cooking?', option_a: 'To boil slowly', option_b: 'To cook quickly in a little fat', option_c: 'To bake in the oven', option_d: 'To poach in water', answer: 1, explanation: "Sauté literally means jumped in French — food is cooked quickly in a pan with a little fat over high heat." },
  { level: 'A2', topic: 'French Regional Food & Cooking', question: 'Which region is associated with choucroute garnie?', option_a: 'Provence', option_b: 'Bretagne', option_c: 'Alsace', option_d: 'Bourgogne', answer: 2, explanation: "Choucroute garnie — sauerkraut with sausages and meats — is the signature dish of Alsace." },
];

const insertMany = db.transaction((qs) => {
  for (const q of qs) insert.run(q);
});

insertMany(questions);
console.log('Database created and questions inserted successfully!');
db.close();
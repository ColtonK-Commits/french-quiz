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

  // A1 Grammar — 1 more needed
  {
    level: 'A1', topic: 'French Grammar',
    question: 'Which is correct: "Il ___ un professeur."',
    option_a: 'suis', option_b: 'es', option_c: 'est', option_d: 'sont',
    answer: 2,
    explanation: "'Est' is the il/elle form of être. Il est un professeur = He is a teacher."
  },

  // A1 History & Geography — 1 more needed
  {
    level: 'A1', topic: 'French History & Geography',
    question: 'What language do people speak in France?',
    option_a: 'Spanish', option_b: 'French', option_c: 'Italian', option_d: 'Portuguese',
    answer: 1,
    explanation: "French is the official language of France and is spoken by around 68 million people there."
  },

  // A1 Food & Cooking — 2 more needed
  {
    level: 'A1', topic: 'French Regional Food & Cooking',
    question: 'What is a croissant?',
    option_a: 'A type of cheese', option_b: 'A buttery crescent shaped pastry', option_c: 'A French stew', option_d: 'A type of wine',
    answer: 1,
    explanation: "A croissant is a buttery flaky crescent shaped pastry, originally inspired by the Austrian kipferl and perfected in France."
  },
  {
    level: 'A1', topic: 'French Regional Food & Cooking',
    question: 'Which of these is a French cheese?',
    option_a: 'Cheddar', option_b: 'Gouda', option_c_: 'Brie', option_d: 'Parmesan',
    option_c: 'Brie',
    answer: 2,
    explanation: "Brie is a soft creamy cheese from the Brie region of northern France, one of the most famous French cheeses in the world."
  },

  // A2 Grammar — 2 more needed
  {
    level: 'A2', topic: 'French Grammar',
    question: 'Choose the correct comparative: "Marie est ___ grande que Pierre."',
    option_a: 'plus', option_b: 'très', option_c: 'beaucoup', option_d: 'trop',
    answer: 0,
    explanation: "'Plus...que' means more...than in French. Marie est plus grande que Pierre = Marie is taller than Pierre."
  },
  {
    level: 'A2', topic: 'French Grammar',
    question: 'Which sentence is in the futur simple?',
    option_a: 'Je mange une pomme.', option_b: 'J\'ai mangé une pomme.', option_c: 'Je mangeais une pomme.', option_d: 'Je mangerai une pomme.',
    answer: 3,
    explanation: "'Je mangerai' is the futur simple form of manger. It means I will eat — formed by adding the futur endings to the infinitive."
  },

  // A2 History & Geography — 2 more needed
  {
    level: 'A2', topic: 'French History & Geography',
    question: 'What is the name of the royal palace near Paris built by Louis XIV?',
    option_a: 'The Louvre', option_b: 'Château de Chambord', option_c: 'Palace of Versailles', option_d: 'Château de Vincennes',
    answer: 2,
    explanation: "The Palace of Versailles was built by Louis XIV and became the centre of French political power for over a century."
  },
  {
    level: 'A2', topic: 'French History & Geography',
    question: 'Which French overseas territory is located in the Caribbean?',
    option_a: 'Réunion', option_b: 'French Guiana', option_c: 'Martinique', option_d: 'New Caledonia',
    answer: 2,
    explanation: "Martinique is a French overseas territory located in the Caribbean Sea. It is fully part of France and the European Union."
  },

  // A2 Food & Cooking — 2 more needed
  {
    level: 'A2', topic: 'French Regional Food & Cooking',
    question: 'What is the difference between a crêpe and a galette?',
    option_a: 'A galette is sweet, a crêpe is savoury', option_b: 'A crêpe is made with wheat flour, a galette with buckwheat', option_c: 'They are exactly the same thing', option_d: 'A galette is thicker than a crêpe',
    answer: 1,
    explanation: "Crêpes are made with wheat flour and are typically sweet. Galettes are made with buckwheat flour and are traditionally savoury, filled with cheese, ham or eggs."
  },
  {
    level: 'A2', topic: 'French Regional Food & Cooking',
    question: 'What is "beurre blanc"?',
    option_a: 'A type of white bread', option_b: 'A classic French butter sauce', option_c: 'A white wine from Burgundy', option_d: 'A cream based dessert',
    answer: 1,
    explanation: "Beurre blanc is a classic French sauce made from butter, white wine and shallots, typically served with fish. It originated in the Loire Valley."
  },

  // B1 Grammar — 10 needed
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Which sentence uses the subjonctif correctly?',
    option_a: 'Je veux que tu viens.', option_b: 'Je veux que tu viennes.', option_c: 'Je veux que tu venais.', option_d: 'Je veux que tu es venu.',
    answer: 1,
    explanation: "After 'je veux que' the subjunctive is required. 'Viennes' is the subjunctive form of venir for 'tu'. Je veux que tu viennes = I want you to come."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'What does the conditionnel present express?',
    option_a: 'A completed past action', option_b: 'A habitual past action', option_c: 'A hypothetical or polite action', option_d: 'A future certainty',
    answer: 2,
    explanation: "The conditionnel present expresses hypothetical situations (if I were rich, I would buy...) and polite requests (I would like...). Je voudrais un café = I would like a coffee."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Choose the correct relative pronoun: "C\'est le livre ___ j\'ai lu."',
    option_a: 'qui', option_b: 'que', option_c: 'dont', option_d: 'où',
    answer: 1,
    explanation: "'Que' is used as a relative pronoun when it replaces the direct object of the clause. C'est le livre que j'ai lu = It's the book that I read."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Which sentence correctly uses "dont"?',
    option_a: 'C\'est la ville dont je visite.', option_b: 'C\'est l\'homme dont je parle.', option_c: 'C\'est le film dont j\'ai vu.', option_d: 'C\'est la maison dont elle habite.',
    answer: 1,
    explanation: "'Dont' replaces de + noun. Parler de quelqu'un = to talk about someone. C'est l'homme dont je parle = He's the man I'm talking about."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'What is the correct passive form of "On a construit cette église au 12ème siècle"?',
    option_a: 'Cette église a été construite au 12ème siècle.', option_b: 'Cette église était construite au 12ème siècle.', option_c: 'Cette église a construit au 12ème siècle.', option_d: 'Cette église sera construite au 12ème siècle.',
    answer: 0,
    explanation: "The passive voice in French uses être + past participle. The past participle agrees with the subject — église is feminine so 'construite'."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Complete with the correct pronoun: "Je ___ ai parlé hier." (referring to mes amis)',
    option_a: 'les', option_b: 'leur', option_c: 'y', option_d: 'en',
    answer: 1,
    explanation: "'Leur' is the indirect object pronoun for plural people. Parler à quelqu'un = to speak to someone. Je leur ai parlé = I spoke to them."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Which sentence uses "y" correctly?',
    option_a: 'J\'y pense souvent.', option_b: 'Je y vais demain.', option_c: 'Il y mange une pomme.', option_d: 'Nous y aimons beaucoup.',
    answer: 0,
    explanation: "'Y' replaces a location or an expression with 'à'. Penser à quelque chose = to think about something. J'y pense = I think about it."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'What tense is used in "Si j\'avais de l\'argent, j\'achèterais une voiture"?',
    option_a: 'Imparfait + futur simple', option_b: 'Imparfait + conditionnel présent', option_c: 'Plus-que-parfait + conditionnel passé', option_d: 'Présent + conditionnel présent',
    answer: 1,
    explanation: "This is a hypothetical condition (type 2). The structure is imparfait in the si clause + conditionnel présent in the result clause."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Choose the correct form: "Il faut que nous ___ à l\'heure."',
    option_a: 'arrivons', option_b: 'arriverons', option_c: 'arrivions', option_d: 'arrivions',
    answer: 2,
    explanation: "'Il faut que' always triggers the subjunctive. 'Arrivions' is the subjunctive form of arriver for 'nous'."
  },
  {
    level: 'B1', topic: 'French Grammar',
    question: 'Which is the correct use of "en"?',
    option_a: 'J\'en vais au marché.', option_b: 'Elle en a mangé trois.', option_c: 'Nous en allons partir.', option_d: 'Tu en aimes le chocolat.',
    answer: 1,
    explanation: "'En' replaces a quantity or a noun preceded by 'de'. Elle a mangé trois croissants → Elle en a mangé trois = She ate three of them."
  },

  // B1 History & Geography — 10 needed
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What was the significance of the Edict of Nantes (1598)?',
    option_a: 'It declared war on England', option_b: 'It granted religious freedom to French Protestants', option_c: 'It established the French Republic', option_d: 'It abolished feudalism in France',
    answer: 1,
    explanation: "The Edict of Nantes, signed by Henry IV, granted the Protestant Huguenots substantial rights in Catholic France, ending decades of religious civil war."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'Which French region is known for its Celtic heritage and distinct language?',
    option_a: 'Alsace', option_b: 'Provence', option_c: 'Bretagne', option_d: 'Occitanie',
    answer: 2,
    explanation: "Bretagne (Brittany) has a strong Celtic heritage and its own language, Breton, which is related to Welsh and Cornish rather than French."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What was the Dreyfus Affair?',
    option_a: 'A 19th century diplomatic crisis with Germany', option_b: 'A political scandal involving a Jewish army officer falsely accused of treason', option_c: 'A financial scandal that caused the French Revolution', option_d: 'A dispute over French colonial territories in Africa',
    answer: 1,
    explanation: "The Dreyfus Affair (1894-1906) divided France when Jewish army officer Alfred Dreyfus was wrongly convicted of treason. It exposed deep anti-semitism in French society and led to major political reforms."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What is the Massif Central?',
    option_a: 'A mountain range on the border with Spain', option_b: 'A large elevated plateau in the centre of France', option_c: 'The main financial district of Paris', option_d: 'A famous French national park',
    answer: 1,
    explanation: "The Massif Central is a large highland region covering about 15% of France. It consists of ancient volcanic mountains and plateaus in the centre of the country."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'Which French city was the capital of the Roman province of Gaul?',
    option_a: 'Paris', option_b: 'Marseille', option_c: 'Lyon', option_d: 'Bordeaux',
    answer: 2,
    explanation: "Lyon, known as Lugdunum in Roman times, was the capital of Roman Gaul. It remains one of France's most historically rich cities."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What event marked the end of the French Third Republic?',
    option_a: 'The Franco-Prussian War of 1870', option_b: 'The fall of France to Germany in 1940', option_c: 'The student protests of May 1968', option_d: 'The death of Napoleon III',
    answer: 1,
    explanation: "The Third Republic ended in July 1940 when the French parliament voted to grant full powers to Marshal Pétain following the German occupation, establishing the Vichy regime."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'Which overseas French territory is located off the coast of Madagascar?',
    option_a: 'Martinique', option_b: 'Guadeloupe', option_c: 'Réunion', option_d: 'Mayotte',
    answer: 3,
    explanation: "Mayotte is a French overseas department located in the Indian Ocean between Madagascar and the African coast. It voted to remain part of France in 2011."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What is the significance of the Battle of Verdun (1916)?',
    option_a: 'It was the final battle of the Napoleonic Wars', option_b: 'It was one of the longest and most devastating battles of World War I', option_c: 'It marked France\'s entry into World War II', option_d: 'It was a French victory over the Spanish Armada',
    answer: 1,
    explanation: "The Battle of Verdun lasted 10 months in 1916 and resulted in over 700,000 casualties. It became a symbol of French determination and suffering in World War I."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'What is the Académie Française?',
    option_a: 'France\'s most prestigious art school', option_b: 'The official body responsible for matters relating to the French language', option_c: 'The French equivalent of the House of Lords', option_d: 'A famous Parisian theatre',
    answer: 1,
    explanation: "The Académie Française, founded in 1635, is the official authority on the French language. It publishes the official French dictionary and rules on matters of grammar and vocabulary."
  },
  {
    level: 'B1', topic: 'French History & Geography',
    question: 'Which French river is the longest?',
    option_a: 'Seine', option_b: 'Rhône', option_c: 'Garonne', option_d: 'Loire',
    answer: 3,
    explanation: "The Loire is the longest river in France at 1,006 km. It flows from the Massif Central westward to the Atlantic Ocean and is famous for its châteaux."
  },

  // B1 Food & Cooking — 10 needed
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is "terroir" in the context of French food and wine?',
    option_a: 'A type of clay cooking pot', option_b: 'The unique environmental factors that give a food or wine its distinctive character', option_c: 'A traditional French market', option_d: 'A certification for organic French produce',
    answer: 1,
    explanation: "Terroir refers to the complete natural environment — soil, climate, topography — in which food or wine is produced. It is the concept that a product\'s character is inseparable from where it comes from."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is "en papillote" as a cooking technique?',
    option_a: 'Cooking in a paper or foil parcel', option_b: 'Deep frying in a light batter', option_c: 'Slow roasting over an open fire', option_d: 'Marinating in wine before cooking',
    answer: 0,
    explanation: "En papillote means cooking food sealed inside a folded parcel of parchment paper or foil. The food steams in its own juices, preserving flavour and moisture."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'Which region is associated with the dish "tartiflette"?',
    option_a: 'Provence', option_b: 'Bretagne', option_c: 'Savoie', option_d: 'Alsace',
    answer: 2,
    explanation: "Tartiflette is a rich dish from the Savoie region in the French Alps, made with potatoes, reblochon cheese, lardons and onions."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is "deglaze" (déglacer) in French cooking?',
    option_a: 'To remove the skin from a fish', option_b: 'To add liquid to a hot pan to lift caramelised bits from the bottom', option_c: 'To coat food in sugar before serving', option_d: 'To chill a sauce rapidly over ice',
    answer: 1,
    explanation: "Deglazing involves adding liquid (wine, stock or water) to a hot pan after cooking meat, lifting the caramelised bits (fond) from the bottom to create a flavourful sauce base."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What are "les cinq sauces mères" (the five mother sauces) in French cuisine?',
    option_a: 'Béchamel, Velouté, Espagnole, Sauce Tomate, Hollandaise', option_b: 'Beurre blanc, Vinaigrette, Hollandaise, Béarnaise, Mayonnaise', option_c: 'Béchamel, Béarnaise, Bordelaise, Lyonnaise, Normande', option_d: 'Velouté, Bordelaise, Mornay, Soubise, Suprême',
    answer: 0,
    explanation: "The five French mother sauces, codified by Auguste Escoffier, are Béchamel, Velouté, Espagnole, Sauce Tomate and Hollandaise. All other classical sauces derive from these."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is "foie gras" and which regions are most associated with it?',
    option_a: 'Cured duck breast from Provence and Bretagne', option_b: 'The fattened liver of duck or goose, from Périgord and Gascogne', option_c: 'A type of pork terrine from Normandie and Alsace', option_d: 'Smoked salmon from Bretagne and Pays de la Loire',
    answer: 1,
    explanation: "Foie gras is the fattened liver of duck (canard) or goose (oie), produced by a special feeding process. The Périgord and Gascogne regions in southwest France are the main producers."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What distinguishes Dijon mustard from other mustards?',
    option_a: 'It is made with red wine instead of vinegar', option_b: 'It uses brown or black mustard seeds and white wine or verjuice', option_c: 'It contains turmeric giving it a bright yellow colour', option_d: 'It is coarsely ground with whole mustard seeds',
    answer: 1,
    explanation: "Dijon mustard from Bourgogne is made with brown or black mustard seeds and white wine or verjuice (unfermented grape juice), giving it a sharp, clean flavour distinct from milder yellow mustards."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is "blanquette de veau"?',
    option_a: 'A roasted veal dish from Normandie', option_b: 'A white veal stew in a cream and egg yolk sauce', option_c: 'Thinly sliced veal escalope fried in butter', option_d: 'A veal terrine from the Lyonnaise tradition',
    answer: 1,
    explanation: "Blanquette de veau is a classic French white stew of veal, mushrooms and pearl onions in a rich cream sauce enriched with egg yolk. It is one of the most loved dishes of traditional French home cooking."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'What is the role of "liaison" in French sauce making?',
    option_a: 'To season a sauce at the end of cooking', option_b: 'To thicken or bind a sauce using egg yolks, cream or starch', option_c: 'To clarify a stock by removing impurities', option_d: 'To reduce a sauce by boiling off excess liquid',
    answer: 1,
    explanation: "A liaison is a thickening agent used to finish and bind a sauce. The classic liaison is a mixture of egg yolks and cream stirred in at the end of cooking — it must not boil or it will curdle."
  },
  {
    level: 'B1', topic: 'French Regional Food & Cooking',
    question: 'Which wine region produces Châteauneuf-du-Pape?',
    option_a: 'Bordeaux', option_b: 'Bourgogne', option_c: 'Vallée du Rhône', option_d: 'Alsace',
    answer: 2,
    explanation: "Châteauneuf-du-Pape is a prestigious appellation in the southern Vallée du Rhône. Its wines, mainly red blends dominated by Grenache, are among the most celebrated in France."
  },

  // B2 Grammar — 10 needed
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Which sentence correctly uses the subjonctif passé?',
    option_a: 'Je suis content qu\'il vienne.', option_b: 'Je suis content qu\'il soit venu.', option_c: 'Je suis content qu\'il venait.', option_d: 'Je suis content qu\'il viendra.',
    answer: 1,
    explanation: "The subjonctif passé is formed with the subjunctive of avoir or être + past participle. It expresses a completed action in a subjunctive context. Soit venu = has come (subjunctive)."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'What does the plus-que-parfait express?',
    option_a: 'A future action relative to another future action', option_b: 'A past action that occurred before another past action', option_c: 'A hypothetical present condition', option_d: 'A repeated action in the present',
    answer: 1,
    explanation: "The plus-que-parfait (pluperfect) expresses a past action that happened before another past action. Quand je suis arrivé, il était déjà parti = When I arrived, he had already left."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Which sentence uses the conditionnel passé correctly?',
    option_a: 'Si j\'avais su, je serais venu.', option_b: 'Si j\'aurais su, je serais venu.', option_c: 'Si j\'avais su, je viendrai.', option_d: 'Si j\'ai su, je serais venu.',
    answer: 0,
    explanation: "Type 3 conditions use plus-que-parfait in the si clause and conditionnel passé in the result clause. 'Si j'avais su, je serais venu' = If I had known, I would have come."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'What is the function of "lequel" in this sentence: "C\'est le problème auquel je pensais."?',
    option_a: 'It is an interrogative pronoun', option_b: 'It is a relative pronoun replacing a noun preceded by à', option_c: 'It is a demonstrative pronoun', option_d: 'It is an indefinite pronoun',
    answer: 1,
    explanation: "'Lequel' and its contracted forms (auquel, duquel) are relative pronouns used after prepositions. Auquel = à + lequel. Penser à quelque chose → le problème auquel je pensais."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Choose the sentence that correctly uses the gérondif:',
    option_a: 'En mangeant, il a lu le journal.', option_b: 'Il a mangé en avoir lu le journal.', option_c: 'Mangeant, il lisait le journal.', option_d: 'En avoir mangé, il lit le journal.',
    answer: 0,
    explanation: "The gérondif is formed with en + present participle. It expresses simultaneous actions or manner. En mangeant = while eating. Both actions must have the same subject."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'What is the difference between "depuis" and "il y a" with the present tense?',
    option_a: 'They are interchangeable in all contexts', option_b: '"Depuis" indicates an ongoing action; "il y a" indicates a completed action in the past', option_c: '"Depuis" is formal; "il y a" is informal', option_d: '"Depuis" is used with the passé composé; "il y a" with the present',
    answer: 1,
    explanation: "'Depuis' + present tense describes an action that started in the past and continues now. 'Il y a' + past tense indicates when a completed action occurred. Je vis ici depuis 5 ans = I have lived here for 5 years (still living). Il est arrivé il y a 5 ans = He arrived 5 years ago."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Which correctly expresses a concession?',
    option_a: 'Bien qu\'il soit fatigué, il continue à travailler.', option_b: 'Bien qu\'il est fatigué, il continue à travailler.', option_c: 'Bien qu\'il était fatigué, il continue à travailler.', option_d: 'Bien qu\'il serait fatigué, il continue à travailler.',
    answer: 0,
    explanation: "'Bien que' (although) always requires the subjunctive. Bien qu'il soit fatigué = although he is tired. Using indicative after bien que is a common error."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'What is the correct nominalization of "décider de partir"?',
    option_a: 'La décision de partement', option_b: 'La décision de partir', option_c: 'Le décidement de partir', option_d: 'La décidure de partir',
    answer: 1,
    explanation: "Nominalization converts a verb phrase to a noun phrase. Décider → la décision. The infinitive is kept after de. La décision de partir = the decision to leave."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Which sentence correctly uses the passive infinitive?',
    option_a: 'Il espère être promu.', option_b: 'Il espère avoir promu.', option_c: 'Il espère être promis.', option_d: 'Il espère avoir été promu.',
    answer: 0,
    explanation: "The passive infinitive is être + past participle. Il espère être promu = He hopes to be promoted. The past participle agrees with the subject — promu (masculine)."
  },
  {
    level: 'B2', topic: 'French Grammar',
    question: 'Which of the following is an example of indirect speech (discours indirect)?',
    option_a: 'Il a dit: "Je suis fatigué."', option_b: 'Il a dit qu\'il était fatigué.', option_c: 'Il a dit qu\'il est fatigué.', option_d: 'Il a dit: il était fatigué.',
    answer: 1,
    explanation: "In indirect speech, the reporting verb is in the past so the present tense shifts to imparfait. 'Je suis fatigué' → il a dit qu'il était fatigué. The pronoun also shifts from je to il."
  },

  // B2 History & Geography — 10 needed
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What was the significance of the Treaty of Westphalia (1648) for France?',
    option_a: 'It ended the Hundred Years\' War with England', option_b: 'It confirmed French territorial gains including parts of Alsace and established France as a major European power', option_c: 'It granted independence to French colonies in the Americas', option_d: 'It established the French Republic after the Revolution',
    answer: 1,
    explanation: "The Treaty of Westphalia ended the Thirty Years\' War. France gained parts of Alsace and emerged as the dominant power in Europe, beginning a period of French hegemony under Louis XIV."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What was the "Fronde" (1648-1653)?',
    option_a: 'A peasant revolt against feudal taxes in southern France', option_b: 'A series of civil wars against the royal government during Louis XIV\'s minority', option_c: 'A Protestant uprising following the revocation of the Edict of Nantes', option_d: 'A military coup against Napoleon Bonaparte',
    answer: 1,
    explanation: "The Fronde was a series of civil conflicts where the nobility and Paris parlement rebelled against Cardinal Mazarin\'s government during the young Louis XIV\'s reign. Its failure strengthened royal absolutism."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'How did the French colonial empire in Indochina end?',
    option_a: 'France peacefully granted independence following World War II', option_b: 'French forces were defeated at Dien Bien Phu in 1954 leading to the Geneva Accords', option_c: 'The United States bought French Indochina in 1950', option_d: 'Japan permanently occupied Indochina after World War II',
    answer: 1,
    explanation: "The Battle of Dien Bien Phu (1954) ended in a decisive Vietnamese victory over French forces. The subsequent Geneva Accords divided Vietnam and ended French colonial rule in Indochina."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What were the main causes of the May 1968 protests in France?',
    option_a: 'Opposition to French involvement in the Vietnam War and economic recession', option_b: 'Student discontent with the university system combined with widespread worker strikes against Gaullist conservatism', option_c: 'A military coup attempt against de Gaulle by right-wing generals', option_d: 'Mass protests against French nuclear testing in the Pacific',
    answer: 1,
    explanation: "May 1968 began with student protests at Nanterre University over outdated university structures, rapidly spreading to a general strike involving 10 million workers. It challenged Gaullist authority and transformed French society and culture."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What is the "exception culturelle française"?',
    option_a: 'France\'s refusal to join NATO\'s military command', option_b: 'The French policy of protecting its cultural industries from free market globalisation', option_c: 'The legal exemption of French art from import taxes', option_d: 'France\'s unique secular constitution separating church and state',
    answer: 1,
    explanation: "The cultural exception is France\'s longstanding policy that cultural products — films, music, literature — should not be subject to the same free trade rules as other goods. It justifies subsidies and quotas to protect French cultural production."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What is the "laïcité" principle in France?',
    option_a: 'The constitutional right to practice any religion freely', option_b: 'The strict separation of religion from public and state affairs', option_c: 'The French government\'s financial support for recognised religions', option_d: 'A law protecting minority religious communities from discrimination',
    answer: 1,
    explanation: "Laïcité, enshrined in the 1905 law and the constitution, mandates a strict separation of religious institutions from the state. It prohibits religious expression in public institutions and is a cornerstone of French republican identity."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What role did France play in the American Revolution?',
    option_a: 'France remained neutral but supplied weapons covertly', option_b: 'France formally allied with the American colonies, providing military and financial support that proved decisive', option_c: 'France supported Britain in suppressing the American rebellion', option_d: 'France only became involved after the British surrender at Yorktown',
    answer: 1,
    explanation: "France formally allied with the American colonies in 1778, motivated by rivalry with Britain. French naval support, financial aid and troops — including Lafayette — were crucial to the American victory at Yorktown in 1781."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What is the "Hexagone" and why is France called this?',
    option_a: 'A term for metropolitan France based on its roughly six-sided geographical shape', option_b: 'The name for France\'s six overseas departments', option_c: 'The six founding regions of the French Republic after the Revolution', option_d: 'A reference to France\'s six bordering countries',
    answer: 0,
    explanation: "L\'Hexagone refers to metropolitan France, whose borders form a rough hexagon shape. It has six sides bordering the Atlantic, English Channel, North Sea, Belgium/Luxembourg, Germany/Switzerland, Italy and the Mediterranean/Spain."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What was the significance of the Schengen Agreement for France?',
    option_a: 'It established France as a founding member of NATO', option_b: 'It abolished border controls between France and most other European countries', option_c: 'It created the European single currency which France adopted', option_d: 'It granted French citizenship rights to residents of former colonies',
    answer: 1,
    explanation: "The Schengen Agreement (signed 1985, implemented 1995) abolished passport controls between participating European countries. France was a founding signatory, allowing free movement of people across most of the EU."
  },
  {
    level: 'B2', topic: 'French History & Geography',
    question: 'What is the "banlieue" problem in contemporary France?',
    option_a: 'The decline of rural farming communities due to urbanisation', option_b: 'Social and economic marginalisation of largely immigrant-origin populations in suburban housing estates', option_c: 'Environmental degradation of France\'s coastal regions due to tourism', option_d: 'Political corruption in France\'s regional governments',
    answer: 1,
    explanation: "The banlieues are suburban housing estates around French cities with high concentrations of immigrant-origin populations facing unemployment, poor housing and discrimination. Periodic riots — notably in 2005 — have highlighted the failure to integrate these communities into French republican society."
  },

  // B2 Food & Cooking — 10 needed
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is the "brigade de cuisine" system developed by Auguste Escoffier?',
    option_a: 'A French law regulating food hygiene in professional kitchens', option_b: 'A hierarchical system organising kitchen staff into specialised roles', option_c: 'A training programme for apprentice chefs in France', option_d: 'A classification system for French restaurants by quality',
    answer: 1,
    explanation: "Escoffier\'s brigade system organises a professional kitchen into a clear hierarchy — chef de cuisine, sous chef, chefs de partie (sauce, fish, grill, pastry etc.) — each responsible for a specific area. It remains the foundation of professional kitchen organisation worldwide."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What distinguishes "haute cuisine" from "cuisine bourgeoise"?',
    option_a: 'Haute cuisine uses only regional ingredients; cuisine bourgeoise uses imported ones', option_b: 'Haute cuisine is elaborate restaurant cooking developed by professional chefs; cuisine bourgeoise is refined but simpler home cooking', option_c: 'Haute cuisine is vegetarian; cuisine bourgeoise includes meat', option_d: 'Haute cuisine originates from Paris; cuisine bourgeoise from the provinces',
    answer: 1,
    explanation: "Haute cuisine refers to the elaborate, technically refined cooking of great restaurants and professional chefs. Cuisine bourgeoise is the solid, careful cooking of the French middle-class home — rich, satisfying dishes like pot-au-feu and blanquette de veau."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is "nouvelle cuisine" and which chefs pioneered it?',
    option_a: 'A 1970s movement emphasising lighter dishes, shorter cooking times and artistic presentation, led by Guérard, Bocuse and the Troisgros brothers', option_b: 'A 1990s movement bringing street food into fine dining restaurants', option_c: 'A return to traditional medieval French recipes championed by Escoffier', option_d: 'A fusion movement combining French and Japanese techniques developed in the 1980s',
    answer: 0,
    explanation: "Nouvelle cuisine emerged in the 1970s as a reaction against the heaviness of classical French cooking. It emphasised fresh ingredients, lighter sauces, precise cooking and beautiful presentation. Paul Bocuse, Michel Guérard and the Troisgros brothers were its leading figures."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is "AOC" (Appellation d\'Origine Contrôlée) and why is it important?',
    option_a: 'A French food safety certification ensuring products meet hygiene standards', option_b: 'A legal designation protecting the geographical origin and production methods of specific French products', option_c: 'An organic certification awarded to French farms meeting environmental standards', option_d: 'A Michelin star equivalent for French food producers',
    answer: 1,
    explanation: "AOC guarantees that a product — wine, cheese, butter, olive oil — comes from a specific region and is made according to traditional methods. It protects both the producer and the consumer from imitation. Champagne, Roquefort and Beurre d\'Isigny all have AOC status."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is "gastronomy tourism" and why is France its world capital?',
    option_a: 'Travel specifically to eat at Michelin starred restaurants, for which Paris has the most in the world', option_b: 'Travel motivated by experiencing a region\'s food culture — markets, producers, restaurants and traditions — for which France\'s regional diversity makes it uniquely rich', option_c: 'Culinary school tourism where students travel to France to train as chefs', option_d: 'Wine tourism centred on France\'s famous vineyard regions',
    answer: 1,
    explanation: "France\'s extraordinary regional diversity — each area with its own cheeses, wines, charcuterie, breads and dishes — combined with its deeply ingrained food culture (UNESCO listed French gastronomic meal in 2010) makes it the world\'s leading destination for food-motivated travel."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What makes Roquefort cheese unique and how is it produced?',
    option_a: 'It is a hard sheep\'s milk cheese aged in mountain caves in the Pyrénées', option_b: 'It is a blue sheep\'s milk cheese aged in the natural caves of Combalou near Roquefort-sur-Soulzon', option_c: 'It is a soft goat\'s milk cheese from the Loire Valley with a distinctive blue rind', option_d: 'It is a washed rind cow\'s milk cheese from Normandie with a pungent orange exterior',
    answer: 1,
    explanation: "Roquefort is made exclusively from the milk of Lacaune ewes and aged in the natural Combalou caves in Aveyron. The caves\' unique microclimate produces the Penicillium roqueforti mould that creates its distinctive blue veining and sharp flavour."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is the culinary significance of Lyon in France?',
    option_a: 'It is considered the gastronomic capital of France, home to the "bouchon" tradition and birthplace of Paul Bocuse', option_b: 'It is the centre of French pastry making and home to the most Michelin starred restaurants in France', option_c: 'It is the wine capital of France and home to the world\'s largest wine auction', option_d: 'It is where French haute cuisine originated in the court kitchens of the Renaissance',
    answer: 0,
    explanation: "Lyon is widely considered the gastronomic capital of France. Its bouchon restaurants serve traditional Lyonnaise cuisine — quenelles, andouillette, salade lyonnaise. Paul Bocuse, perhaps the most celebrated French chef of the 20th century, was born and worked near Lyon."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is "fermentation lacto" and how is it used in traditional French food preservation?',
    option_a: 'A chemical preservation method using lactic acid additives approved for French charcuterie', option_b: 'A natural preservation process where beneficial bacteria convert sugars to lactic acid, used in products like choucroute and certain cheeses', option_c: 'A pasteurisation technique developed in France for preserving dairy products', option_d: 'A salt-curing method used exclusively for French fish products like brandade',
    answer: 1,
    explanation: "Lacto-fermentation uses naturally occurring bacteria to preserve food. In French cuisine it is most evident in choucroute (fermented cabbage from Alsace) and in the development of flavour in aged cheeses. It predates refrigeration and remains central to French food heritage."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'How does the Bordeaux wine classification system of 1855 work?',
    option_a: 'It ranks all French wines from one to five stars based on annual blind tastings', option_b: 'It classified the top Médoc châteaux into five growths (premiers to cinquièmes crus) based on price and reputation at the time', option_c: 'It divides Bordeaux wines into left bank and right bank appellations based on grape variety', option_d: 'It certifies organic Bordeaux producers according to sustainable viticulture standards',
    answer: 1,
    explanation: "Napoleon III commissioned the 1855 classification for the Paris World Exhibition. It ranked 61 Médoc châteaux into five tiers (crus classés) plus Sauternes sweet wines. With one famous exception (Mouton Rothschild elevated in 1973), it remains unchanged — a remarkable testament to its enduring authority."
  },
  {
    level: 'B2', topic: 'French Regional Food & Cooking',
    question: 'What is "cuisine du terroir" and how does it differ from haute cuisine?',
    option_a: 'Cuisine du terroir is fusion cooking combining French techniques with foreign ingredients, while haute cuisine uses only local French produce', option_b: 'Cuisine du terroir is deeply rooted in regional ingredients, traditions and seasonal rhythms; haute cuisine is technically elaborate restaurant cooking that transcends regional boundaries', option_c: 'Cuisine du terroir is the cooking of French overseas territories; haute cuisine is exclusively Parisian', option_d: 'They are synonymous terms for traditional French regional cooking',
    answer: 1,
    explanation: "Cuisine du terroir celebrates the specific character of a region\'s ingredients and traditional recipes — the cassoulet of Languedoc, the bouillabaisse of Marseille, the choucroute of Alsace. Haute cuisine, while often inspired by regional produce, is a creative professional endeavour that operates above regional constraints."
  },
];

const insertMany = db.transaction((qs) => {
  for (const q of qs) insert.run(q);
});

insertMany(newQuestions);
console.log(`${newQuestions.length} new questions added successfully!`);
db.close();
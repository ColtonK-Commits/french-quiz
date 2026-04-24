// Migration run: April 2026 — Added expressions table for flashcards and quiz
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'french_quiz.db'));

const insert = db.prepare(`
  INSERT INTO expressions (french, english)
  VALUES (@french, @english)
`);

const expressions = [
  { french: "Tu te fous de moi ?", english: "Are you kidding me?" },
  { french: "Pardon vous pourriez me dire quel est le prix de cet objet, SVP ?", english: "Pardon, could you tell me how much does this object cost, pls?" },
  { french: "Je suis désole, je ne vais pas pouvoir aller à ta fête", english: "I'm sorry, I cannot come to your party" },
  { french: "Pardon, Je suis vraiment désolé.", english: "Pardon, I am really sorry" },
  { french: "T'as un morceau de salade dans tes dents", english: "You have a bit of lettuce in your teeth." },
  { french: "Je pourrais avoir un café, svp ?", english: "Could I have a coffee, please?" },
  { french: "J'ai une tête à boire du jus d'orange ou quoi ?", english: "Do I look like someone that would drink OJ?" },
  { french: "Vous auriez une table en terrasse svp ?", english: "Would you have an outdoor table pls?" },
  { french: "Tu ne me faites pas genre c'est un grand service personnel", english: "Don't be like you're doing me a service." },
  { french: "Vous savez si ce qu'on a commandé va arriver ?", english: "Do you know if our order is coming?" },
  { french: "Je voudrais commander un sandwich svp.", english: "I would like to order a sandwich pls." },
  { french: "Ce serait possible de changer de table, svp?", english: "Would it be possible to change tables, pls?" },
  { french: "Vous pourriez prendre une photo de nous svp ?", english: "Could you take our photo pls?" },
  { french: "Eh oh, le Picasso vivant, oui vous là.", english: "Eh oh, the living Picasso, you there!" },
  { french: "Prenez-nous en photo enfin", english: "Take our photo already." },
  { french: "Non, ne me remerciez pas !", english: "No, please don't thank me." },
  { french: "C'est l'heure de se réveiller !", english: "It's time to wake up." },
  { french: "Debout!", english: "Wake up!" },
  { french: "Je vais prendre une bière svp.", english: "I'll have a beer pls." },
  { french: "Et combine ça va me couter pour voir ces choses ?", english: "How much is it going to cost me to see these things?" },
  { french: "Vous savez ou se trouve le métro ?", english: "Do you know where the subway is?" },
  { french: "Où se trouve le transport ?", english: "Where is the transport?" },
  { french: "Où sommes-nous ?", english: "Where are we?" },
  { french: "Mais c'est quoi cet endroit, sérieux ?", english: "Seriously, what is this place?" },
  { french: "C'est pas ce que j'ai commande", english: "This is not what I ordered" },
  { french: "Non mais, c'est quoi ça ?", english: "But, what is that?" },
  { french: "Peu importe.", english: "It doesn't matter" },
  { french: "Poussez-vous ! Attention !", english: "Move! Watch out!" },
  { french: "Bien fait pour toi.", english: "Sucks to suck" },
  { french: "Ah quel dommage.", english: "What a shame." },
  { french: "Ça sera la prochaine à gauche, merci", english: "It will be the next left, thx." },
  { french: "Mais vous allez où ?", english: "Where are you going?" },
  { french: "Vous prenez tout droit et c'est sur la gauche après.", english: "You go straight on, and then it's on your left." },
  { french: "Pardon, cette chaise est libre ?", english: "Pardon, is this chair free?" },
  { french: "Vous n'attendez personne, je pense ?", english: "You're not waiting for anyone, right?" },
  { french: "Vous pourriez me dire ou se trouve la première classe, svp ?", english: "Could you tell me where is first class pls?" },
  { french: "Ou se trouvent les toilettes, svp ?", english: "Where are the WCs pls?" },
  { french: "Non mais il faut Google Maps pour trouver les toilettes ici ou quoi ?", english: "Do you need to use Google Maps to find the restrooms here or what?" },
  { french: "Boucler votre ceinture, svp", english: "Buckle your seatbelt, pls" },
  { french: "La ceinture ne va pas se fermer toute seule !", english: "The seatbelt isn't going to buckle itself!" },
  { french: "Le prochain métro est dans combien de temps ?", english: "How long until the next train, pls?" },
  { french: "Ah je ne savais pas !", english: "Oh I didn't know that!" },
  { french: "Ah bon…", english: "Oh really…" },
  { french: "Vous pourriez répéter svp?", english: "Can you please repeat?" },
  { french: "Bonjour, vous auriez une table pour deux ?", english: "Hi, would you have a table for two?" },
  { french: "Certainement pas", english: "Absolutely not" },
  { french: "Hors de question", english: "Hell no" },
  { french: "Tu peux ralentir stp.", english: "Can you slow down pls?" },
  { french: "Ralentis !", english: "Slow down!" },
  { french: "Pardon, combien de temps vous pensez que ça va prendre ?", english: "Sorry, how long do you think it will take?" },
  { french: "Ouais, t'es pas mal", english: "Yeah, you're not bad" },
  { french: "On dirait qu'il s'agit d'un problème qui te concerne", english: "It sounds like a you-problem." },
  { french: "Non mais c'est ton problème pas le mien", english: "It's your problem, not mine" },
  { french: "Il fait limite froide, non", english: "It's kind of cold, right?" },
  { french: "Il fait beau aujourd'hui", english: "It is beautiful today." },
  { french: "Finalement, un peu de soleil, mais qu'est-ce qu'il fait chaud.", english: "Finally, a little sun, but it's so hot though." },
  { french: "On se voit demain", english: "See you tomorrow" },
  { french: "A demain, j'ai hâte", english: "Til tomorrow, I can't wait" },
  { french: "Mais je m'en fous d'une force", english: "I literally couldn't care less" },
  { french: "Oui, je préfère être seul que mal accompagne", english: "I'd rather be alone then in bad company" },
  { french: "Et oui, bien vu Madame Irma", english: "Well spotted, you fortune teller" },
  { french: "Merci pour ton aide", english: "Thanks for your help" },
  { french: "Bon chance, tu vas vraiment en avoir besoin", english: "Good luck, you're really going to need it." },
  { french: "Ah salut", english: "Oh, hi" },
  { french: "Vous n'avez peut-être pas remarqué mais vous n'êtes pas seuls au monde", english: "You haven't noticed you're not alone in the world?" },
  { french: "J'ai hâte d'être en week-end", english: "I'm looking forward to the weekend" },
  { french: "Tu viens te baigner ?", english: "Are you coming for a swim?" },
  { french: "Bon tu bouges es fesses ?", english: "So are you going to move your butt?" },
  { french: "J'ai un faible pour toi.", english: "I have a crush on you" },
  { french: "Ouais, tu me plais assez", english: "Yeah, I kind of like you." },
  { french: "T'es trop drôle.", english: "You're so funny." },
  { french: "Ah mais quel humour", english: "What a sense of humor." },
  { french: "Quel est le programme ?", english: "What's the plan?" },
  { french: "T'es un couple", english: "Are you in a relationship?" },
  { french: "Non mais allez-y tranquillement surtout, il n'y a pas d'urgence.", english: "No, please take your time, there is no rush" },
  { french: "Passe une bonne journée, ou fait semblant, comme tout le monde", english: "Have a good day, or pretend to, like everyone else." },
  { french: "Tout va bien ?", english: "Is everything ok?" },
  { french: "J'aime bien ton style.", english: "I like your style." },
  { french: "Je t'en prie", english: "You're welcome." },
  { french: "Ça te plait ?", english: "Do you like it?" },
  { french: "Je ne suis pas d'accord", english: "I disagree" },
  { french: "Pas pour moi, merci", english: "Not for me, thanks" },
  { french: "C'est gentil, mais non", english: "That's kind, but no" },
  { french: "Pas cette fois, merci", english: "Not this time, thank you" },
  { french: "Je suis crevé/naze/à plat/épuise", english: "I'm exhausted/wiped/drained/worn out" },
  { french: "Je ne pige/capte/saisis pas", english: "I don't get/understand/grasp it." },
  { french: "C'est délicieux, super bon, un régal", english: "It is delicious, very good, a treat." },
  { french: "Ça déchire", english: "It's amazing" },
  { french: "Désole, je suis occupe", english: "Sorry, I am busy" },
  { french: "Tu me manques", english: "I miss you." },
  { french: "A plus tard", english: "See you later" },
  { french: "Tu es en avance", english: "You're early" },
  { french: "C'est chaint", english: "It's boring, it sucks" },
  { french: "Quel bel endroit", english: "What a beautiful place" },
  { french: "Ouais c'est joli", english: "Yeah, it's pretty" },
  { french: "J'ai pas envie de faire la queue", english: "I don't want to wait in line" },
  { french: "Ah non mais moi j'vais pas attendre trois heures la", english: "I'm not going to wait for three hours." },
  { french: "C'est génial, excellent, top, énorme, trop bien, mortel", english: "That's awesome, excellent, top-notch, really good, killer" },
  { french: "Envoyer quelqu'un sur les roses", english: "Telling someone to get lost" },
];

const insertMany = db.transaction((qs) => {
  for (const q of qs) insert.run(q);
});

insertMany(expressions);
console.log(`${expressions.length} expressions added successfully!`);
db.close();
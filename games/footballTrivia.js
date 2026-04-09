const activeGames = {};

const questions = [
  { q: "⚽ FIFA World Cup 2022 kisne jeeta?", a: "argentina", opts: ["France", "Argentina", "Brazil", "Germany"] },
  { q: "⚽ Sabse zyada Ballon d'Or kisne jeeta hai?", a: "messi", opts: ["Ronaldo", "Messi", "Neymar", "Mbappe"] },
  { q: "⚽ Champions League mein sabse zyada goals kisne maare hain?", a: "ronaldo", opts: ["Messi", "Ronaldo", "Benzema", "Lewandowski"] },
  { q: "⚽ IPL nahi, Football mein 'El Clasico' kaunse 2 teams ke beech hota hai?", a: "real madrid vs barcelona", opts: ["Real Madrid vs Barcelona", "PSG vs Monaco", "Liverpool vs ManCity", "Bayern vs Dortmund"] },
  { q: "⚽ FIFA World Cup kitne saalon mein ek baar hota hai?", a: "4", opts: ["2", "3", "4", "5"] },
  { q: "⚽ Kaunsa desh sabse zyada baar World Cup jeeta hai?", a: "brazil", opts: ["Germany", "Brazil", "Italy", "Argentina"] },
  { q: "⚽ Ronaldo ka pura naam kya hai?", a: "cristiano ronaldo", opts: ["Cristiano Ronaldo", "Ronaldo Nazario", "Ronaldinho", "Ronaldo Lima"] },
  { q: "⚽ Premier League mein sabse zyada title kisne jeeta?", a: "manchester united", opts: ["Manchester United", "Liverpool", "Chelsea", "Arsenal"] },
];

function start(bot, chatId, userId) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  activeGames[chatId] = { question: q, userId };

  bot.sendMessage(chatId, `⚽ *Football Trivia!*\n\n${q.q}`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [q.opts.map(opt => ({
        text: opt,
        callback_data: `football_${opt.toLowerCase().replace(/ /g, '_')}`
      }))]
    }
  });
}

function checkAnswer(bot, chatId, answer) {
  const game = activeGames[chatId];
  if (!game) return;

  const isCorrect = answer === game.question.a;

  bot.sendMessage(chatId,
    isCorrect
      ? `✅ *Sahi jawab!* 🎉 +10 points!`
      : `❌ *Galat!* Sahi jawab tha: *${game.question.a}*`,
    { parse_mode: 'Markdown' }
  );

  delete activeGames[chatId];
}

module.exports = { start, checkAnswer };

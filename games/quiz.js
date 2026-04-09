const activeQuiz = {};

const questions = [
  { q: "🌍 France ki capital kya hai?", a: "paris", opts: ["London", "Paris", "Berlin", "Rome"] },
  { q: "🔢 12 × 12 kitna hota hai?", a: "144", opts: ["124", "144", "148", "136"] },
  { q: "🎵 Thriller kisne gaya tha?", a: "michael jackson", opts: ["Elvis", "Michael Jackson", "Madonna", "Prince"] },
  { q: "🌊 Sabse bada ocean kaun sa hai?", a: "pacific", opts: ["Atlantic", "Indian", "Pacific", "Arctic"] },
  { q: "🦁 Sabse tez zamini janwar kaun sa hai?", a: "cheetah", opts: ["Lion", "Cheetah", "Horse", "Tiger"] },
];

function start(bot, chatId, userId) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  activeQuiz[chatId] = { question: q, userId };

  bot.sendMessage(chatId, `🎯 *Quiz Time!*\n\n${q.q}`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [q.opts.map(opt => ({
        text: opt,
        callback_data: `quiz_${opt.toLowerCase().replace(/ /g, '_')}`
      }))]
    }
  });
}

function checkAnswer(bot, chatId, answer) {
  const game = activeQuiz[chatId];
  if (!game) return;

  const isCorrect = answer === game.question.a;

  bot.sendMessage(chatId,
    isCorrect
      ? `✅ *Sahi jawab!* 🎉 +10 points mil gaye!`
      : `❌ *Galat!* Sahi jawab tha: *${game.question.a}*`,
    { parse_mode: 'Markdown' }
  );

  delete activeQuiz[chatId];
}

function startMultiplayer(bot, room, roomCode) {
  room.players.forEach(p => {
    bot.sendMessage(p.chatId,
      `🎮 *Multiplayer Quiz shuru!*\nRoom: ${roomCode}`,
      { parse_mode: 'Markdown' }
    );
  });
  const currentPlayer = room.players[room.currentTurn];
  start(bot, currentPlayer.chatId, currentPlayer.userId);
}

module.exports = { start, checkAnswer, startMultiplayer };

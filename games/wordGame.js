const activeGames = {};

const words = [
  { word: "ELEPHANT", hint: "🐘 Ek bada janwar jiske suund hoti hai" },
  { word: "JAVASCRIPT", hint: "💻 Ek programming language" },
  { word: "TELEGRAM", hint: "📱 Ek messaging app" },
  { word: "RAINBOW", hint: "🌈 Barish ke baad aata hai" },
  { word: "FOOTBALL", hint: "⚽ Ek popular khel" },
];

function start(bot, chatId, userId) {
  const item = words[Math.floor(Math.random() * words.length)];
  const scrambled = item.word.split('').sort(() => Math.random() - 0.5).join('');
  activeGames[chatId] = { word: item.word, userId };

  bot.sendMessage(chatId,
    `🧩 *Word Puzzle!*\n\nIs word ko unscramble karo:\n*${scrambled}*\n\nHint: ${item.hint}`,
    { parse_mode: 'Markdown' }
  );
}

function handleAnswer(bot, msg) {
  const chatId = msg.chat.id;
  const game = activeGames[chatId];
  if (!game) return;

  if (msg.text.toUpperCase() === game.word) {
    bot.sendMessage(chatId,
      `✅ *Bilkul sahi!* Word tha *${game.word}*! 🎉`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
  } else {
    bot.sendMessage(chatId, `❌ Galat! Dobara try karo...`);
  }
}

module.exports = { start, handleAnswer };

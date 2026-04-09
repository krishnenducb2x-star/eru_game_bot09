const activeGames = {};

const riddles = [
  { q: "🤔 Wo kya hai jo aata hai lekin kabhi pahunchta nahi?", a: "kal", hint: "Time se related hai" },
  { q: "🤔 Jitna zyada sookhe utna bada ho jaata hai, kya hai?", a: "garha", hint: "Zameen mein hota hai" },
  { q: "🤔 Wo kya hai jiske daant hain lekin kha nahi sakta?", a: "kangha", hint: "Roz use karte ho" },
  { q: "🤔 Bina paon ke chalta hai, bina muh ke bolta hai?", a: "ghadi", hint: "Time batata hai" },
  { q: "🤔 Wo kya hai jo hamesha aage badhta hai lekin kabhi peeche nahi aata?", a: "umra", hint: "Sab ki hoti hai" },
  { q: "🤔 Andar se lal, bahar se hara, seedha khao ya juice nikalo?", a: "tarbuz", hint: "🍉 Ek fruit" },
  { q: "🤔 Wo kya hai jo sirf raat ko niklta hai aur subah gayab ho jaata hai?", a: "tare", hint: "Aasman mein hote hain" },
  { q: "🤔 Jitna khao utna badhta hai, kya hai?", a: "bhook", hint: "Pet se related" },
];

function start(bot, chatId, userId) {
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];
  activeGames[chatId] = { riddle, userId, attempts: 0 };

  bot.sendMessage(chatId,
    `❓ *Riddle Time!*\n\n${riddle.q}\n\nJawab type karo! (Hint: ${riddle.hint})`,
    { parse_mode: 'Markdown' }
  );
}

function handleAnswer(bot, msg) {
  const chatId = msg.chat.id;
  const game = activeGames[chatId];
  if (!game) return;

  const answer = msg.text.toLowerCase().trim();
  game.attempts++;

  if (answer === game.riddle.a) {
    bot.sendMessage(chatId,
      `✅ *Bilkul sahi!* 🎉\nJawab tha: *${game.riddle.a}*\n\n${game.attempts === 1 ? '🌟 Pehli baar mein!' : `${game.attempts} attempts mein!`}`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
  } else if (game.attempts >= 3) {
    bot.sendMessage(chatId,
      `❌ *3 baar galat!*\nSahi jawab tha: *${game.riddle.a}*\n\nDobara try karo! /start`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
  } else {
    bot.sendMessage(chatId,
      `❌ Galat! Dobara try karo...\nBache attempts: *${3 - game.attempts}*`,
      { parse_mode: 'Markdown' }
    );
  }
}

module.exports = { start, handleAnswer };

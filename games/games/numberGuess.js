const activeGames = {};

function start(bot, chatId, userId) {
  const number = Math.floor(Math.random() * 100) + 1;
  activeGames[chatId] = { number, attempts: 0, userId };

  bot.sendMessage(chatId,
    `🔢 *Number Guessing Game!*\n\nMaine 1 se 100 ke beech ek number socha hai!\nApna guess type karo 👇`,
    { parse_mode: 'Markdown' }
  );
}

function handleGuess(bot, msg) {
  const chatId = msg.chat.id;
  const game = activeGames[chatId];
  if (!game) return;

  const guess = parseInt(msg.text);
  if (isNaN(guess)) return;

  game.attempts++;

  if (guess === game.number) {
    bot.sendMessage(chatId,
      `✅ *Bilkul sahi!* Number tha *${game.number}*!\n🎉 Tune *${game.attempts} attempts* mein guess kiya!`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
  } else if (guess < game.number) {
    bot.sendMessage(chatId, `📈 Bahut chota! Thoda bada try karo. (Attempt: ${game.attempts})`);
  } else {
    bot.sendMessage(chatId, `📉 Bahut bada! Thoda chota try karo. (Attempt: ${game.attempts})`);
  }
}

module.exports = { start, handleGuess };

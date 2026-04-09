const activeGames = {};

const snakes = { 97: 78, 95: 56, 88: 24, 62: 18, 48: 26, 36: 6, 32: 10 };
const ladders = { 1: 38, 4: 14, 9: 31, 20: 42, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

function start(bot, chatId, userId) {
  activeGames[chatId] = {
    position: 0,
    userId,
    moves: 0
  };

  bot.sendMessage(chatId,
    `🐍 *Snake & Ladder!*\n\n🎯 Goal: 100 tak pahuncho!\n🐍 Saanp neeche le jaata hai\n🪜 Seedhi upar le jaati hai\n\nTumhari position: *0*\n\nDice roll karo! 🎲`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🎲 Dice Roll Karo!', callback_data: 'snake_roll' }
        ]]
      }
    }
  );
}

function roll(bot, chatId) {
  const game = activeGames[chatId];
  if (!game) return;

  const dice = Math.floor(Math.random() * 6) + 1;
  let newPos = game.position + dice;
  game.moves++;

  let message = `🎲 Dice: *${dice}*\n`;

  if (newPos > 100) {
    message += `⚠️ ${newPos} ho gaya — 100 se zyada! Dobara try karo!\nTumhari position: *${game.position}*`;
    bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🎲 Phir Roll Karo!', callback_data: 'snake_roll' }]] }
    });
    return;
  }

  message += `Position: ${game.position} → *${newPos}*\n`;

  if (snakes[newPos]) {
    message += `\n🐍 *Saanp ne kaata!* ${newPos} → ${snakes[newPos]}\n`;
    newPos = snakes[newPos];
  } else if (ladders[newPos]) {
    message += `\n🪜 *Seedhi mili!* ${newPos} → ${ladders[newPos]}\n`;
    newPos = ladders[newPos];
  }

  game.position = newPos;
  message += `\nAb tumhari position: *${newPos}*`;

  if (newPos === 100) {
    bot.sendMessage(chatId,
      `${message}\n\n🏆 *Tum jeet gaye!*\n🎉 ${game.moves} moves mein 100 pahunch gaye!`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[{ text: '🎲 Phir Roll Karo!', callback_data: 'snake_roll' }]] }
  });
}

module.exports = { start, roll };

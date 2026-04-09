function start(bot, chatId, userId) {
  bot.sendMessage(chatId,
    `🎲 *Dice Game!*\n\nDice roll HIGH (4-6) hoga ya LOW (1-3)?\nApna guess lagao!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '⬆️ HIGH', callback_data: 'dice_high' },
          { text: '⬇️ LOW', callback_data: 'dice_low' }
        ]]
      }
    }
  );
}

function roll(bot, chatId, choice) {
  const result = Math.floor(Math.random() * 6) + 1;
  const isHigh = result >= 4;
  const userChoseHigh = choice === 'dice_high';
  const won = isHigh === userChoseHigh;

  bot.sendMessage(chatId,
    `🎲 Dice roll hua: *${result}*\n\n${won ? '🎉 Tu jeet gaya!' : '😢 Tu haar gaya!'}\nResult tha ${isHigh ? 'HIGH' : 'LOW'}`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = { start, roll };

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '🔔', '💎', '7️⃣'];

function start(bot, chatId, userId) {
  bot.sendMessage(chatId,
    `🎰 *Slot Machine!*\n\nLever khicho aur dekho kya aata hai!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🎰 Spin!', callback_data: 'slot_spin' }
        ]]
      }
    }
  );
}

function spin(bot, chatId) {
  const s1 = symbols[Math.floor(Math.random() * symbols.length)];
  const s2 = symbols[Math.floor(Math.random() * symbols.length)];
  const s3 = symbols[Math.floor(Math.random() * symbols.length)];

  let result;
  let prize;

  if (s1 === s2 && s2 === s3) {
    if (s1 === '💎') {
      result = '🏆 JACKPOT!!';
      prize = '+1000 points!';
    } else if (s1 === '7️⃣') {
      result = '🎉 TRIPLE SEVEN!!';
      prize = '+500 points!';
    } else {
      result = '🎊 TEEN MATCH!!';
      prize = '+200 points!';
    }
  } else if (s1 === s2 || s2 === s3 || s1 === s3) {
    result = '✅ Do match!';
    prize = '+50 points!';
  } else {
    result = '❌ Koi match nahi!';
    prize = 'Dobara try karo!';
  }

  bot.sendMessage(chatId,
    `🎰 *Slot Machine!*\n\n[ ${s1} | ${s2} | ${s3} ]\n\n${result}\n${prize}`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🎰 Phir Spin!', callback_data: 'slot_spin' }
        ]]
      }
    }
  );
}

module.exports = { start, spin };

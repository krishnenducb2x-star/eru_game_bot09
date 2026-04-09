const activeGames = {};

function start(bot, chatId, userId) {
  activeGames[chatId] = {
    userId,
    players: {
      red: { pos: 0, home: false, emoji: '🔴' },
      blue: { pos: 0, home: false, emoji: '🔵' },
    },
    turn: 'red',
    round: 1
  };

  bot.sendMessage(chatId,
    `🎲 *Ludo Game!*\n\n🔴 Red: Position 0\n🔵 Blue: Position 0\n\n🎯 Goal: 57 tak pahuncho!\n\n🔴 *Red ki baari!*\nDice roll karo! 🎲`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🎲 Dice Roll Karo!', callback_data: 'ludo_roll' }
        ]]
      }
    }
  );
}

function roll(bot, chatId) {
  const game = activeGames[chatId];
  if (!game) return;

  const dice = Math.floor(Math.random() * 6) + 1;
  const current = game.players[game.turn];
  const other = game.turn === 'red' ? 'blue' : 'red';
  const otherPlayer = game.players[other];

  let newPos = current.pos + dice;
  let extraMsg = '';

  if (newPos > 57) {
    newPos = current.pos;
    extraMsg = `\n⚠️ Bahut zyada! Move nahi hua!`;
  } else if (newPos === 57) {
    current.pos = 57;
    current.home = true;
    bot.sendMessage(chatId,
      `🎲 Dice: *${dice}*\n\n${current.emoji} *HOME PAHUNCH GAYA!*\n\n🏆 *${game.turn.toUpperCase()} JEET GAYA!* 🎉`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  } else {
    // Cut opponent
    if (newPos === otherPlayer.pos && otherPlayer.pos !== 0) {
      otherPlayer.pos = 0;
      extraMsg = `\n✂️ *${other.toUpperCase()} cut ho gaya! Wapas start pe!*`;
    }
    current.pos = newPos;
  }

  // Switch turn
  game.turn = other;
  const nextTurnEmoji = game.players[other].emoji;

  bot.sendMessage(chatId,
    `🎲 Dice: *${dice}*${extraMsg}\n\n🔴 Red: *${game.players.red.pos}/57*\n🔵 Blue: *${game.players.blue.pos}/57*\n\n${nextTurnEmoji} *${other.toUpperCase()} ki baari!*`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🎲 Dice Roll Karo!', callback_data: 'ludo_roll' }
        ]]
      }
    }
  );
}

module.exports = { start, roll };

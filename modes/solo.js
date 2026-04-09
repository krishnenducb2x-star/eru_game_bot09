const sessions = {};

function startSession(userId, gameType) {
  sessions[userId] = {
    gameType,
    score: 0,
    round: 0,
    maxRounds: 5,
    startTime: Date.now()
  };
}

function getSession(userId) {
  return sessions[userId];
}

function endSession(bot, chatId, userId) {
  const session = sessions[userId];
  if (!session) return;

  const timeTaken = Math.round((Date.now() - session.startTime) / 1000);

  bot.sendMessage(chatId,
    `🎮 *Game Over!*\n\n` +
    `🎯 Score: *${session.score} pts*\n` +
    `⏱️ Time: *${timeTaken}s*\n` +
    `🔄 Rounds: *${session.round}*\n\n` +
    `Dobara khelna hai?`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🔄 Dobara Khelo', callback_data: `solo_${session.gameType}` },
          { text: '🏠 Main Menu', callback_data: 'main_menu' }
        ]]
      }
    }
  );

  delete sessions[userId];
}

module.exports = { startSession, getSession, endSession };

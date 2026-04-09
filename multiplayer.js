const rooms = {};

function createRoom(bot, chatId, userId, username, gameType) {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  rooms[roomCode] = {
    host: { userId, username, chatId },
    players: [{ userId, username, chatId, score: 0 }],
    gameType,
    status: 'waiting',
    currentTurn: 0,
  };

  bot.sendMessage(chatId,
    `🎮 *Room ban gaya!*\n\nRoom Code: \`${roomCode}\`\nGame: ${gameType}\n\nYe code apne dosto ko bhejo!\nWo join kar sakte hain: /join ${roomCode}\n\nPlayers ka wait kar rahe hain... 👥`,
    { parse_mode: 'Markdown' }
  );

  return roomCode;
}

function joinRoom(bot, chatId, userId, username, roomCode) {
  const room = rooms[roomCode];

  if (!room) {
    bot.sendMessage(chatId, `❌ Room *${roomCode}* nahi mila!`, { parse_mode: 'Markdown' });
    return;
  }
  if (room.status !== 'waiting') {
    bot.sendMessage(chatId, `⚠️ Game already shuru ho gaya!`);
    return;
  }
  if (room.players.find(p => p.userId === userId)) {
    bot.sendMessage(chatId, `⚠️ Tu already is room mein hai!`);
    return;
  }

  room.players.push({ userId, username, chatId, score: 0 });

  room.players.forEach(player => {
    bot.sendMessage(player.chatId,
      `✅ *${username}* room mein aa gaya!\nTotal Players: ${room.players.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: room.host.userId === player.userId ? {
          inline_keyboard: [[
            { text: '🚀 Game Shuru Karo!', callback_data: `start_room_${roomCode}` }
          ]]
        } : undefined
      }
    );
  });
}

function getRoom(roomCode) {
  return rooms[roomCode];
}

function nextTurn(roomCode) {
  const room = rooms[roomCode];
  room.currentTurn = (room.currentTurn + 1) % room.players.length;
  return room.players[room.currentTurn];
}

function endGame(bot, roomCode) {
  const room = rooms[roomCode];
  const sorted = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  const resultText = sorted.map((p, i) =>
    `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${p.username}: ${p.score} pts`
  ).join('\n');

  room.players.forEach(player => {
    bot.sendMessage(player.chatId,
      `🏆 *Game Over!*\n\nWinner: *${winner.username}* 🎉\n\n${resultText}`,
      { parse_mode: 'Markdown' }
    );
  });

  delete rooms[roomCode];
}

module.exports = { createRoom, joinRoom, getRoom, nextTurn, endGame };

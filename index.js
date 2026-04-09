require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const quiz = require('./games/quiz');
const numberGuess = require('./games/numberGuess');
const wordGame = require('./games/wordGame');
const diceGame = require('./games/diceGame');
const multiplayer = require('./modes/multiplayer');
const solo = require('./modes/solo');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `🎮 *Welcome to Multi-Game Bot!*\n\nKaunsa game khelna hai? Choose karo!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎯 Quiz', callback_data: 'game_quiz' },
           { text: '🔢 Number Guess', callback_data: 'game_number' }],
          [{ text: '🧩 Word Game', callback_data: 'game_word' },
           { text: '🎲 Dice Game', callback_data: 'game_dice' }],
          [{ text: '🃏 Card Game', callback_data: 'game_card' }],
          [{ text: '🏆 Leaderboard', callback_data: 'leaderboard' }]
        ]
      }
    }
  );
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const username = query.from.username || query.from.first_name;
  const data = query.data;

  if (data.startsWith('game_')) {
    const gameType = data.replace('game_', '');
    bot.sendMessage(chatId, `🎮 *${gameType.toUpperCase()} Game*\n\nKaise khelna hai?`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '👤 Solo', callback_data: `solo_${gameType}` },
          { text: '👥 Multiplayer', callback_data: `multi_${gameType}` }
        ]]
      }
    });
  }

  else if (data.startsWith('solo_')) {
    const gameType = data.replace('solo_', '');
    solo.startSession(userId, gameType);
    if (gameType === 'quiz') quiz.start(bot, chatId, userId);
    else if (gameType === 'number') numberGuess.start(bot, chatId, userId);
    else if (gameType === 'word') wordGame.start(bot, chatId, userId);
    else if (gameType === 'dice') diceGame.start(bot, chatId, userId);
  }

  else if (data.startsWith('multi_')) {
    const gameType = data.replace('multi_', '');
    multiplayer.createRoom(bot, chatId, userId, username, gameType);
  }

  else if (data.startsWith('start_room_')) {
    const roomCode = data.replace('start_room_', '');
    const room = multiplayer.getRoom(roomCode);
    if (!room) return;
    if (room.players.length < 2) {
      bot.sendMessage(chatId, `⚠️ Kam se kam 2 players chahiye!`);
      return;
    }
    if (room.gameType === 'quiz') quiz.startMultiplayer(bot, room, roomCode);
  }

  else if (data.startsWith('quiz_')) {
    const answer = data.replace('quiz_', '').replace(/_/g, ' ');
    quiz.checkAnswer(bot, chatId, answer);
  }

  else if (data.startsWith('dice_')) {
    diceGame.roll(bot, chatId, data);
  }

  else if (data === 'leaderboard') {
    const score = require('./db/score');
    const lb = score.getLeaderboard();
    if (lb.length === 0) {
      bot.sendMessage(chatId, `🏆 Abhi tak koi score nahi hai!`);
      return;
    }
    const text = lb.map((p, i) =>
      `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${p.username}: ${p.points} pts`
    ).join('\n');
    bot.sendMessage(chatId, `🏆 *Leaderboard*\n\n${text}`, { parse_mode: 'Markdown' });
  }
});

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    numberGuess.handleGuess(bot, msg);
    wordGame.handleAnswer(bot, msg);
  }
});

bot.onText(/\/join (.+)/, (msg, match) => {
  const roomCode = match[1].toUpperCase();
  const username = msg.from.username || msg.from.first_name;
  multiplayer.joinRoom(bot, msg.chat.id, msg.from.id, username, roomCode);
});

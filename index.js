require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const quiz = require('./games/quiz');
const numberGuess = require('./games/numberGuess');
const wordGame = require('./games/wordGame');
const diceGame = require('./games/diceGame');
const cardGame = require('./games/cardGame');
const hangman = require('./games/hangman');
const riddles = require('./games/riddles');
const slotMachine = require('./games/slotMachine');
const snakeLadder = require('./games/snakeLadder');
const footballTrivia = require('./games/footballTrivia');
const multiplayer = require('./modes/multiplayer');
const solo = require('./modes/solo');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `🎮 *Welcome to Eru Gaming Zone!*\n\nKaunsa game khelna hai? Choose karo!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎯 Quiz', callback_data: 'game_quiz' },
           { text: '🔢 Number Guess', callback_data: 'game_number' }],
          [{ text: '🧩 Word Game', callback_data: 'game_word' },
           { text: '🎲 Dice Game', callback_data: 'game_dice' }],
          [{ text: '🃏 Card Game', callback_data: 'game_card' },
           { text: '🔤 Hangman', callback_data: 'game_hangman' }],
          [{ text: '❓ Riddles', callback_data: 'game_riddles' },
           { text: '🎰 Slot Machine', callback_data: 'game_slot' }],
          [{ text: '🐍 Snake & Ladder', callback_data: 'game_snake' },
           { text: '⚽ Football Trivia', callback_data: 'game_football' }],
          [{ text: '🏆 Leaderboard', callback_data: 'leaderboard' }]
        ]
      }
    }
  );
});

function startGame(bot, chatId, userId, gameType) {
  if (gameType === 'quiz') quiz.start(bot, chatId, userId);
  else if (gameType === 'number') numberGuess.start(bot, chatId, userId);
  else if (gameType === 'word') wordGame.start(bot, chatId, userId);
  else if (gameType === 'dice') diceGame.start(bot, chatId, userId);
  else if (gameType === 'card') cardGame.start(bot, chatId, userId);
  else if (gameType === 'hangman') hangman.start(bot, chatId, userId);
  else if (gameType === 'riddles') riddles.start(bot, chatId, userId);
  else if (gameType === 'slot') slotMachine.start(bot, chatId, userId);
  else if (gameType === 'snake') snakeLadder.start(bot, chatId, userId);
  else if (gameType === 'football') footballTrivia.start(bot, chatId, userId);
}

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const username = query.from.username || query.from.first_name;
  const data = query.data;

  if (data.startsWith('game_')) {
    const gameType = data.replace('game_', '');
    const noMulti = ['slot', 'snake'];
    if (noMulti.includes(gameType)) {
      startGame(bot, chatId, userId, gameType);
    } else {
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
  }

  else if (data.startsWith('solo_')) {
    const gameType = data.replace('solo_', '');
    solo.startSession(userId, gameType);
    startGame(bot, chatId, userId, gameType);
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
    startGame(bot, room.players[0].chatId, room.players[0].userId, room.gameType);
  }

  else if (data.startsWith('quiz_')) {
    const answer = data.replace('quiz_', '').replace(/_/g, ' ');
    quiz.checkAnswer(bot, chatId, answer);
  }

  else if (data.startsWith('football_')) {
    const answer = data.replace('football_', '').replace(/_/g, ' ');
    footballTrivia.checkAnswer(bot, chatId, answer);
  }

  else if (data.startsWith('dice_')) {
    diceGame.roll(bot, chatId, data);
  }

  else if (data === 'card_hit') cardGame.hit(bot, chatId);
  else if (data === 'card_stand') cardGame.stand(bot, chatId);
  else if (data === 'slot_spin') slotMachine.spin(bot, chatId);
  else if (data === 'snake_roll') snakeLadder.roll(bot, chatId);

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
    hangman.handleGuess(bot, msg);
    riddles.handleAnswer(bot, msg);
  }
});

bot.onText(/\/join (.+)/, (msg, match) => {
  const roomCode = match[1].toUpperCase();
  const username = msg.from.username || msg.from.first_name;
  multiplayer.joinRoom(bot, msg.chat.id, msg.from.id, username, roomCode);
});

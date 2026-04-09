const activeGames = {};

const words = [
  { word: "PYTHON", hint: "🐍 Ek programming language" },
  { word: "CRICKET", hint: "🏏 India ka favourite khel" },
  { word: "MANGO", hint: "🥭 Fruits ka raja" },
  { word: "COMPUTER", hint: "💻 Ek electronic device" },
  { word: "TELEGRAM", hint: "📱 Ek messaging app" },
  { word: "GUITAR", hint: "🎸 Ek musical instrument" },
  { word: "ELEPHANT", hint: "🐘 Sabse bada zamini janwar" },
  { word: "DIAMOND", hint: "💎 Sabse keemti patthar" },
];

const hangmanArt = [
  "```\n  +---+\n      |\n      |\n      |\n      |\n=========```",
  "```\n  +---+\n  O   |\n      |\n      |\n      |\n=========```",
  "```\n  +---+\n  O   |\n  |   |\n      |\n      |\n=========```",
  "```\n  +---+\n  O   |\n /|   |\n      |\n      |\n=========```",
  "```\n  +---+\n  O   |\n /|\\  |\n      |\n      |\n=========```",
  "```\n  +---+\n  O   |\n /|\\  |\n /    |\n      |\n=========```",
  "```\n  +---+\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```",
];

function start(bot, chatId, userId) {
  const item = words[Math.floor(Math.random() * words.length)];
  const guessed = new Array(item.word.length).fill('_');

  activeGames[chatId] = {
    word: item.word,
    hint: item.hint,
    guessed,
    wrongGuesses: [],
    attemptsLeft: 6,
    userId
  };

  bot.sendMessage(chatId,
    `🔤 *Hangman Game!*\n\nHint: ${item.hint}\n\nWord: \`${guessed.join(' ')}\`\n\n${hangmanArt[0]}\n\nEk letter type karo!`,
    { parse_mode: 'Markdown' }
  );
}

function handleGuess(bot, msg) {
  const chatId = msg.chat.id;
  const game = activeGames[chatId];
  if (!game) return;

  const guess = msg.text.toUpperCase().trim();
  if (guess.length !== 1 || !/[A-Z]/.test(guess)) return;

  if (game.wrongGuesses.includes(guess) || game.guessed.includes(guess)) {
    bot.sendMessage(chatId, `⚠️ *${guess}* already try kiya hai!`, { parse_mode: 'Markdown' });
    return;
  }

  if (game.word.includes(guess)) {
    game.word.split('').forEach((letter, i) => {
      if (letter === guess) game.guessed[i] = guess;
    });

    if (!game.guessed.includes('_')) {
      bot.sendMessage(chatId,
        `✅ *${guess}* sahi hai!\n\nWord: \`${game.guessed.join(' ')}\`\n\n🎉 *Tum jeet gaye! Word tha: ${game.word}*`,
        { parse_mode: 'Markdown' }
      );
      delete activeGames[chatId];
      return;
    }

    bot.sendMessage(chatId,
      `✅ *${guess}* sahi hai!\n\nWord: \`${game.guessed.join(' ')}\`\n${hangmanArt[6 - game.attemptsLeft]}\n\nAur letters try karo!`,
      { parse_mode: 'Markdown' }
    );
  } else {
    game.wrongGuesses.push(guess);
    game.attemptsLeft--;

    if (game.attemptsLeft === 0) {
      bot.sendMessage(chatId,
        `❌ *${guess}* galat!\n\n${hangmanArt[6]}\n\n💀 *Game Over! Word tha: ${game.word}*`,
        { parse_mode: 'Markdown' }
      );
      delete activeGames[chatId];
      return;
    }

    bot.sendMessage(chatId,
      `❌ *${guess}* galat!\n\nWord: \`${game.guessed.join(' ')}\`\n${hangmanArt[6 - game.attemptsLeft]}\n\nGalat: ${game.wrongGuesses.join(', ')}\nBache attempts: *${game.attemptsLeft}*`,
      { parse_mode: 'Markdown' }
    );
  }
}

module.exports = { start, handleGuess };

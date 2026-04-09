const activeGames = {};

const suits = ['♠️', '♥️', '♦️', '♣️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return `${value}${suit}`;
}

function getCardValue(card) {
  const val = card.replace(/[♠️♥️♦️♣️]/g, '').trim();
  if (['J', 'Q', 'K'].includes(val)) return 10;
  if (val === 'A') return 11;
  return parseInt(val);
}

function start(bot, chatId, userId) {
  const playerCard1 = getCard();
  const playerCard2 = getCard();
  const botCard1 = getCard();
  const botCard2 = getCard();

  const playerTotal = getCardValue(playerCard1) + getCardValue(playerCard2);
  const botTotal = getCardValue(botCard1) + getCardValue(botCard2);

  activeGames[chatId] = { playerTotal, botTotal, userId };

  bot.sendMessage(chatId,
    `🃏 *Card Game!*\n\nTumhare cards: ${playerCard1} ${playerCard2}\nTumhara total: *${playerTotal}*\n\nAur card loge?`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Aur do (Hit)', callback_data: 'card_hit' },
          { text: '🛑 Bas (Stand)', callback_data: 'card_stand' }
        ]]
      }
    }
  );
}

function hit(bot, chatId) {
  const game = activeGames[chatId];
  if (!game) return;

  const newCard = getCard();
  game.playerTotal += getCardValue(newCard);

  if (game.playerTotal > 21) {
    bot.sendMessage(chatId,
      `🃏 Naya card: ${newCard}\nTumhara total: *${game.playerTotal}*\n\n💥 *Bust! Tum haar gaye!*`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  bot.sendMessage(chatId,
    `🃏 Naya card: ${newCard}\nTumhara total: *${game.playerTotal}*\n\nAur card loge?`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Aur do (Hit)', callback_data: 'card_hit' },
          { text: '🛑 Bas (Stand)', callback_data: 'card_stand' }
        ]]
      }
    }
  );
}

function stand(bot, chatId) {
  const game = activeGames[chatId];
  if (!game) return;

  let result;
  if (game.playerTotal > game.botTotal) {
    result = `🎉 *Tum jeet gaye!*\nTumhara: ${game.playerTotal} vs Bot: ${game.botTotal}`;
  } else if (game.playerTotal < game.botTotal) {
    result = `😢 *Tum haar gaye!*\nTumhara: ${game.playerTotal} vs Bot: ${game.botTotal}`;
  } else {
    result = `🤝 *Draw!*\nDono ka: ${game.playerTotal}`;
  }

  bot.sendMessage(chatId, `🃏 *Game Over!*\n\n${result}`, { parse_mode: 'Markdown' });
  delete activeGames[chatId];
}

module.exports = { start, hit, stand };

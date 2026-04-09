// cardGame.js
let activeGames = {};   // ← Yeh missing tha!

function getCard() {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { value, suit };
}

function getCardValue(card) {
    const val = card.value.replace(/[\u2660\u2665\u2666\u2663]/g, '').trim();
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

    activeGames[chatId] = { 
        playerTotal, 
        botTotal, 
        userId 
    };

    bot.sendMessage(chatId, 
        `🎴 *Card Game Started!*\n\n` +
        `Tumhare cards: \( {playerCard1.value} \){playerCard1.suit} \( {playerCard2.value} \){playerCard2.suit}\n` +
        `Tumhara total: *${playerTotal}*\n\n` +
        `Bot ka pehla card: \( {botCard1.value} \){botCard1.suit} ❓\n\n` +
        `Kya karoge?`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Aur do (Hit)', callback_data: 'card_hit' }],
                    [{ text: '🛑 Bas (Stand)', callback_data: 'card_stand' }]
                ]
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
        bot.sendMessage(chatId, `💥 Naya card: \( {newCard.value} \){newCard.suit}\n\n` +
            `Tumhara total: *${game.playerTotal}* (Bust!)\n\n` +
            `Tum haar gaye! 😢`, { parse_mode: 'Markdown' });
        delete activeGames[chatId];
        return;
    }

    bot.sendMessage(chatId, 
        `Naya card: \( {newCard.value} \){newCard.suit}\n` +
        `Tumhara total: *${game.playerTotal}*`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Aur do (Hit)', callback_data: 'card_hit' }],
                    [{ text: '🛑 Bas (Stand)', callback_data: 'card_stand' }]
                ]
            }
        }
    );
}

function stand(bot, chatId) {
    const game = activeGames[chatId];
    if (!game) return;

    let result;
    if (game.playerTotal > game.botTotal) {
        result = `🎉 Tum jeet gaye! ${game.playerTotal} vs Bot: ${game.botTotal}`;
    } else if (game.playerTotal < game.botTotal) {
        result = `😢 Tum haar gaye! ${game.playerTotal} vs Bot: ${game.botTotal}`;
    } else {
        result = `🤝 Draw! Dono ka ${game.playerTotal}`;
    }

    bot.sendMessage(chatId, `🏁 *Game Over*\n\n${result}`, { parse_mode: 'Markdown' });
    delete activeGames[chatId];
}

module.exports = { start, hit, stand };

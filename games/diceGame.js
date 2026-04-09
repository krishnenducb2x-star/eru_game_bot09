// diceGame.js
function start(bot, chatId, userId) {
    bot.sendMessage(chatId, 
        `🎲 *Dice High Low Game*\n\n` +
        `Dice roll HIGH (4-6) hoga ya LOW (1-3)?\n` +
        `Choose karo!`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔥 HIGH (4-6)', callback_data: 'dice_high' }],
                    [{ text: '❄️ LOW (1-3)', callback_data: 'dice_low' }]
                ]
            }
        }
    );
}

function roll(bot, chatId, choice) {
    const result = Math.floor(Math.random() * 6) + 1; // 1 to 6
    
    const isHigh = result >= 4;
    const userChoseHigh = choice === 'dice_high';
    
    let message = `🎲 Dice roll hua: *${result}*\n\n`;
    
    if ((isHigh && userChoseHigh) || (!isHigh && !userChoseHigh)) {
        message += `🎉 *Tu jeet gaya!*`;
    } else {
        message += `😢 Tu haar gaya!`;
    }

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

module.exports = { start, roll };

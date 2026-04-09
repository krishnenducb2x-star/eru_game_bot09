const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. Apna Bot Token yahan daalein
const token = '8621356083:AAFkHOA-xXem8LDS09cwHxMane8d4o1kyUw';

// 2. Render ka 'Port Binding' error solve karne ke liye chhota server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is Live and Running fine!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// 3. Bot configure karein (Conflict kam karne ke liye)
const bot = new TelegramBot(token, { 
    polling: {
        autoStart: true,
        params: { timeout: 20 }
    }
});

// 4. Saare Game files ko yahan link karein
const games = {
    battle: require('./battleGame'),
    card: require('./cardGame'),
    chess: require('./chess'),
    dice: require('./diceGame'),
    football: require('./footballTrivia'),
    hangman: require('./hangman'),
    ludo: require('./ludo'),
    number: require('./numberGuess'),
    quiz: require('./quiz'),
    riddles: require('./riddles'),
    slots: require('./slotMachine'),
    snake: require('./snakeLadder'),
    word: require('./wordGame')
};

// 5. /start command ka response
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let menu = "🎮 **Welcome to Eru Game Zone** 🎮\n\nNiche diye gaye games mein se choose karein:\n";
    
    Object.keys(games).forEach(game => {
        menu += `\n/play_${game}`;
    });
    
    bot.sendMessage(chatId, menu, { parse_mode: 'Markdown' });
});

// 6. Game play handler
bot.on('message', (msg) => {
    if (!msg.text || !msg.text.startsWith('/play_')) return;
    
    const chatId = msg.chat.id;
    const gameName = msg.text.replace('/play_', '');
    
    if (games[gameName]) {
        bot.sendMessage(chatId, `🚀 **${gameName.toUpperCase()}** start ho raha hai... Taiyar rahein!`);
        // Note: Har game file mein start function hona chahiye
        // games[gameName].start(bot, chatId);
    } else {
        bot.sendMessage(chatId, "Sorry, ye game nahi mil raha. Please /start likh kar check karein.");
    }
});

// 7. Error handling (Taki bot crash na ho)
bot.on('polling_error', (err) => console.log(`Polling Error: ${err.message}`));
bot.on('error', (err) => console.log(`General Error: ${err.message}`));

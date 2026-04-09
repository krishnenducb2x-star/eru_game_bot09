const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. Apna asli Bot Token yahan paste karein
const token = '8621356083:AAFkHOA-xXem8LDS09cwHxMane8d4o1kyUw';

// 2. Render ka 'Port Binding' error solve karne ke liye chhota server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Eru Game Bot is Online!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 3. Bot configure karein
const bot = new TelegramBot(token, { 
    polling: {
        autoStart: true,
        params: { timeout: 20 }
    }
});

// 4. Game files load karein (Folder 'games' ke andar hain isliye ./games/ use kiya hai)
const games = {
    battle: require('./games/battleGame'),
    card: require('./games/cardGame'),
    chess: require('./games/chess'),
    dice: require('./games/diceGame'),
    football: require('./games/footballTrivia'),
    hangman: require('./games/hangman'),
    ludo: require('./games/ludo'),
    number: require('./games/numberGuess'),
    quiz: require('./games/quiz'),
    riddles: require('./games/riddles'),
    slots: require('./games/slotMachine'),
    snake: require('./games/snakeLadder'),
    word: require('./games/wordGame')
};

// 5. Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let menu = "🎮 **Welcome to Eru Game Zone** 🎮\n\nGame khelne ke liye command par click karein:\n";
    
    Object.keys(games).forEach(game => {
        menu += `\n/play_${game}`;
    });
    
    bot.sendMessage(chatId, menu, { parse_mode: 'Markdown' });
});

// 6. Game command handler
bot.on('message', (msg) => {
    if (!msg.text || !msg.text.startsWith('/play_')) return;
    
    const chatId = msg.chat.id;
    const gameName = msg.text.replace('/play_', '');
    
    if (games[gameName]) {
        bot.sendMessage(chatId, `🚀 **${gameName.toUpperCase()}** start ho raha hai... Best of luck!`);
        // Note: Make sure your game files have a start function
        // games[gameName].start(bot, chatId);
    }
});

// 7. Error handling
bot.on('polling_error', (err) => console.log(`Polling Error: ${err.message}`));


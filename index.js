const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. Render Port Fix (Taki service active rahe)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Eru Game Bot is Online!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 2. Apna Bot Token (Securely using Environment Variable is better)
const token = '8621356083:AAHm4EkOotBjPBsAu2Zy8WuRuLYw3IwremA'; 
const bot = new TelegramBot(token, { 
    polling: {
        autoStart: true,
        params: { timeout: 20 }
    }
});

// 3. Game files load karein
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

// 4. Start command (Simplified to avoid parsing errors)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let menu = "Welcome to Eru Game Zone 🎮\n\nGame khelne ke liye niche diye gaye commands par click karein:\n";
    
    Object.keys(games).forEach(game => {
        menu += "\n/play_" + game;
    });
    
    bot.sendMessage(chatId, menu);
});

// 5. Game command handler
bot.on('message', (msg) => {
    if (!msg.text || !msg.text.startsWith('/play_')) return;
    
    const chatId = msg.chat.id;
    const gameName = msg.text.replace('/play_', '');
    
    if (games[gameName]) {
        bot.sendMessage(chatId, "🚀 Starting " + gameName.toUpperCase() + "... Taiyar rahein!");
        // Note: Yahan aapka game start logic aayega
    }
});

// 6. Error handling
bot.on('polling_error', (err) => console.log("Polling Error: " + err.message));
bot.on('error', (err) => console.log("General Error: " + err.message));
// Buttons ke click (callback_query) ko handle karne ke liye
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Agar button Battle Game ka hai
    if (data.startsWith('battle_')) {
        if (games.battle && typeof games.battle.action === 'function') {
            // Ye battleGame.js ke action function ko chalayega
            games.battle.action(bot, chatId, data);
        }
    }
    
    // Buttons ke upar se loading spinner hatane ke liye
    bot.answerCallbackQuery(query.id);
});

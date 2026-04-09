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

// 2. Apna Bot Token
const token = '8621356083:AAG2_7x_Tq09uwb4YgDMH3n8l8F4YyNURhk'; 
const bot = new TelegramBot(token, { 
    polling: {
        autoStart: true,
        params: { timeout: 20 }
    }
});

// 3. Game files load karein (Path sahi rakhein)
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

// 4. Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let menu = "Welcome to Eru Game Zone 🎮\n\nGame khelne ke liye commands par click karein:\n";
    Object.keys(games).forEach(game => {
        menu += "\n/play_" + game;
    });
    bot.sendMessage(chatId, menu);
});

// 5. Game command handler (Logic added here)
bot.on('message', (msg) => {
    if (!msg.text || !msg.text.startsWith('/play_')) return;
    
    const chatId = msg.chat.id;
    const gameName = msg.text.replace('/play_', '');
    
    if (games[gameName]) {
        bot.sendMessage(chatId, "🚀 Starting " + gameName.toUpperCase() + "... Taiyar rahein!");
        
        // Game start karne ka asli logic
        try {
            if (typeof games[gameName].start === 'function') {
                games[gameName].start(bot, chatId);
            } else {
                bot.sendMessage(chatId, "Error: Is game file mein 'start' function nahi mila.");
            }
        } catch (err) {
            console.log("Error starting game: " + err.message);
        }
    }
});

// 6. Buttons handler (Callback Query)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Har game ke buttons handle karne ke liye
    Object.keys(games).forEach(game => {
        if (data.startsWith(game + '_') && typeof games[game].action === 'function') {
            games[game].action(bot, chatId, data);
        }
    });
    
    bot.answerCallbackQuery(query.id);
});

// 7. Error handling
bot.on('polling_error', (err) => console.log("Polling Error: " + err.message));


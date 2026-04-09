const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. Render ka 'No open ports' error fix karne ke liye chhota server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Eru Game Bot is Online and Running!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 2. Apna Bot Token (Securely)
// Note: Sab sahi hone ke baad is token ko Render ke Environment Variables mein daal dena.
const token = '8021358033:AAHkMGA-XKemBLD509cwMXGznz3d4o1kyUw'; 

const bot = new TelegramBot(token, { 
    polling: {
        autoStart: true,
        params: { timeout: 20 }
    }
});

// 3. Game files load karein (Make sure folders aur files sahi jagah ho)
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

// 4. /start command ka response
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let menu = "🎮 **Welcome to Eru Game Zone** 🎮\n\nGame khelne ke liye niche diye gaye command par click karein:\n";
    
    Object.keys(games).forEach(game => {
        menu += `\n/play_${game}`;
    });
    
    bot.sendMessage(chatId, menu, { parse_mode: 'Markdown' });
});

// 5. Game command handler
bot.on('message', (msg) => {
    if (!msg.text || !msg.text.startsWith('/play_')) return;
    
    const chatId = msg.chat.id;
    const gameName = msg.text.replace('/play_', '');
    
    if (games[gameName]) {
        bot.sendMessage(chatId, `🚀 **${gameName.toUpperCase()}** start ho raha hai... Taiyar rahein!`);
        
        // Agar aapke game files mein start() function hai toh usey yahan call karein:
        // if(typeof games[gameName].start === 'function') {
        //    games[gameName].start(bot, chatId);
        // }
    } else {
        bot.sendMessage(chatId, "Sorry, ye game list mein nahi hai. /start likh kar check karein.");
    }
});

// 6. Error handling (Conflict ya Polling error ko log karne ke liye)
bot.on('polling_error', (err) => {
    console.log(`[Polling Error]: ${err.code} - ${err.message}`);
});

bot.on('error', (err) => {
    console.log(`[General Error]: ${err.message}`);
});


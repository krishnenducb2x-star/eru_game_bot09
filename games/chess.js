// chess.js
const activeGames = {};

const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟️', '♟️', '♟️', '♟️', '♟️', '♟️', '♟️', '♟️'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

const colMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

function boardToString(board) {
    let str = '    a b c d e f g h\n';
    for (let i = 0; i < 8; i++) {
        str += `${8 - i}  ${board[i].join(' ')}\n`;
    }
    return str;
}

function start(bot, chatId, userId) {
    const board = initialBoard.map(row => [...row]);
    
    activeGames[chatId] = {
        board,
        userId,
        turn: 'white',
        selected: null
    };

    bot.sendMessage(chatId, 
        `♟️ *Chess Game Started!*\n\n` +
        `${boardToString(board)}\n` +
        `Tumhari baari (White)!\n` +
        `Move karne ke liye example: ` + "`e2e4`",
        {
            parse_mode: 'Markdown',
        }
    );
}

function handleMove(bot, msg) {
    const chatId = msg.chat.id;
    const game = activeGames[chatId];
    if (!game) return;

    const text = msg.text.toLowerCase().trim();
    const moveRegex = /^([a-h][1-8])([a-h][1-8])$/;
    const match = text.match(moveRegex);

    if (!match) {
        bot.sendMessage(chatId, "❌ Invalid move! Example: `e2e4`", { parse_mode: 'Markdown' });
        return;
    }

    const from = match[1];
    const to = match[2];

    const fromCol = colMap[from[0]];
    const fromRow = 8 - parseInt(from[1]);
    const toCol = colMap[to[0]];
    const toRow = 8 - parseInt(to[1]);

    const board = game.board;
    const piece = board[fromRow][fromCol];

    if (piece === ' ') {
        bot.sendMessage(chatId, "❌ Khaali jagah se move nahi kar sakte!");
        return;
    }

    // Simple turn check
    const isWhitePiece = '♙♖♘♗♕♔'.includes(piece);
    if ((game.turn === 'white' && !isWhitePiece) || (game.turn === 'black' && isWhitePiece)) {
        bot.sendMessage(chatId, `❌ Abhi ${game.turn === 'white' ? 'White' : 'Black'} ki baari hai!`);
        return;
    }

    // Basic move (for now - you can add full chess rules later)
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = ' ';

    // Switch turn
    game.turn = game.turn === 'white' ? 'black' : 'white';

    bot.sendMessage(chatId, 
        `✅ Move kiya: ${from} → ${to}\n\n` +
        `${boardToString(board)}\n` +
        `Ab ${game.turn === 'white' ? 'White' : 'Black'} ki baari!`,
        { parse_mode: 'Markdown' }
    );

    // You can add checkmate / game end logic here later
}

module.exports = { start, handleMove };

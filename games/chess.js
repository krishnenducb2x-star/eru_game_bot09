const activeGames = {};

const initialBoard = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['⬜','⬛','⬜','⬛','⬜','⬛','⬜','⬛'],
  ['⬛','⬜','⬛','⬜','⬛','⬜','⬛','⬜'],
  ['⬜','⬛','⬜','⬛','⬜','⬛','⬜','⬛'],
  ['⬛','⬜','⬛','⬜','⬛','⬜','⬛','⬜'],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖'],
];

const colMap = { a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7 };

function boardToString(board) {
  const cols = '  a b c d e f g h';
  const rows = board.map((row, i) => `${8-i} ${row.join(' ')}`);
  return `\`\`\`\n${cols}\n${rows.join('\n')}\n\`\`\``;
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
    `♟️ *Chess Game!*\n\n${boardToString(board)}\n\n⬜ Tumhari baari (White)\n\nMove karo! Example: \`e2 e4\`\n_(pehle current position, phir target position)_`,
    { parse_mode: 'Markdown' }
  );
}

function handleMove(bot, msg) {
  const chatId = msg.chat.id;
  const game = activeGames[chatId];
  if (!game) return;

  const text = msg.text.toLowerCase().trim();
  const moveRegex = /^([a-h][1-8])\s+([a-h][1-8])$/;
  const match = text.match(moveRegex);

  if (!match) return;

  const [, from, to] = match;
  const fromCol = colMap[from[0]];
  const fromRow = 8 - parseInt(from[1]);
  const toCol = colMap[to[0]];
  const toRow = 8 - parseInt(to[1]);

  const board = game.board;
  const piece = board[fromRow][fromCol];

  const whitePieces = ['♙','♖','♘','♗','♕','♔'];
  const blackPieces = ['♟','♜','♞','♝','♛','♚'];
  const emptySquares = ['⬜','⬛'];

  if (emptySquares.includes(piece)) {
    bot.sendMessage(chatId, `⚠️ Us jagah koi piece nahi hai! Dobara try karo.`);
    return;
  }

  if (game.turn === 'white' && !whitePieces.includes(piece)) {
    bot.sendMessage(chatId, `⚠️ Ye tumhara piece nahi hai! White piece choose karo.`);
    return;
  }

  if (game.turn === 'black' && !blackPieces.includes(piece)) {
    bot.sendMessage(chatId, `⚠️ Ye tumhara piece nahi hai! Black piece choose karo.`);
    return;
  }

  const targetPiece = board[toRow][toCol];

  // Check if king captured
  if (targetPiece === '♔') {
    bot.sendMessage(chatId,
      `♟️ *CHECKMATE!*\n\n⬛ Black jeet gaya!\n\n${boardToString(board)}`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  if (targetPiece === '♚') {
    bot.sendMessage(chatId,
      `♟️ *CHECKMATE!*\n\n⬜ White jeet gaya!\n\n${boardToString(board)}`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  // Move piece
  const originalTarget = board[toRow][toCol];
  board[toRow][toCol] = piece;

  // Restore empty square pattern
  const isLight = (fromRow + fromCol) % 2 === 0;
  board[fromRow][fromCol] = isLight ? '⬜' : '⬛';

  game.turn = game.turn === 'white' ? 'black' : 'white';
  const turnText = game.turn === 'white' ? '⬜ White ki baari' : '⬛ Black ki baari';
  const captureText = emptySquares.includes(originalTarget) ? '' : `\n🎯 *${originalTarget}* capture kiya!`;

  bot.sendMessage(chatId,
    `♟️ *Chess*\n\n${boardToString(board)}\n\n${captureText}\n${turnText}\n\nMove karo! Example: \`e7 e5\``,
    { parse_mode: 'Markdown' }
  );
}

module.exports = { start, handleMove };

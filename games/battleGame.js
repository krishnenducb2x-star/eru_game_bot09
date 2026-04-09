const activeGames = {};

const enemies = [
  { name: "🐉 Dragon", hp: 100, attack: 25, defense: 10 },
  { name: "👹 Demon", hp: 80, attack: 30, defense: 5 },
  { name: "🧟 Zombie", hp: 60, attack: 15, defense: 3 },
  { name: "🦁 Wild Lion", hp: 70, attack: 20, defense: 8 },
  { name: "🤖 Robot", hp: 90, attack: 22, defense: 15 },
];

function start(bot, chatId, userId) {
  const enemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
  activeGames[chatId] = {
    userId,
    playerHp: 100,
    playerAttack: 20,
    enemy,
    round: 1
  };

  bot.sendMessage(chatId,
    `⚔️ *Battle Game!*\n\n${enemy.name} ne attack kiya!\n\n❤️ Tumhara HP: *100*\n💀 ${enemy.name} HP: *${enemy.hp}*\n\nKya karoge?`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚔️ Attack', callback_data: 'battle_attack' },
           { text: '🛡️ Defend', callback_data: 'battle_defend' }],
          [{ text: '💊 Heal (+20 HP)', callback_data: 'battle_heal' },
           { text: '💥 Super Attack', callback_data: 'battle_super' }]
        ]
      }
    }
  );
}

function action(bot, chatId, move) {
  const game = activeGames[chatId];
  if (!game) return;

  let playerDmg = 0;
  let enemyDmg = 0;
  let actionText = '';

  const enemyAttack = Math.floor(Math.random() * game.enemy.attack) + 5;

  if (move === 'battle_attack') {
    playerDmg = Math.floor(Math.random() * game.playerAttack) + 10;
    enemyDmg = Math.max(0, enemyAttack - 5);
    actionText = `⚔️ Tumne *${playerDmg}* damage diya!\n👿 Dushman ne *${enemyDmg}* damage diya!`;
  } else if (move === 'battle_defend') {
    playerDmg = Math.floor(Math.random() * 10) + 5;
    enemyDmg = Math.max(0, enemyAttack - 15);
    actionText = `🛡️ Defend kiya! Sirf *${enemyDmg}* damage liya!\n⚔️ Counter attack se *${playerDmg}* damage diya!`;
  } else if (move === 'battle_heal') {
    playerDmg = 0;
    enemyDmg = enemyAttack;
    game.playerHp = Math.min(100, game.playerHp + 20);
    actionText = `💊 *+20 HP* heal kiya!\n👿 Dushman ne *${enemyDmg}* damage diya!`;
  } else if (move === 'battle_super') {
    playerDmg = Math.floor(Math.random() * 40) + 20;
    enemyDmg = enemyAttack + 5;
    actionText = `💥 *SUPER ATTACK!* *${playerDmg}* damage diya!\n👿 Dushman ne *${enemyDmg}* damage diya!`;
  }

  game.enemy.hp -= playerDmg;
  game.playerHp -= enemyDmg;
  game.round++;

  if (game.enemy.hp <= 0) {
    bot.sendMessage(chatId,
      `${actionText}\n\n🏆 *JEET GAYE!*\n${game.enemy.name} ko haara diya!\n⚔️ ${game.round} rounds mein victory! 🎉`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  if (game.playerHp <= 0) {
    bot.sendMessage(chatId,
      `${actionText}\n\n💀 *HAAR GAYE!*\n${game.enemy.name} ne tumhe haara diya!\nDobara try karo! 💪`,
      { parse_mode: 'Markdown' }
    );
    delete activeGames[chatId];
    return;
  }

  bot.sendMessage(chatId,
    `${actionText}\n\n❤️ Tumhara HP: *${game.playerHp}*\n💀 ${game.enemy.name} HP: *${game.enemy.hp}*\n\nRound: ${game.round}`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚔️ Attack', callback_data: 'battle_attack' },
           { text: '🛡️ Defend', callback_data: 'battle_defend' }],
          [{ text: '💊 Heal (+20 HP)', callback_data: 'battle_heal' },
           { text: '💥 Super Attack', callback_data: 'battle_super' }]
        ]
      }
    }
  );
}

module.exports = { start, action };

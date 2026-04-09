const scores = {};

function addScore(userId, username, points) {
  if (!scores[userId]) scores[userId] = { username, points: 0 };
  scores[userId].points += points;
}

function getLeaderboard() {
  return Object.values(scores)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
}

module.exports = { addScore, getLeaderboard };

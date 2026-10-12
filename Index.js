
const PREFIX = ".";

// CHIDEX ANIME BATTLE BOT
// Game engine starter

const users = new Map();
const challenges = new Map();

const games = {
  dbz: {
    name: "Dragon Ball",
    start: "dbzstart",
    battle: "dbzbattle",
    train: "dbztrain",
    fighters: ["Goku", "Vegeta", "Gohan", "Piccolo"]
  },
  pokemon: {
    name: "Pokemon",
    start: "startjourney",
    battle: "battle",
    train: "trainpokemon",
    fighters: ["Pikachu", "Charizard", "Bulbasaur", "Squirtle"]
  },
  naruto: {
    name: "Naruto",
    start: "narutostart",
    battle: "narutobattle",
    train: "narutotrain",
    fighters: ["Naruto", "Sasuke", "Sakura", "Kakashi"]
  }
};

function getUser(id) {
  if (!users.has(id)) {
    users.set(id, {
      coins: 100,
      xp: 0,
      wins: 0,
      lastDaily: 0,
      lastWork: 0,
      games: {}
    });
  }
  return users.get(id);
}

function levelOf(user) {
  return Math.floor(user.xp / 100) + 1;
}

function startGame(id, key) {
  const user = getUser(id);
  const game = games[key];

  if (user.games[key]) {
    return `You have already started ${game.name}!`;
  }

  user.games[key] = {
    fighter: game.fighters[0],
    level: 1,
    hp: 100
  };

  return `🔥 ${game.name} journey started!\n\n` +
    `Your fighter: ${game.fighters[0]}\n` +
    `❤️ HP: 100\n` +
    `Use .${game.battle} to battle!`;
}

function battle(id, key) {
  const user = getUser(id);
  const game = games[key];
  const hero = user.games[key];

  if (!hero) {
    return `Start first with .${game.start}`;
  }

  if (hero.hp <= 0) {
    hero.hp = 50;
    return "You need to recover! Your HP has been restored to 50.";
  }

  let enemy = game.fighters[
    Math.floor(Math.random() * game.fighters.length)
  ];

  if (enemy === hero.fighter) {
    enemy = game.fighters[
      (game.fighters.indexOf(enemy) + 1) % game.fighters.length
    ];
  }

  const attack = 15 + Math.floor(Math.random() * 26);
  const damage = Math.max(1, attack - Math.floor(hero.level / 2));

  // Simple computer-controlled battle
  const enemyDamage = 5 + Math.floor(Math.random() * 16);
  const heroHP = Math.max(0, hero.hp - enemyDamage);

  hero.hp = heroHP;

  if (hero.hp === 0) {
    hero.hp = 50;
    return `💥 ${enemy} defeated ${hero.fighter}!\n` +
      "You recovered to 50 HP. Train and try again.";
  }

  user.xp += 20;
  user.coins += 15;
  user.wins++;
  hero.level = Math.floor(user.xp / 100) + 1;

  return `⚔️ ${game.name} BATTLE ⚔️\n\n` +
    `${hero.fighter} fought ${enemy}!\n` +
    `💥 Your attack: ${damage}\n` +
    `💢 Enemy attack: ${enemyDamage}\n` +
    `❤️ Remaining HP: ${hero.hp}\n\n` +
    `🏆 Victory reward: 15 coins\n` +
    `✨ XP earned: 20\n` +
    `⭐ Account level: ${levelOf(user)}`;
}

function train(id, key) {
  const user = getUser(id);
  const game = games[key];
  const hero = user.games[key];

  if (!hero) return `Start first with .${game.start}`;

  hero.level++;
  hero.hp = 100;
  user.xp += 10;

  return `💪 Training complete!\n` +
    `${hero.fighter} is now level ${hero.level}.\n` +
    "❤️ HP restored to 100.";
}

function handleCommand(id, message) {
  if (typeof message !== "string") return null;

  const input = message.trim();
  if (!input.startsWith(PREFIX)) return null;

  const parts = input.slice(1).trim().split(/\s+/);
  const cmd = (parts.shift() || "").toLowerCase();
  const args = parts;
  const user = getUser(id);

  if (cmd === "menu") {
    return `╭─🏡 「 CHIDEX BOT 」
│ .alive
│ .info
│ .ping
│ .menu
╰━━━━━━━━━━━━━━
╭─💰 「 ECONOMY 」
│ .balance
│ .daily
│ .work
│ .profile
│ .top
╰━━━━━━━━━━━━━━
╭─🐉 「 DRAGON BALL 」
│ .dbzstart
│ .dbzbattle
│ .dbztrain
╰━━━━━━━━━━━━━━
╭─⚡ 「 POKEMON 」
│ .startjourney
│ .battle
│ .trainpokemon
╰━━━━━━━━━━━━━━
╭─🍥 「 NARUTO 」
│ .narutostart
│ .narutobattle
│ .narutotrain
╰━━━━━━━━━━━━━━
╭─🎮 「 GAMES 」
│ .guess
│ .math
│ .rps
╰━━━━━━━━━━━━━━
╭─⚔️ 「 PLAYER BATTLES 」
│ .challenge
│ .accept
│ .cancel
╰━━━━━━━━━━━━━━`;
  }

  if (cmd === "alive") return "✅ Chidex Bot is alive!";
  if (cmd === "ping") return "🏓 Pong!";
  if (cmd === "info") return "🤖 Chidex Anime Bot\nVersion 1.0";

  if (cmd === "balance") {
    return `💰 Coins: ${user.coins}`;
  }

  if (cmd === "profile") {
    return `👤 PLAYER PROFILE\n` +
      `⭐ Level: ${levelOf(user)}\n` +
      `✨ XP: ${user.xp}\n` +
      `🏆 Wins: ${user.wins}\n` +
      `💰 Coins: ${user.coins}`;
  }

  if (cmd === "daily") {
    const now = Date.now();
    if (now - user.lastDaily < 24 * 60 * 60 * 1000) {
      const hours = Math.ceil(
        (24 * 60 * 60 * 1000 - (now - user.lastDaily)) / 3600000
      );
      return `⏳ Your next daily reward is in about ${hours} hour(s).`;
    }

    user.lastDaily = now;
    user.coins += 100;
    return "🎁 Daily reward: 100 coins!";
  }

  if (cmd === "work") {
    const now = Date.now();
    if (now - user.lastWork < 60 * 60 * 1000) {
      return "⏳ You can work again in one hour.";
    }

    user.lastWork = now;
    const earned = 20 + Math.floor(Math.random() * 81);
    user.coins += earned;
    return `💼 You worked and earned ${earned} coins!`;
  }

  if (cmd === "top") {
    const ranking = [...users.entries()]
      .sort((a, b) => b[1].coins - a[1].coins)
      .slice(0, 10);

    if (!ranking.length) return "No players yet.";

    return "🏆 TOP PLAYERS\n" +
      ranking.map(([player, data], i) =>
        `${i + 1}. ${player}: ${data.coins} coins`
      ).join("\n");
  }

  for (const [key, game] of Object.entries(games)) {
    if (cmd === game.start) return startGame(id, key);
    if (cmd === game.battle) return battle(id, key);
    if (cmd === game.train) return train(id, key);
  }

  if (cmd === "guess") {
    const answer = Math.floor(Math.random() * 10) + 1;
    const guess = Number(args[0]);

    if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
      return "🎯 Guess a number from 1 to 10. Example: .guess 5";
    }

    if (guess === answer) {
      user.coins += 20;
      return "🎉 Correct! You earned 20 coins!";
    }

    return `❌ Not this time! The number was ${answer}.`;
  }

  if (cmd === "math") {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;

    if (args.length) {
      return "🧮 Answer the math question shown by .math next time!";
    }

    return `🧮 What is ${a} + ${b}? Reply with .answer ${a + b}`;
  }

  if (cmd === "answer") {
    return "The math answer feature will be added in a later update.";
  }

  if (cmd === "rps") {
    const choice = (args[0] || "").toLowerCase();
    const valid = ["rock", "paper", "scissors"];

    if (!valid.includes(choice)) {
      return "Choose one: .rps rock, .rps paper, or .rps scissors";
    }

    const bot = valid[Math.floor(Math.random() * 3)];

    if (choice === bot) return `🤝 Draw! I chose ${bot}.`;

    const won =
      (choice === "rock" && bot === "scissors") ||
      (choice === "paper" && bot === "rock") ||
      (choice === "scissors" && bot === "paper");

    if (won) user.coins += 10;

    return `${won ? "🎉 You win! +10 coins." : "😅 You lose."}\n` +
      `You: ${choice}\nBot: ${bot}`;
  }

  if (cmd === "challenge") {
    if (!args[0]) return "Usage: .challenge playerID";

    challenges.set(id, args[0]);
    return `⚔️ Challenge created for ${args[0]}.\n` +
      "Real player battles still need WhatsApp integration.";
  }

  if (cmd === "accept") {
    return "PvP is not connected yet. We'll add real player battles next.";
  }

  if (cmd === "cancel") {
    challenges.delete(id);
    return "Challenge cancelled.";
  }

  return "❌ Unknown command. Type .menu";
}

// Basic test
console.log(handleCommand("demo", ".alive"));
console.log(handleCommand("demo", ".dbzstart"));
console.log(handleCommand("demo", ".dbzbattle"));
console.log(handleCommand("demo", ".menu"));


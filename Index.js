
const prefix = ".";

const menu = `
╭─🏡 「 MAIN 」
│
│ ꕥ .alive
│ ꕥ .bots
│ ꕥ .info
│ ꕥ .menu
│ ꕥ .ping
│ ꕥ .rules
│ ꕥ .support
╰━━━━━━━━━━━━━━
╭─💰 「 ECONOMY 」
│
│ ꕥ .balance
│ ꕥ .daily
│ ꕥ .work
│ ꕥ .beg
╰━━━━━━━━━━━━━━
╭─🐾 「 PETS 」
│
│ ꕥ .adopt
│ ꕥ .pet
│ ꕥ .petfeed
╰━━━━━━━━━━━━━━
╭─🎮 「 GAMES 」
│
│ ꕥ .guess
│ ꕥ .math
│ ꕥ .trivia
│ ꕥ .rps
╰━━━━━━━━━━━━━━
╭─🤖 「 AI 」
│
│ ꕥ .chatgpt
│ ꕥ .gemini
╰━━━━━━━━━━━━━━
╭─🔧 「 UTILITIES 」
│
│ ꕥ .calc
│ ꕥ .roll
│ ꕥ .qr
╰━━━━━━━━━━━━━━
`;

function handleCommand(text) {
  const input = text.trim();
  if (!input.startsWith(prefix)) return "Unknown command";

  const [command, ...args] = input
    .slice(prefix.length)
    .toLowerCase()
    .split(/\s+/);

  switch (command) {
    case "menu":
      return menu;
    case "alive":
      return "✅ Chidex Bot is online!";
    case "ping":
      return "🏓 Pong!";
    case "info":
      return "🤖 Chidex WhatsApp Bot\nVersion: 1.0.0";
    case "bots":
      return "🤖 Chidex Bot is your assistant.";
    case "rules":
      return "📜 Be respectful. Do not spam.";
    case "support":
      return "💬 Contact the bot owner for support.";
    case "calc": {
      const expression = args.join("");
      if (!/^[0-9+\-*/().\s]+$/.test(expression))
        return "Example: .calc 5+5";
      try {
        const result = Function(
          `"use strict"; return (${expression})`
        )();
        return Number.isFinite(result)
          ? `🧮 Result: ${result}`
          : "Invalid calculation";
      } catch {
        return "Invalid calculation";
      }
    }
    case "roll":
      return `🎲 You rolled ${1 + Math.floor(Math.random() * 6)}`;
    default:
      return `❌ .${command} is not ready yet.`;
  }
}

// Test the commands locally
console.log(handleCommand(".alive"));
console.log(handleCommand(".ping"));
console.log(handleCommand(".menu"));

import "dotenv/config";

/**
 * Makes HTTP requests to Discord API
 * Handles authentication and error responses
 */
export async function DiscordRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;

  // Stringify payloads for JSON requests
  if (options.body) options.body = JSON.stringify(options.body);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });

  // Throw error if request failed
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  
  return res;
}

/**
 * Registers global slash commands with Discord
 * Overwrites existing commands with the same name
 */
export async function InstallGlobalCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;

  try {
    // Bulk overwrite endpoint - replaces all existing global commands
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error("Error installing commands:", err);
  }
}

/**
 * Returns a random emoji from predefined list
 * Used for adding personality to bot responses
 */
export function getRandomEmoji() {
  const emojiList = [
    "😭",
    "😄",
    "😌",
    "🤓",
    "😎",
    "😤",
    "🤖",
    "😶‍🌫️",
    "🌏",
    "📸",
    "💿",
    "👋",
    "🌊",
    "✨",
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

/**
 * Capitalizes first letter of a string
 * Used for formatting choice names in commands
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


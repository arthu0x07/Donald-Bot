import "dotenv/config";
import express from "express";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { handleApplicationCommand, handleMessageComponent } from "./handlers/interactionHandler.js";

/**
 * Main Express application for Discord bot
 * Handles all incoming interactions from Discord
 */
const app = express();

// Parse JSON bodies
app.use(express.json());

// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Store active games in memory
// Key: interaction ID, Value: game data
const activeGames = {};

/**
 * Interactions endpoint URL where Discord sends HTTP requests
 * Verifies incoming requests using discord-interactions package
 */
app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    const { type } = req.body;

    // Handle verification ping from Discord
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    // Handle slash command interactions
    if (type === InteractionType.APPLICATION_COMMAND) {
      const response = handleApplicationCommand(req.body, activeGames);
      
      if (response) {
        return res.send(response);
      }
      
      return res.status(400).json({ error: "unknown command" });
    }

    // Handle message component interactions (buttons, select menus)
    if (type === InteractionType.MESSAGE_COMPONENT) {
      await handleMessageComponent(req.body, res, activeGames);
      return;
    }

    // Unknown interaction type
    console.error("Unknown interaction type:", type);
    return res.status(400).json({ error: "unknown interaction type" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Bot listening on port ${PORT}`);
});


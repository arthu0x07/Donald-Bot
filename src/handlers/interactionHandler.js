import {
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";
import { DiscordRequest } from "../services/utils.js";
import { getShuffledOptions, getResult } from "../services/gameService.js";
import { getRandomEmoji } from "../services/utils.js";
import { handleHelloCommand } from "../commands/helloCommand.js";
import { handleChallengeCommand } from "../commands/challengeCommand.js";

/**
 * Handles message component interactions (buttons, select menus)
 */
export async function handleMessageComponent(reqBody, res, activeGames) {
  const { data, context, member, user, message, token } = reqBody;
  const componentId = data.custom_id;

  // Handle accept button click
  if (componentId.startsWith("accept_button_")) {
    const gameId = componentId.replace("accept_button_", "");
    
    // Delete the original challenge message
    const deleteEndpoint = `webhooks/${process.env.APP_ID}/${token}/messages/${message.id}`;
    
    try {
      // Send ephemeral message asking for player's choice
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags:
            InteractionResponseFlags.EPHEMERAL |
            InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: "Qual é o seu objeto de escolha?",
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: `select_choice_${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        },
      });
      
      // Delete previous challenge message
      await DiscordRequest(deleteEndpoint, { method: "DELETE" });
    } catch (err) {
      console.error("Error handling accept button:", err);
    }
  } 
  // Handle select menu choice
  else if (componentId.startsWith("select_choice_")) {
    const gameId = componentId.replace("select_choice_", "");

    if (activeGames[gameId]) {
      // Get user ID and object choice for responding user
      const userId = context === 0 ? member.user.id : user.id;
      const objectName = data.values[0];
      
      // Calculate game result
      const resultStr = getResult(activeGames[gameId], {
        id: userId,
        objectName,
      });

      // Remove game from storage
      delete activeGames[gameId];
      
      // Update the ephemeral message
      const updateEndpoint = `webhooks/${process.env.APP_ID}/${token}/messages/${message.id}`;

      try {
        // Send results to channel
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: resultStr,
              },
            ],
          },
        });
        
        // Update ephemeral message to show confirmation
        await DiscordRequest(updateEndpoint, {
          method: "PATCH",
          body: {
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: "Boa escolha " + getRandomEmoji(),
              },
            ],
          },
        });
      } catch (err) {
        console.error("Error handling select choice:", err);
      }
    }
  }
}

/**
 * Handles slash command interactions
 */
export function handleApplicationCommand(reqBody, activeGames) {
  const { data } = reqBody;
  const { name } = data;

  // Route to appropriate command handler
  switch (name) {
    case "hello":
      return handleHelloCommand();
    
    case "challenge":
      return handleChallengeCommand(reqBody, activeGames);
    
    default:
      console.error(`Unknown command: ${name}`);
      return null;
  }
}


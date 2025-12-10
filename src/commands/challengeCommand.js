import {
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";

/**
 * Handles the /challenge command
 * Creates a new RPS game challenge
 */
export function handleChallengeCommand(reqBody, activeGames) {
  const { id, data, context, member, user } = reqBody;
  
  // User ID is in user field for (G)DMs, and member for servers
  // context === 0 means the command is received from a server
  const userId = context === 0 ? member.user.id : user.id;
  
  // User's object choice from command options
  const objectName = data.options[0].value;

  // Create active game using interaction ID as the game ID
  activeGames[id] = {
    id: userId,
    objectName,
  };

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Desafio de pedra papel tesoura de <@${userId}>`,
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              // Append the game ID to use later when button is clicked
              custom_id: `accept_button_${id}`,
              label: "Aceitar",
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}


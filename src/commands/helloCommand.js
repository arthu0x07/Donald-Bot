import {
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";
import { getRandomEmoji } from "../services/utils.js";

/**
 * Handles the /hello command
 * Responds with a customer service greeting message
 */
export function handleHelloCommand() {
  const greetings = [
    "Olá! Bem-vindo ao McDonald's! Como posso ajudá-lo hoje?",
    "Oi! Estou aqui para atendê-lo. O que você gostaria?",
    "Olá! Em que posso ajudá-lo hoje?",
    "Bem-vindo! Como posso ser útil?",
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `${randomGreeting} ${getRandomEmoji()}`,
        },
      ],
    },
  };
}


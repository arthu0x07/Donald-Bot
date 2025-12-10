import { getRPSChoices } from '../services/gameService.js';
import { capitalize } from '../services/utils.js';

/**
 * Creates command choices for challenge command
 * Formats RPS choices for Discord command options
 */
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

/**
 * Hello command - basic greeting command
 * Changed from 'test' to 'hello' for better UX
 */
export const HELLO_COMMAND = {
  name: 'hello',
  description: 'Cumprimenta o bot',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

/**
 * Challenge command - starts a rock paper scissors game
 * Requires user to pick an object as option
 */
export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Desafie alguém para uma partida de pedra papel tesoura',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Escolha seu objeto',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

/**
 * All commands to be registered with Discord
 */
export const ALL_COMMANDS = [HELLO_COMMAND, CHALLENGE_COMMAND];


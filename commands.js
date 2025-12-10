import 'dotenv/config';
import { InstallGlobalCommands } from './src/services/utils.js';
import { ALL_COMMANDS } from './src/config/commands.js';

/**
 * Registers all slash commands with Discord
 * Run this script when you add or modify commands
 */
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

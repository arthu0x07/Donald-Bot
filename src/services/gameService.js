import { capitalize } from './utils.js';

/**
 * Game result calculation logic
 * Determines winner based on RPS rules
 */
export function getResult(p1, p2) {
  let gameResult;
  
  if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
    // Player 1 wins
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.objectName][p2.objectName],
    };
  } else if (
    RPSChoices[p2.objectName] &&
    RPSChoices[p2.objectName][p1.objectName]
  ) {
    // Player 2 wins
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.objectName][p1.objectName],
    };
  } else {
    // Tie - both players chose the same
    gameResult = { win: p1, lose: p2, verb: 'empate' };
  }

  return formatResult(gameResult);
}

/**
 * Formats the game result message in Portuguese
 */
function formatResult(result) {
  const { win, lose, verb } = result;
  
  if (verb === 'empate') {
    return `<@${win.id}> e <@${lose.id}> empataram com **${win.objectName}**`;
  }
  
  return `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
}

/**
 * Rock Paper Scissors game choices and their win conditions
 * Each choice has descriptions and verbs for winning against other choices
 */
const RPSChoices = {
  rock: {
    description: 'sedimentar, ígnea ou talvez até metamórfica',
    virus: 'aguarda',
    computer: 'esmaga',
    scissors: 'esmaga',
  },
  cowboy: {
    description: 'yeehaw~',
    scissors: 'guarda',
    wumpus: 'laça',
    rock: 'chuta com bota de aço',
  },
  scissors: {
    description: 'cuidado! pontas afiadas!!',
    paper: 'corta',
    computer: 'corta o cabo de',
    virus: 'corta o DNA de',
  },
  virus: {
    description: 'mutação genética, malware ou algo entre os dois',
    cowboy: 'infecta',
    computer: 'corrompe',
    wumpus: 'infecta',
  },
  computer: {
    description: 'beep boop beep bzzrrhggggg',
    cowboy: 'sobrecarrega',
    paper: 'desinstala firmware de',
    wumpus: 'deleta assets de',
  },
  wumpus: {
    description: 'o cara roxo do Discord',
    paper: 'desenha uma figura em',
    rock: 'pinta um rosto fofo em',
    scissors: 'admira seu próprio reflexo em',
  },
  paper: {
    description: 'versátil e icônico',
    virus: 'ignora',
    cowboy: 'dá um corte de papel em',
    rock: 'cobre',
  },
};

/**
 * Returns all available RPS choices
 */
export function getRPSChoices() {
  return Object.keys(RPSChoices);
}

/**
 * Returns shuffled options formatted for Discord select menus
 * Used when player needs to choose their object
 */
export function getShuffledOptions() {
  const allChoices = getRPSChoices();
  const options = [];

  for (let c of allChoices) {
    options.push({
      label: capitalize(c),
      value: c.toLowerCase(),
      description: RPSChoices[c]['description'],
    });
  }

  return options.sort(() => Math.random() - 0.5);
}


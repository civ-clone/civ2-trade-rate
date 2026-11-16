import Anarchy from '@civ-clone/base-government-anarchy/Anarchy';
import Communism from '@civ-clone/base-government-communism/Communism';
import Democracy from '@civ-clone/base-government-democracy/Democracy';
import Despotism from '@civ-clone/base-government-despotism/Despotism';
import Fundamentalism from '@civ-clone/base-government-fundamentalism/Fundamentalism';
import Government from '@civ-clone/core-government/Government';
import Monarchy from '@civ-clone/base-government-monarchy/Monarchy';
import Republic from '@civ-clone/base-government-republic/Republic';

/**
 * The most a person may put into each rate, in tenths, by government (OpenCiv2 `src/auto/civ.cpp` `civ_max_tax_rate`,
 *  richardpenman/civ2@e39fe7b): 6 below Monarchy, 7 for Monarchy, 8 up to the Republic and 10 for Democracy.
 */
export const personMaxRate: [typeof Government, number][] = [
  [Anarchy, 6],
  [Despotism, 6],
  [Monarchy, 7],
  [Communism, 8],
  [Fundamentalism, 8],
  [Republic, 8],
  [Democracy, 10],
];

/**
 * The most a computer player puts into research, in tenths, by government (`civ_process_cities_turn`, `civ.cpp`): 6 for
 *  Anarchy and Despotism, 7 for Monarchy, Communism and Fundamentalism, 8 for the Republic and 10 for Democracy. Its tax
 *  is what research and luxuries leave, with no limit.
 */
export const computerMaxResearch: [typeof Government, number][] = [
  [Anarchy, 6],
  [Despotism, 6],
  [Monarchy, 7],
  [Communism, 7],
  [Fundamentalism, 7],
  [Republic, 8],
  [Democracy, 10],
];

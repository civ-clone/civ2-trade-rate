import Government from '@civ-clone/core-government/Government';
/**
 * The most a person may put into each rate, in tenths, by government (OpenCiv2 `src/auto/civ.cpp` `civ_max_tax_rate`,
 *  richardpenman/civ2@e39fe7b): 6 below Monarchy, 7 for Monarchy, 8 up to the Republic and 10 for Democracy.
 */
export declare const personMaxRate: [typeof Government, number][];
/**
 * The most a computer player puts into research, in tenths, by government (`civ_process_cities_turn`, `civ.cpp`): 6 for
 *  Anarchy and Despotism, 7 for Monarchy, Communism and Fundamentalism, 8 for the Republic and 10 for Democracy. Its tax
 *  is what research and luxuries leave, with no limit.
 */
export declare const computerMaxResearch: [typeof Government, number][];

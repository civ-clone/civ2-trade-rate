"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computerMaxResearch = exports.personMaxRate = void 0;
const Anarchy_1 = require("@civ-clone/base-government-anarchy/Anarchy");
const Communism_1 = require("@civ-clone/base-government-communism/Communism");
const Democracy_1 = require("@civ-clone/base-government-democracy/Democracy");
const Despotism_1 = require("@civ-clone/base-government-despotism/Despotism");
const Fundamentalism_1 = require("@civ-clone/base-government-fundamentalism/Fundamentalism");
const Monarchy_1 = require("@civ-clone/base-government-monarchy/Monarchy");
const Republic_1 = require("@civ-clone/base-government-republic/Republic");
/**
 * The most a person may put into each rate, in tenths, by government (OpenCiv2 `src/auto/civ.cpp` `civ_max_tax_rate`,
 *  richardpenman/civ2@e39fe7b): 6 below Monarchy, 7 for Monarchy, 8 up to the Republic and 10 for Democracy.
 */
exports.personMaxRate = [
    [Anarchy_1.default, 6],
    [Despotism_1.default, 6],
    [Monarchy_1.default, 7],
    [Communism_1.default, 8],
    [Fundamentalism_1.default, 8],
    [Republic_1.default, 8],
    [Democracy_1.default, 10],
];
/**
 * The most a computer player puts into research, in tenths, by government (`civ_process_cities_turn`, `civ.cpp`): 6 for
 *  Anarchy and Despotism, 7 for Monarchy, Communism and Fundamentalism, 8 for the Republic and 10 for Democracy. Its tax
 *  is what research and luxuries leave, with no limit.
 */
exports.computerMaxResearch = [
    [Anarchy_1.default, 6],
    [Despotism_1.default, 6],
    [Monarchy_1.default, 7],
    [Communism_1.default, 7],
    [Fundamentalism_1.default, 7],
    [Republic_1.default, 8],
    [Democracy_1.default, 10],
];
//# sourceMappingURL=maxRates.js.map
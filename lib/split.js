"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.civ2Split = void 0;
/**
 * How Civilization II splits a city's trade (OpenCiv2 `src/auto/city.cpp` `city_split_trade`, :9682), with the rates
 * in tenths: luxuries get `(trade × rate + 4) / 10`, science the same capped by what luxuries leave, and tax the rest,
 * which takes the rounding. In percent, kept to whole numbers: `(trade × percent + 40) / 100`, truncated.
 *
 * The rates must be available in that order: luxuries, research, tax (`registerAvailableTradeRates`).
 */
exports.civ2Split = {
    share: (total, percent) => Math.floor((total * percent + 40) / 100),
    lastTakesRemainder: true,
};
exports.default = exports.civ2Split;
//# sourceMappingURL=split.js.map
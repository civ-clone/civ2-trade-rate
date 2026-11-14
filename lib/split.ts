import { SplitTradeOptions } from '@civ-clone/base-trade-rate/lib/splitTrade';

/**
 * How Civilization II splits a city's trade (OpenCiv2 `src/auto/city.cpp` `city_split_trade`, :9682), with the rates
 * in tenths: luxuries get `(trade × rate + 4) / 10`, science the same capped by what luxuries leave, and tax the rest,
 * which takes the rounding. In percent, kept to whole numbers: `(trade × percent + 40) / 100`, truncated.
 *
 * The rates must be available in that order: luxuries, research, tax (`registerAvailableTradeRates`).
 */
export const civ2Split: SplitTradeOptions = {
  share: (total: number, percent: number): number =>
    Math.floor((total * percent + 40) / 100),
  lastTakesRemainder: true,
};

export default civ2Split;

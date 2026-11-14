import {
  AvailableTradeRateRegistry,
  instance as availableTradeRateRegistryInstance,
} from '@civ-clone/core-trade-rate/AvailableTradeRateRegistry';
import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { Trade } from '../../Yields';
import { Yield as YieldRule } from '@civ-clone/core-city/Rules/Yield';
import civ2Split from '../../lib/split';
import splitTrade from '@civ-clone/base-trade-rate/lib/splitTrade';

export const getRules: (
  availableTradeRateRegistry?: AvailableTradeRateRegistry,
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry
) => YieldRule[] = (
  availableTradeRateRegistry: AvailableTradeRateRegistry = availableTradeRateRegistryInstance,
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance
): YieldRule[] => [
  // Luxuries and research each round to the nearest tenth of the trade, a half rounding down, and tax takes the rest
  //  (`lib/split`). Specialists, buildings and Fundamentalism come later in Civ2's split, in the city packages.
  new YieldRule(
    'civ2-trade-rate:city/yield/split',
    new Effect(
      splitTrade(
        Trade,
        Math.floor,
        availableTradeRateRegistry,
        playerTradeRatesRegistry,
        civ2Split
      )
    )
  ),
];

export default getRules;

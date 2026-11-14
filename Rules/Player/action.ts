import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRateRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Action from '@civ-clone/core-player/Rules/Action';
import Effect from '@civ-clone/core-rule/Effect';
import adjustTradeRates from '@civ-clone/base-trade-rate/lib/adjustTradeRates';

export const getRules: (
  playerTradeRateRegistry?: PlayerTradeRatesRegistry
) => Action[] = (
  playerTradeRateRegistry: PlayerTradeRatesRegistry = playerTradeRateRegistryInstance
): Action[] => [
  new Action(
    'civ2-trade-rate:player/action/adjust-trade-rates',
    new Effect(adjustTradeRates(playerTradeRateRegistry))
  ),
];

export default getRules;

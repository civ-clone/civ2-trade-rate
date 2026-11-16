import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Changed from '@civ-clone/core-government/Rules/Changed';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';

export const getRules: (
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry
) => Changed[] = (
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance
): Changed[] => [
  // A new government brings its own maximum rates (`Rules/Player/max-rate`), so rates over them are brought down at
  //  once: the original clamps a person's rates as the rates dialog opens after the change (`civ_set_government`) and a
  //  computer player's each turn. Ahead of the other `Changed` rules, so what they report already has the new rates.
  //  A player whose rates aren't there yet (its government is set as it's added, before its rates) is left alone.
  new Changed(
    'civ2-trade-rate:player/government-changed/max-rates',
    new High(),
    new Criterion(
      (player: Player): boolean =>
        playerTradeRatesRegistry.getBy('player', player).length === 1
    ),
    new Effect((player: Player): void => {
      playerTradeRatesRegistry.getByPlayer(player).enforceMaxRates();
    })
  ),
];

export default getRules;

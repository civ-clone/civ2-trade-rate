import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Anarchy from '@civ-clone/base-government-anarchy/Anarchy';
import Changed from '@civ-clone/core-government/Rules/Changed';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Government from '@civ-clone/core-government/Government';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

export const getRules: (
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry,
  clientRegistry?: ClientRegistry
) => Changed[] = (
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Changed[] => [
  // A new government brings its own maximum rates (`Rules/Player/max-rate`), so rates over them are brought down at
  //  once: the original clamps a person's rates as the rates dialog opens after a change to any government but Anarchy
  //  (`civ_set_government`, `0 < new_gov`, richardpenman/civ2@e39fe7b `civ.cpp:6882-6885`), and a computer player's
  //  each turn, so at any change here. Ahead of the other `Changed` rules, so what they report already has the new
  //  rates. A player whose rates aren't there yet (its government is set as it's added, before its rates) is left
  //  alone.
  new Changed(
    'civ2-trade-rate:player/government-changed/max-rates',
    new High(),
    new Criterion(
      (player: Player): boolean =>
        playerTradeRatesRegistry.getBy('player', player).length === 1
    ),
    new Criterion(
      (player: Player, government: Government): boolean =>
        !(government instanceof Anarchy) || !isHuman(player, clientRegistry)
    ),
    new Effect((player: Player): void => {
      playerTradeRatesRegistry.getByPlayer(player).enforceMaxRates();
    })
  ),
];

export default getRules;

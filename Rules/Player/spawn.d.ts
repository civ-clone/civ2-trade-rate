import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { PlayerTradeRatesRegistry } from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import Player from '@civ-clone/core-player/Player';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
export declare const civilizeOf: (
  player: Player,
  traitRegistry: TraitRegistry
) => number;
export declare const getRules: (
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry,
  clientRegistry?: ClientRegistry,
  traitRegistry?: TraitRegistry
) => Spawn[];
export default getRules;

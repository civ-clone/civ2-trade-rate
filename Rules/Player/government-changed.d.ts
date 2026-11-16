import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { PlayerTradeRatesRegistry } from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Changed from '@civ-clone/core-government/Rules/Changed';
export declare const getRules: (
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry,
  clientRegistry?: ClientRegistry
) => Changed[];
export default getRules;

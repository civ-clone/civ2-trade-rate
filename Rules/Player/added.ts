import {
  AvailableTradeRateRegistry,
  instance as availableTradeRateRegistryInstance,
} from '@civ-clone/core-trade-rate/AvailableTradeRateRegistry';
import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import { Luxuries, Research, Tax } from '../../TradeRates';
import Added from '@civ-clone/core-player/Rules/Added';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import addPlayerTradeRates from '@civ-clone/base-trade-rate/lib/playerTradeRates';

export const getRules: (
  availableTradeRateRegistry?: AvailableTradeRateRegistry,
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry
) => Added[] = (
  availableTradeRateRegistry: AvailableTradeRateRegistry = availableTradeRateRegistryInstance,
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance
): Added[] => [
  // A new civilization starts at 40% tax, 40% research and 20% luxuries (OpenCiv2 `src/auto/civ.cpp:4625`), until its
  //  leader is known: the rates are set again as it's given its units (`Rules/Player/spawn`).
  new Added(
    'civ2-trade-rate:player/added/rates',
    new Effect((player: Player): void =>
      addPlayerTradeRates(
        player,
        [new Tax(40), new Research(40), new Luxuries(20)],
        availableTradeRateRegistry,
        playerTradeRatesRegistry
      )
    )
  ),
];

export default getRules;

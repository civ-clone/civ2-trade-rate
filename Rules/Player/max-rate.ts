import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import { Luxuries, Research, Tax } from '../../TradeRates';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { computerMaxResearch, personMaxRate } from '../../data/maxRates';
import Effect from '@civ-clone/core-rule/Effect';
import ExcessRate from '@civ-clone/core-trade-rate/Rules/ExcessRate';
import Government from '@civ-clone/core-government/Government';
import MaxRate from '@civ-clone/core-trade-rate/Rules/MaxRate';
import Player from '@civ-clone/core-player/Player';
import TradeRate from '@civ-clone/core-trade-rate/TradeRate';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

/** `player`'s entry in `table`, in tenths, or `undefined` for a player with no government yet (as one being added). */
const tenthsFor = (
  player: Player,
  table: [typeof Government, number][],
  playerGovernmentRegistry: PlayerGovernmentRegistry
): number | undefined => {
  const [playerGovernment] = playerGovernmentRegistry.getBy('player', player);

  if (!playerGovernment) {
    return undefined;
  }

  const [entry] = table.filter(([GovernmentType]) =>
    playerGovernment.is(GovernmentType)
  );

  return entry === undefined ? undefined : entry[1];
};

export const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  clientRegistry?: ClientRegistry
) => (MaxRate | ExcessRate)[] = (
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): (MaxRate | ExcessRate)[] => [
  // Persons and computer players are limited differently, as in the original (OpenCiv2 richardpenman/civ2@e39fe7b):
  //  - a person, every rate, to `civ_max_tax_rate` (`src/auto/civ.cpp`): 60% under Anarchy and Despotism, 70% under
  //    Monarchy, 80% under Communism, Fundamentalism and the Republic, and 100% under Democracy;
  //  - a computer player, only research, to 60%, 70% (Monarchy, Communism and Fundamentalism), 80% (the Republic) or
  //    100% (Democracy) (`civ_process_cities_turn`); its tax takes the rest.
  new MaxRate(
    'civ2-trade-rate:player/max-rate',
    new Effect((player: Player, rate: TradeRate): number | undefined => {
      if (isHuman(player, clientRegistry)) {
        const tenths = tenthsFor(
          player,
          personMaxRate,
          playerGovernmentRegistry
        );

        return tenths === undefined ? undefined : tenths / 10;
      }

      if (!(rate instanceof Research)) {
        return undefined;
      }

      const tenths = tenthsFor(
        player,
        computerMaxResearch,
        playerGovernmentRegistry
      );

      return tenths === undefined ? undefined : tenths / 10;
    })
  ),

  // Where a rate's excess goes. A person's rates dialog clamps them in this order as it opens (`city_advisors.cpp`):
  //  tax over goes to research while it has room, then luxuries; research over to tax, then luxuries; luxuries over to
  //  tax, then research. A computer player's research over goes to tax.
  new ExcessRate(
    'civ2-trade-rate:player/excess-rate',
    new Effect(
      (player: Player, rate: TradeRate): (typeof TradeRate)[] | undefined => {
        if (!isHuman(player, clientRegistry)) {
          return rate instanceof Research ? [Tax] : undefined;
        }

        if (rate instanceof Tax) {
          return [Research, Luxuries];
        }

        if (rate instanceof Research) {
          return [Tax, Luxuries];
        }

        if (rate instanceof Luxuries) {
          return [Tax, Research];
        }

        return undefined;
      }
    )
  ),
];

export default getRules;

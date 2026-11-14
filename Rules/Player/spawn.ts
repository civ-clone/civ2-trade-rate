import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import { Luxuries, Research, Tax } from '../../TradeRates';
import Civilized from '@civ-clone/base-leader-trait-militarism/Militarism/Civilized';
import Effect from '@civ-clone/core-rule/Effect';
import Militaristic from '@civ-clone/base-leader-trait-militarism/Militarism/Militaristic';
import Player from '@civ-clone/core-player/Player';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Trait from '@civ-clone/core-civilization/Trait';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';
import leaderTraits from '@civ-clone/base-leader-personality/lib/leaderTraits';

// A leader's "civilize" score: 1 for a Civilized leader, -1 for a Militaristic one and 0 for the rest (RULES.TXT
//  @LEADERS, the attitude columns, as civ2-civilization declares them).
export const civilizeOf = (
  player: Player,
  traitRegistry: TraitRegistry
): number => {
  const traits = leaderTraits(traitRegistry, player);

  return traits.some((trait: Trait): boolean => trait instanceof Civilized)
    ? 1
    : traits.some((trait: Trait): boolean => trait instanceof Militaristic)
    ? -1
    : 0;
};

export const getRules = (
  playerTradeRatesRegistry: PlayerTradeRatesRegistry = playerTradeRatesRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  traitRegistry: TraitRegistry = traitRegistryInstance
): Spawn[] => [
  // Once the civilization has its leader and its units, the rates it starts with. A computer player's research is its
  //  leader's civilize score + 3 tenths, its tax 9 tenths less that, leaving 10% luxuries (OpenCiv2
  //  `src/auto/civ.cpp:4762-4763`): 40/50/10 for a Civilized leader, 30/60/10 for most, 20/70/10 for a Militaristic
  //  one. A person starts at 60% research and 40% tax, the game's preferences (`src/auto/game.cpp:6748-6763`).
  new Spawn(
    'civ2-trade-rate:player/spawn/rates',
    new Effect((player: Player): void => {
      const rates = playerTradeRatesRegistry.getByPlayer(player);

      if (isHuman(player, clientRegistry)) {
        rates.setAll([
          [Luxuries, 0],
          [Research, 60],
          [Tax, 40],
        ]);

        return;
      }

      const research = civilizeOf(player, traitRegistry) + 3;

      rates.setAll([
        [Luxuries, 10],
        [Research, research * 10],
        [Tax, (9 - research) * 10],
      ]);
    })
  ),
];

export default getRules;

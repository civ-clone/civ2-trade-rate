import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import ExcessRate from '@civ-clone/core-trade-rate/Rules/ExcessRate';
import MaxRate from '@civ-clone/core-trade-rate/Rules/MaxRate';
export declare const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  clientRegistry?: ClientRegistry
) => (MaxRate | ExcessRate)[];
export default getRules;

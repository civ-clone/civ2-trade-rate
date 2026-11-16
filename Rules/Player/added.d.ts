import { AvailableTradeRateRegistry } from '@civ-clone/core-trade-rate/AvailableTradeRateRegistry';
import { PlayerTradeRatesRegistry } from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
export declare const getRules: (
  availableTradeRateRegistry?: AvailableTradeRateRegistry,
  playerTradeRatesRegistry?: PlayerTradeRatesRegistry,
  ruleRegistry?: RuleRegistry
) => Added[];
export default getRules;

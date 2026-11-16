import cityYield from './Rules/City/yield';
import governmentChanged from './Rules/Player/government-changed';
import maxRate from './Rules/Player/max-rate';
import playerAction from './Rules/Player/action';
import playerAdded from './Rules/Player/added';
import playerSpawn from './Rules/Player/spawn';
import playerTurnStart from './Rules/Player/turn-start';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityYield(game.availableTradeRates, game.playerTradeRates),
    ...playerAction(game.playerTradeRates),
    ...playerAdded(game.availableTradeRates, game.playerTradeRates, game.rules),
    ...playerSpawn(game.playerTradeRates, game.clients, game.traits),
    ...playerTurnStart(game.rules, game.cities, game.availableTradeRates),
    ...maxRate(game.playerGovernments, game.clients),
    ...governmentChanged(game.playerTradeRates)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;

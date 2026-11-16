"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const yield_1 = require("./Rules/City/yield");
const government_changed_1 = require("./Rules/Player/government-changed");
const max_rate_1 = require("./Rules/Player/max-rate");
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const spawn_1 = require("./Rules/Player/spawn");
const turn_start_1 = require("./Rules/Player/turn-start");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => game.rules.register(...(0, yield_1.default)(game.availableTradeRates, game.playerTradeRates), ...(0, action_1.default)(game.playerTradeRates), ...(0, added_1.default)(game.availableTradeRates, game.playerTradeRates, game.rules), ...(0, spawn_1.default)(game.playerTradeRates, game.clients, game.traits), ...(0, turn_start_1.default)(game.rules, game.cities, game.availableTradeRates), ...(0, max_rate_1.default)(game.playerGovernments, game.clients), ...(0, government_changed_1.default)(game.playerTradeRates));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map
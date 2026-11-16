"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const AvailableTradeRateRegistry_1 = require("@civ-clone/core-trade-rate/AvailableTradeRateRegistry");
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const TradeRates_1 = require("../../TradeRates");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const playerTradeRates_1 = require("@civ-clone/base-trade-rate/lib/playerTradeRates");
const getRules = (availableTradeRateRegistry = AvailableTradeRateRegistry_1.instance, playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    // A new civilization starts at 40% tax, 40% research and 20% luxuries (OpenCiv2 `src/auto/civ.cpp`
    //  `civ_create_reset_civ`, richardpenman/civ2@49f26ec), until its
    //  leader is known: the rates are set again as it's given its units (`Rules/Player/spawn`). The rates ask the game's
    //  own rules for their maximums (`Rules/Player/max-rate`).
    new Added_1.default('civ2-trade-rate:player/added/rates', new Effect_1.default((player) => (0, playerTradeRates_1.default)(player, [new TradeRates_1.Tax(40), new TradeRates_1.Research(40), new TradeRates_1.Luxuries(20)], availableTradeRateRegistry, playerTradeRatesRegistry, ruleRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const Changed_1 = require("@civ-clone/core-government/Rules/Changed");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const getRules = (playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance) => [
    // A new government brings its own maximum rates (`Rules/Player/max-rate`), so rates over them are brought down at
    //  once: the original clamps a person's rates as the rates dialog opens after the change (`civ_set_government`) and a
    //  computer player's each turn. Ahead of the other `Changed` rules, so what they report already has the new rates.
    //  A player whose rates aren't there yet (its government is set as it's added, before its rates) is left alone.
    new Changed_1.default('civ2-trade-rate:player/government-changed/max-rates', new High_1.default(), new Criterion_1.default((player) => playerTradeRatesRegistry.getBy('player', player).length === 1), new Effect_1.default((player) => {
        playerTradeRatesRegistry.getByPlayer(player).enforceMaxRates();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=government-changed.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const Anarchy_1 = require("@civ-clone/base-government-anarchy/Anarchy");
const Changed_1 = require("@civ-clone/core-government/Rules/Changed");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
const getRules = (playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    // A new government brings its own maximum rates (`Rules/Player/max-rate`), so rates over them are brought down at
    //  once: the original clamps a person's rates as the rates dialog opens after a change to any government but Anarchy
    //  (`civ_set_government`, `0 < new_gov`, richardpenman/civ2@e39fe7b `civ.cpp:6882-6885`), and a computer player's
    //  each turn, so at any change here. Ahead of the other `Changed` rules, so what they report already has the new
    //  rates. A player whose rates aren't there yet (its government is set as it's added, before its rates) is left
    //  alone.
    new Changed_1.default('civ2-trade-rate:player/government-changed/max-rates', new High_1.default(), new Criterion_1.default((player) => playerTradeRatesRegistry.getBy('player', player).length === 1), new Criterion_1.default((player, government) => !(government instanceof Anarchy_1.default) || !(0, isHuman_1.default)(player, clientRegistry)), new Effect_1.default((player) => {
        playerTradeRatesRegistry.getByPlayer(player).enforceMaxRates();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=government-changed.js.map
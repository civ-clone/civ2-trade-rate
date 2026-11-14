"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const AvailableTradeRateRegistry_1 = require("@civ-clone/core-trade-rate/AvailableTradeRateRegistry");
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const split_1 = require("../../lib/split");
const splitTrade_1 = require("@civ-clone/base-trade-rate/lib/splitTrade");
const getRules = (availableTradeRateRegistry = AvailableTradeRateRegistry_1.instance, playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance) => [
    // Luxuries and research each round to the nearest tenth of the trade, a half rounding down, and tax takes the rest
    //  (`lib/split`). Specialists, buildings and Fundamentalism come later in Civ2's split, in the city packages.
    new Yield_1.Yield('civ2-trade-rate:city/yield/split', new Effect_1.default((0, splitTrade_1.default)(Yields_1.Trade, Math.floor, availableTradeRateRegistry, playerTradeRatesRegistry, split_1.default))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map
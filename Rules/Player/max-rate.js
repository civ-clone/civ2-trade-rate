"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const TradeRates_1 = require("../../TradeRates");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const maxRates_1 = require("../../data/maxRates");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const ExcessRate_1 = require("@civ-clone/core-trade-rate/Rules/ExcessRate");
const MaxRate_1 = require("@civ-clone/core-trade-rate/Rules/MaxRate");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
/** `player`'s entry in `table`, in tenths, or `undefined` for a player with no government yet (as one being added). */
const tenthsFor = (player, table, playerGovernmentRegistry) => {
    const [playerGovernment] = playerGovernmentRegistry.getBy('player', player);
    if (!playerGovernment) {
        return undefined;
    }
    const [entry] = table.filter(([GovernmentType]) => playerGovernment.is(GovernmentType));
    return entry === undefined ? undefined : entry[1];
};
const getRules = (playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    // Persons and computer players are limited differently, as in the original (OpenCiv2 richardpenman/civ2@e39fe7b):
    //  - a person, every rate, to `civ_max_tax_rate` (`src/auto/civ.cpp`): 60% under Anarchy and Despotism, 70% under
    //    Monarchy, 80% under Communism, Fundamentalism and the Republic, and 100% under Democracy;
    //  - a computer player, only research, to 60%, 70% (Monarchy, Communism and Fundamentalism), 80% (the Republic) or
    //    100% (Democracy) (`civ_process_cities_turn`); its tax takes the rest.
    new MaxRate_1.default('civ2-trade-rate:player/max-rate', new Effect_1.default((player, rate) => {
        if ((0, isHuman_1.default)(player, clientRegistry)) {
            const tenths = tenthsFor(player, maxRates_1.personMaxRate, playerGovernmentRegistry);
            return tenths === undefined ? undefined : tenths / 10;
        }
        if (!(rate instanceof TradeRates_1.Research)) {
            return undefined;
        }
        const tenths = tenthsFor(player, maxRates_1.computerMaxResearch, playerGovernmentRegistry);
        return tenths === undefined ? undefined : tenths / 10;
    })),
    // Where a rate's excess goes. A person's rates dialog clamps them in this order as it opens (`city_advisors.cpp`):
    //  tax over goes to research while it has room, then luxuries; research over to tax, then luxuries; luxuries over to
    //  tax, then research. A computer player's research over goes to tax.
    new ExcessRate_1.default('civ2-trade-rate:player/excess-rate', new Effect_1.default((player, rate) => {
        if (!(0, isHuman_1.default)(player, clientRegistry)) {
            return rate instanceof TradeRates_1.Research ? [TradeRates_1.Tax] : undefined;
        }
        if (rate instanceof TradeRates_1.Tax) {
            return [TradeRates_1.Research, TradeRates_1.Luxuries];
        }
        if (rate instanceof TradeRates_1.Research) {
            return [TradeRates_1.Tax, TradeRates_1.Luxuries];
        }
        if (rate instanceof TradeRates_1.Luxuries) {
            return [TradeRates_1.Tax, TradeRates_1.Research];
        }
        return undefined;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=max-rate.js.map
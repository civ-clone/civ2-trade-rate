"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.civilizeOf = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const PlayerTradeRatesRegistry_1 = require("@civ-clone/core-trade-rate/PlayerTradeRatesRegistry");
const TraitRegistry_1 = require("@civ-clone/core-civilization/TraitRegistry");
const TradeRates_1 = require("../../TradeRates");
const Civilized_1 = require("@civ-clone/base-leader-trait-militarism/Militarism/Civilized");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Militaristic_1 = require("@civ-clone/base-leader-trait-militarism/Militarism/Militaristic");
const Spawn_1 = require("@civ-clone/core-player/Rules/Spawn");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
const leaderTraits_1 = require("@civ-clone/base-leader-personality/lib/leaderTraits");
// A leader's "civilize" score: 1 for a Civilized leader, -1 for a Militaristic one and 0 for the rest (RULES.TXT
//  @LEADERS, the attitude columns, as civ2-civilization declares them).
const civilizeOf = (player, traitRegistry) => {
    const traits = (0, leaderTraits_1.default)(traitRegistry, player);
    return traits.some((trait) => trait instanceof Civilized_1.default)
        ? 1
        : traits.some((trait) => trait instanceof Militaristic_1.default)
            ? -1
            : 0;
};
exports.civilizeOf = civilizeOf;
const getRules = (playerTradeRatesRegistry = PlayerTradeRatesRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, traitRegistry = TraitRegistry_1.instance) => [
    // Once the civilization has its leader and its units, the rates it starts with. A computer player's research is its
    //  leader's civilize score + 3 tenths, its tax 9 tenths less that, leaving 10% luxuries (OpenCiv2
    //  `src/auto/civ.cpp` `civ_create`, richardpenman/civ2@49f26ec): 40/50/10 for a Civilized leader, 30/60/10 for most, 20/70/10 for a Militaristic
    //  one. A person starts at 60% research and 40% tax, the default of the game's saved preferences
    //  (`src/auto/game.cpp` `game_init_new`).
    new Spawn_1.default('civ2-trade-rate:player/spawn/rates', new Effect_1.default((player) => {
        const rates = playerTradeRatesRegistry.getByPlayer(player);
        if ((0, isHuman_1.default)(player, clientRegistry)) {
            rates.setAll([
                [TradeRates_1.Luxuries, 0],
                [TradeRates_1.Research, 60],
                [TradeRates_1.Tax, 40],
            ]);
            return;
        }
        const research = (0, exports.civilizeOf)(player, traitRegistry) + 3;
        rates.setAll([
            [TradeRates_1.Luxuries, 10],
            [TradeRates_1.Research, research * 10],
            [TradeRates_1.Tax, (9 - research) * 10],
        ]);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spawn.js.map
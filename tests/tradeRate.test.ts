import { Corruption, Trade } from '../Yields';
import { Luxuries, Research, Tax } from '../TradeRates';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Action from '@civ-clone/core-player/Rules/Action';
import { AdjustTradeRates } from '../PlayerActions';
import AvailableTradeRateRegistry from '@civ-clone/core-trade-rate/AvailableTradeRateRegistry';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Civilized from '@civ-clone/base-leader-trait-militarism/Militarism/Civilized';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Leader from '@civ-clone/core-civilization/Leader';
import Militaristic from '@civ-clone/base-leader-trait-militarism/Militarism/Militaristic';
import Normal from '@civ-clone/base-leader-trait-militarism/Militarism/Normal';
import Player from '@civ-clone/core-player/Player';
import PlayerTradeRatesRegistry from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import TraitRegistry from '@civ-clone/core-civilization/TraitRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Yield from '@civ-clone/core-yield/Yield';
import { Yield as YieldRule } from '@civ-clone/core-city/Rules/Yield';
import action from '../Rules/Player/action';
import added from '../Rules/Player/added';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import spawn from '../Rules/Player/spawn';
import turnStart from '../Rules/Player/turn-start';

const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      availableTradeRateRegistry = new AvailableTradeRateRegistry(),
      playerTradeRatesRegistry = new PlayerTradeRatesRegistry(),
      clientRegistry = new ClientRegistry(),
      traitRegistry = new TraitRegistry();

    // As registerAvailableTradeRates registers them: Civ2 works out luxuries, then research, then tax.
    availableTradeRateRegistry.register(Luxuries, Research, Tax);

    ruleRegistry.register(
      ...added(availableTradeRateRegistry, playerTradeRatesRegistry),
      ...cityYield(availableTradeRateRegistry, playerTradeRatesRegistry),
      ...action(playerTradeRatesRegistry),
      ...spawn(playerTradeRatesRegistry, clientRegistry, traitRegistry)
    );

    return {
      availableTradeRateRegistry,
      clientRegistry,
      player: new Player(ruleRegistry),
      playerTradeRatesRegistry,
      ruleRegistry,
      traitRegistry,
    };
  },
  cityOf = (player: Player, yields: Yield[] = []): City =>
    ({
      player: (): Player => player,
      yields: (): Yield[] => yields,
    } as unknown as City),
  ratesOf = (
    playerTradeRatesRegistry: PlayerTradeRatesRegistry,
    player: Player
  ): [string, number][] =>
    playerTradeRatesRegistry
      .getByPlayer(player)
      .all()
      .map((rate): [string, number] => [rate.constructor.name, rate.value()]),
  split = (
    ruleRegistry: RuleRegistry,
    city: City,
    yields: Yield[]
  ): [string, number, string][] =>
    ruleRegistry
      .process(YieldRule, city, yields)
      .flat()
      .map((tradeYield: Yield): [string, number, string] => [
        tradeYield.constructor.name,
        tradeYield.value(),
        tradeYield.values()[0][1],
      ]);

describe('civ2-trade-rate', (): void => {
  it('gives each new player 20% luxuries, 40% research and 40% tax', (): void => {
    const { player, playerTradeRatesRegistry } = setUp();

    expect(ratesOf(playerTradeRatesRegistry, player)).to.deep.equal([
      ['Luxuries', 20],
      ['Research', 40],
      ['Tax', 40],
    ]);
  });

  it('starts a person at 60% research and 40% tax once they have their units', (): void => {
    const { clientRegistry, player, playerTradeRatesRegistry, ruleRegistry } =
      setUp();

    clientRegistry.register(new Client(player));
    ruleRegistry.process(Spawn, player, null);

    expect(ratesOf(playerTradeRatesRegistry, player)).to.deep.equal([
      ['Luxuries', 0],
      ['Research', 60],
      ['Tax', 40],
    ]);
  });

  (
    [
      [Civilized, 40, 50],
      [Normal, 30, 60],
      [Militaristic, 20, 70],
      [null, 30, 60],
    ] as const
  ).forEach(([TraitType, research, tax]) =>
    it(`starts a computer player whose leader is ${
      TraitType?.name ?? 'without traits'
    } at 10% luxuries, ${research}% research and ${tax}% tax`, (): void => {
      const {
          clientRegistry,
          player,
          playerTradeRatesRegistry,
          ruleRegistry,
          traitRegistry,
        } = setUp(),
        TheLeader = class TheLeader extends Leader {};

      if (TraitType !== null) {
        traitRegistry.register(new TraitType(TheLeader));
      }

      Object.assign(player, {
        civilization: () => ({
          leader: () => ({ sourceClass: () => TheLeader }),
        }),
      });

      clientRegistry.register(new AIClient(player));
      ruleRegistry.process(Spawn, player, null);

      expect(ratesOf(playerTradeRatesRegistry, player)).to.deep.equal([
        ['Luxuries', 10],
        ['Research', research],
        ['Tax', tax],
      ]);
    })
  );

  // [luxuries, research, tax] in percent, the trade, and what `city_split_trade` (OpenCiv2 `src/auto/city.cpp`, richardpenman/civ2@49f26ec)
  //  gives, worked out by hand from `(trade × tenths + 4) / 10` for luxuries and research, and the rest for tax.
  (
    [
      [[0, 50, 50], 1, [0, 0, 1]],
      [[30, 30, 40], 12, [4, 4, 4]],
      [[30, 30, 40], 7, [2, 2, 3]],
      [[10, 10, 80], 5, [0, 0, 5]],
      [[0, 60, 40], 15, [0, 9, 6]],
      [[10, 30, 60], 15, [1, 4, 10]],
      [[20, 40, 40], 13, [3, 5, 5]],
      [[50, 50, 0], 9, [4, 4, 1]],
      [[100, 0, 0], 25, [25, 0, 0]],
    ] as [[number, number, number], number, number[]][]
  ).forEach(([[luxuries, research, tax], trade, expected]) =>
    it(`splits ${trade} trade at ${luxuries}/${research}/${tax} into ${expected.join(
      '/'
    )}`, (): void => {
      const { player, playerTradeRatesRegistry, ruleRegistry } = setUp();

      playerTradeRatesRegistry.getByPlayer(player).setAll([
        [Luxuries, luxuries],
        [Research, research],
        [Tax, tax],
      ]);

      expect(
        split(ruleRegistry, cityOf(player), [new Trade(trade)]).map(
          ([, value]) => value
        )
      ).to.deep.equal(expected);
    })
  );

  it('splits the trade less corruption, labelling each yield with its rate', (): void => {
    const { player, ruleRegistry } = setUp();

    expect(
      split(ruleRegistry, cityOf(player), [
        new Trade(4),
        new Trade(3),
        new Corruption(2),
      ])
    ).to.deep.equal([
      ['Luxuries', 1, 'Luxuries'],
      ['Research', 2, 'Research'],
      ['Gold', 2, 'Tax'],
    ]);
  });

  it('splits no trade when the trade is negative', (): void => {
    const { player, ruleRegistry } = setUp();

    expect(
      split(ruleRegistry, cityOf(player), [new Trade(-5)]).map(
        ([, value]) => value
      )
    ).to.deep.equal([0, 0, 0]);
  });

  it('offers each player the adjustment of their own rates', (): void => {
    const { player, playerTradeRatesRegistry, ruleRegistry } = setUp(),
      [actions] = ruleRegistry.process(Action, player);

    expect(actions).to.have.length(1);
    expect(actions[0]).to.be.instanceOf(AdjustTradeRates);
    expect(actions[0].value()).to.equal(
      playerTradeRatesRegistry.getByPlayer(player)
    );
  });

  it("at the start of a player's turn, processes each city's trade-rate yields, one of each type in rate order", (): void => {
    const { availableTradeRateRegistry, player, ruleRegistry } = setUp(),
      yields = [new Tax.tradeYield(2), new Luxuries.tradeYield(1)],
      city = cityOf(player, yields),
      cityRegistry = {
        getByPlayer: (): City[] => [city],
      } as unknown as CityRegistry,
      processed: [string, number][] = [];

    ruleRegistry.register(
      ...turnStart(ruleRegistry, cityRegistry, availableTradeRateRegistry),
      new ProcessYield(
        new Effect((processedYield: Yield): void => {
          processed.push([
            processedYield.constructor.name,
            processedYield.value(),
          ]);
        })
      )
    );

    ruleRegistry.process(TurnStart, player);

    expect(processed).to.deep.equal([
      ['Luxuries', 1],
      ['Research', 0],
      ['Gold', 2],
    ]);
  });

  it('registers its rules under civ2-trade-rate ids', (): void => {
    const { ruleRegistry } = setUp();

    expect(
      ruleRegistry
        .entries()
        .map((rule) => rule.id())
        .filter((id) => id !== '')
    ).to.include.members([
      'civ2-trade-rate:player/added/rates',
      'civ2-trade-rate:city/yield/split',
      'civ2-trade-rate:player/action/adjust-trade-rates',
      'civ2-trade-rate:player/spawn/rates',
    ]);
  });
});

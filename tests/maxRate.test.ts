import { Luxuries, Research, Tax } from '../TradeRates';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Anarchy from '@civ-clone/base-government-anarchy/Anarchy';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import AvailableTradeRateRegistry from '@civ-clone/core-trade-rate/AvailableTradeRateRegistry';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Communism from '@civ-clone/base-government-communism/Communism';
import Democracy from '@civ-clone/base-government-democracy/Democracy';
import Despotism from '@civ-clone/base-government-despotism/Despotism';
import ExcessRate from '@civ-clone/core-trade-rate/Rules/ExcessRate';
import Fundamentalism from '@civ-clone/base-government-fundamentalism/Fundamentalism';
import Government from '@civ-clone/core-government/Government';
import Leader from '@civ-clone/core-civilization/Leader';
import Militaristic from '@civ-clone/base-leader-trait-militarism/Militarism/Militaristic';
import Monarchy from '@civ-clone/base-government-monarchy/Monarchy';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerTradeRatesRegistry from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import Republic from '@civ-clone/base-government-republic/Republic';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import TraitRegistry from '@civ-clone/core-civilization/TraitRegistry';
import added from '../Rules/Player/added';
import { expect } from 'chai';
import governmentChanged from '../Rules/Player/government-changed';
import maxRate from '../Rules/Player/max-rate';
import spawn from '../Rules/Player/spawn';

type Kind = 'person' | 'computer';

const setUp = (kind: Kind, GovernmentType: typeof Government | null) => {
    const ruleRegistry = new RuleRegistry(),
      availableTradeRateRegistry = new AvailableTradeRateRegistry(),
      playerTradeRatesRegistry = new PlayerTradeRatesRegistry(),
      playerGovernmentRegistry = new PlayerGovernmentRegistry(),
      clientRegistry = new ClientRegistry(),
      traitRegistry = new TraitRegistry();

    availableTradeRateRegistry.register(Luxuries, Research, Tax);

    ruleRegistry.register(
      ...added(
        availableTradeRateRegistry,
        playerTradeRatesRegistry,
        ruleRegistry
      ),
      ...spawn(playerTradeRatesRegistry, clientRegistry, traitRegistry),
      ...maxRate(playerGovernmentRegistry, clientRegistry),
      ...governmentChanged(playerTradeRatesRegistry)
    );

    const player = new Player(ruleRegistry),
      playerGovernment = new PlayerGovernment(
        player,
        new AvailableGovernmentRegistry(),
        ruleRegistry
      );

    clientRegistry.register(
      kind === 'person' ? new Client(player) : new AIClient(player)
    );

    playerGovernmentRegistry.register(playerGovernment);

    if (GovernmentType !== null) {
      playerGovernment.set(new GovernmentType());
    }

    const rates = playerTradeRatesRegistry.getByPlayer(player);

    return {
      player,
      playerGovernment,
      rates,
      ruleRegistry,
      traitRegistry,
      values: (): number[] => rates.all().map((rate) => rate.value()),
    };
  },
  // [luxuries, research, tax]
  set = (
    rates: ReturnType<typeof setUp>['rates'],
    [luxuries, research, tax]: number[]
  ): void =>
    rates.setAll([
      [Luxuries, luxuries],
      [Research, research],
      [Tax, tax],
    ]);

describe('civ2-trade-rate maximum rates', (): void => {
  (
    [
      [Anarchy, 0.6],
      [Despotism, 0.6],
      [Monarchy, 0.7],
      [Communism, 0.8],
      [Fundamentalism, 0.8],
      [Republic, 0.8],
      [Democracy, 1],
    ] as [typeof Government, number][]
  ).forEach(([GovernmentType, maximum]) =>
    it(`limits each of a person's rates to ${maximum * 100}% under ${
      GovernmentType.name
    }`, (): void => {
      const { rates } = setUp('person', GovernmentType);

      expect(rates.maxRates().map(([, max]) => max)).to.deep.equal([
        maximum,
        maximum,
        maximum,
      ]);
    })
  );

  (
    [
      [Anarchy, 0.6],
      [Despotism, 0.6],
      [Monarchy, 0.7],
      [Communism, 0.7],
      [Fundamentalism, 0.7],
      [Republic, 0.8],
      [Democracy, 1],
    ] as [typeof Government, number][]
  ).forEach(([GovernmentType, maximum]) =>
    it(`limits only a computer player's research, to ${maximum * 100}%, under ${
      GovernmentType.name
    }`, (): void => {
      const { rates } = setUp('computer', GovernmentType);

      expect(rates.maxRates().map(([, max]) => max)).to.deep.equal([
        undefined,
        maximum,
        undefined,
      ]);
    })
  );

  it('sets no limit for a player with no government yet', (): void => {
    (['person', 'computer'] as Kind[]).forEach((kind: Kind): void => {
      const { rates, values } = setUp(kind, null);

      expect(rates.maxRates().map(([, max]) => max)).to.deep.equal([
        undefined,
        undefined,
        undefined,
      ]);

      set(rates, [0, 100, 0]);

      expect(values()).to.deep.equal([0, 100, 0]);
    });
  });

  // [luxuries, research, tax] before and after, under Despotism (60%). A person's rates are all limited alike, so the
  //  first rate in the original's order always has room for the excess (at most 40 against at least 60 of room).
  (
    [
      ['tax over goes to research', [0, 30, 70], [0, 40, 60]],
      ['all tax goes to research first', [0, 0, 100], [0, 40, 60]],
      ['research over goes to tax', [0, 70, 30], [0, 60, 40]],
      ['luxuries over go to tax', [70, 30, 0], [60, 30, 10]],
      ['all luxuries go to tax first', [100, 0, 0], [60, 0, 40]],
      ['rates at the limit stay', [0, 60, 40], [0, 60, 40]],
    ] as [string, number[], number[]][]
  ).forEach(([description, before, after]) =>
    it(`moves a person's excess in the original's order: ${description}`, (): void => {
      const { rates, values } = setUp('person', Despotism);

      set(rates, before);

      expect(values()).to.deep.equal(after);
    })
  );

  it("answers the original's order for each of a person's rates, and research to tax for a computer player", (): void => {
    const person = setUp('person', Despotism),
      computer = setUp('computer', Despotism),
      orderFor = (
        { player, rates, ruleRegistry }: ReturnType<typeof setUp>,
        Type: typeof Luxuries | typeof Research | typeof Tax
      ) =>
        ruleRegistry
          .process(ExcessRate, player, rates.get(Type))
          .map((answer) => answer?.map((RateType) => RateType.name));

    expect(orderFor(person, Tax)).to.deep.equal([['Research', 'Luxuries']]);
    expect(orderFor(person, Research)).to.deep.equal([['Tax', 'Luxuries']]);
    expect(orderFor(person, Luxuries)).to.deep.equal([['Tax', 'Research']]);
    expect(orderFor(computer, Research)).to.deep.equal([['Tax']]);
    expect(orderFor(computer, Tax)).to.deep.equal([undefined]);
    expect(orderFor(computer, Luxuries)).to.deep.equal([undefined]);
  });

  it("brings a person's rates down at a change of government", (): void => {
    const { playerGovernment, rates, values } = setUp('person', Democracy);

    set(rates, [0, 100, 0]);
    expect(values()).to.deep.equal([0, 100, 0]);

    playerGovernment.set(new Anarchy());

    expect(values()).to.deep.equal([0, 60, 40]);
  });

  it("moves a computer player's research over its maximum to tax, and never limits its tax", (): void => {
    const { playerGovernment, rates, values } = setUp('computer', Democracy);

    set(rates, [10, 90, 0]);
    expect(values()).to.deep.equal([10, 90, 0]);

    playerGovernment.set(new Communism());
    expect(values()).to.deep.equal([10, 70, 20]);

    // 0.7 for research is 70, not 70.00000000000001: 70 is at the limit, so nothing moves.
    set(rates, [0, 70, 30]);
    expect(values()).to.deep.equal([0, 70, 30]);

    set(rates, [0, 71, 29]);
    expect(values()).to.deep.equal([0, 70, 30]);

    set(rates, [0, 0, 100]);
    expect(values()).to.deep.equal([0, 0, 100]);
  });

  it("keeps a Militaristic computer player's starting 70% tax under Despotism", (): void => {
    const { player, ruleRegistry, traitRegistry, values } = setUp(
        'computer',
        Despotism
      ),
      TheLeader = class TheLeader extends Leader {};

    traitRegistry.register(new Militaristic(TheLeader));

    Object.assign(player, {
      civilization: () => ({
        leader: () => ({ sourceClass: () => TheLeader }),
      }),
    });

    ruleRegistry.process(Spawn, player, null);

    expect(values()).to.deep.equal([10, 20, 70]);
  });

  it("keeps a person's starting 60% research under Despotism", (): void => {
    const { player, ruleRegistry, values } = setUp('person', Despotism);

    ruleRegistry.process(Spawn, player, null);

    expect(values()).to.deep.equal([0, 60, 40]);
  });

  it('leaves a player whose rates are not there yet alone at a change of government', (): void => {
    const ruleRegistry = new RuleRegistry(),
      playerTradeRatesRegistry = new PlayerTradeRatesRegistry();

    ruleRegistry.register(...governmentChanged(playerTradeRatesRegistry));

    const player = new Player(ruleRegistry),
      playerGovernment = new PlayerGovernment(
        player,
        new AvailableGovernmentRegistry(),
        ruleRegistry
      );

    expect(() => playerGovernment.set(new Despotism())).not.to.throw();
  });
});

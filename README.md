# civ2-trade-rate

How Civilization II turns a city's trade into luxuries, research and tax, and the rates a civilization starts at
(OpenCiv2's reconstruction of the original, richardpenman/civ2@49f26ec).

- **The split** (`city_split_trade`): luxuries get `(trade × rate + 4) / 10` (rates in tenths), research the same capped by
  what luxuries leave, and tax the rest (`lib/split`, through `base-trade-rate`'s `splitTrade`). Specialists,
  buildings and Fundamentalism's share come after this in Civ2, in the city packages.
- **Starting rates:** 20% luxuries, 40% research and 40% tax when a civilization is added (`civ_create_reset_civ`). Once it has
  its leader and units, a person starts at 60% research and 40% tax (the default of the game's saved preferences, `game_init_new`), and a computer player at 10%
  luxuries, its leader's civilize score + 3 tenths research and the rest tax (`civ_create`).
- **Adjusting:** each player is offered `AdjustTradeRates` for their own rates.
- **Maximum rates** (core-trade-rate's `MaxRate` and `ExcessRate`, `Rules/Player/max-rate`), which differ for persons
  and computer players, as in the original:
  - a person may put at most 60% into any rate under Anarchy and Despotism, 70% under Monarchy, 80% under Communism,
    Fundamentalism and the Republic, and 100% under Democracy (`civ_max_tax_rate`). What a rate has over goes where the
    rates dialog puts it (`city_advisors.cpp`): tax to research, then luxuries; research to tax, then luxuries; luxuries
    to tax, then research;
  - a computer player's research is limited to 60% under Anarchy and Despotism, 70% under Monarchy, Communism and
    Fundamentalism, 80% under the Republic and 100% under Democracy, and what it has over goes to tax
    (`civ_process_cities_turn`). Its tax and luxuries aren't limited, so a Militaristic leader's 70% starting tax
    stands.

  Rates over the new maximums are brought down when the government changes, except a person's on entering Anarchy:
  the original opens the rates dialog, which clamps them, only for a government after it (`civ_set_government`). A
  player with no government yet has no maximums. Fundamentalism's own limit on research (50%) is civ2-science's,
  applied in the split.

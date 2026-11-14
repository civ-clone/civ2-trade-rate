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

Not here yet: each government's maximum rate (60% to 100%), deferred to M2d.

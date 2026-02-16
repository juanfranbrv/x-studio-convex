# Archetype Matrix

## Intent -> recommended archetypes

- `servicio`: `split_hero`, `grid_bento`, `process_z`, `hub_spoke`, `checklist_blocks`
- `oferta`: `radial_spotlight`, `split_hero`, `stacked_cards`, `diagonal_energy`
- `comunicado`: `stacked_cards`, `timeline_vertical`, `checklist_blocks`, `split_hero`
- `pasos`: `process_z`, `timeline_vertical`, `checklist_blocks`, `diagonal_energy`
- `catalogo`: `grid_bento`, `stacked_cards`, `split_hero`, `before_after`
- `comparativa`: `before_after`, `split_hero`, `diagonal_energy`, `checklist_blocks`
- `dato`: `checklist_blocks`, `timeline_vertical`, `grid_bento`, `hub_spoke`
- fallback for any other intent: rotate all archetypes

## Archetype -> thumbnail family

- `grid_bento` -> `grid`
- `split_hero` -> `split`
- `radial_spotlight` -> `radial`
- `process_z` -> `process`
- `stacked_cards` -> `card`
- `diagonal_energy` -> `split`
- `timeline_vertical` -> `process`
- `checklist_blocks` -> `list`
- `before_after` -> `split`
- `hub_spoke` -> `radial`

## ID token recommendations

- grid family: `grid`, `mosaic`, `catalogo`
- split family: `split`, `versus`, `comparison`
- process family: `process`, `timeline`, `pasos`
- radial family: `radial`, `spotlight`, `hero`
- card family: `card`, `frame`, `tarjeta`
- list family: `list`, `check`, `memo`
- stat family: `stat`, `metric`, `dashboard`, `dato`

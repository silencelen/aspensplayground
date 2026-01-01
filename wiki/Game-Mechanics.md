# Game Mechanics

Deep dive into how the game systems work under the hood.

---

## Wave System

### Wave Progression

Waves increase in difficulty as you progress:

| Wave | Zombies | Types Available | Scaling |
|------|---------|-----------------|---------|
| 1-2 | 5-8 | Normal only | Base stats |
| 3-4 | 10-15 | +Runners | +16-32% stats |
| 5-6 | 15-20 | +Crawlers, Tanks | +40-48% stats |
| 7-9 | 20-30 | +Spitters, Exploders | +56-72% stats |
| 10 | 1 | **BOSS** | Boss Level 1 |
| 11+ | 25+ | All types | +80%+ stats |

### Wave Scaling Formula

```
Zombies per wave = 5 + (wave × 2)
Health scaling = 1 + (wave × 0.08)
Damage scaling = 1 + (wave × 0.05)
Speed scaling = 1 + (wave × 0.02)
```

### Boss Waves

Every 10th wave is a boss wave:
- Wave 10: THE ABOMINATION
- Wave 20: NIGHTMARE KING
- Wave 30: DEATH BRINGER
- Wave 40: ETERNAL HORROR
- Wave 50: APOCALYPSE LORD

See [Boss Fights](Boss-Fights) for detailed boss strategies.

---

## Damage System

### Damage Calculation

```
Final Damage = Base Damage × Headshot Multiplier × Upgrade Multiplier × Distance Falloff
```

### Headshot Multiplier

| Weapon | Headshot Bonus |
|--------|----------------|
| All weapons | 1.5x damage |

### Distance Falloff

| Weapon | Falloff |
|--------|---------|
| Shotgun | Heavy (50% at range) |
| SMG | Light (80% at range) |
| Assault Rifle | None |
| Sniper Rifle | None |
| Laser Gun | None |
| Grenade Launcher | Explosive radius |

### Explosion Damage

```
Explosion Damage = Base Damage × (1 - distance / radius)
```

- Grenades: 80 base, 5 unit radius
- Grenade Launcher: 100 base, 6 unit radius
- Exploder death: 50 base, 5 unit radius

---

## Points System

### Kill Points

| Zombie Type | Base Points | Headshot Bonus |
|-------------|-------------|----------------|
| Normal | 100 | +50 |
| Runner | 120 | +60 |
| Crawler | 130 | +65 |
| Tank | 200 | +100 |
| Spitter | 150 | +75 |
| Exploder | 180 | +90 |
| Minion | 50 | +25 |
| Boss | 2000+ | +1000 |

### Wave Completion Bonus

```
Wave Bonus = 500 + (wave × 100)
```

### Multipliers

| Action | Multiplier |
|--------|------------|
| Headshot | 1.5x |
| Multi-kill (3+) | 1.2x |
| No damage taken | 1.1x |

---

## Health System

### Player Health

- **Base Health**: 100 HP
- **Max with upgrades**: 250 HP (Level 10)
- **Health Regeneration**: 0-2.5 HP/sec (with upgrades)

### Health Pickups

| Pickup | Healing |
|--------|---------|
| Small Medkit | 25 HP |
| Large Medkit | 50 HP |
| Full Heal | 100% HP |

### Damage Sources

| Source | Damage |
|--------|--------|
| Normal zombie melee | 15 |
| Runner melee | 10 |
| Runner leap | 15 |
| Crawler melee | 20 |
| Tank melee | 35 |
| Tank charge | 70 |
| Spitter acid | 12 |
| Exploder explosion | 50 |
| Boss ground slam | 40 |
| Boss charge | 60 |

---

## Movement System

### Base Movement

| Action | Speed |
|--------|-------|
| Walk | 5 units/sec |
| Sprint | 8 units/sec |
| Jump height | 2 units |
| Sprint duration | 3 seconds |
| Sprint cooldown | 2 seconds |

### With Upgrades

```
Walk Speed = 5 × (1 + 0.05 × Speed Level)
Sprint Duration = 3 × (1 + 0.20 × Sprint Level)
```

### Jump Mechanics

- Single jump only (no double jump)
- Jumping doesn't affect shooting accuracy
- Can change direction mid-air
- Landing has no recovery time

---

## Ammo System

### Ammo Pickups

| Pickup | Effect |
|--------|--------|
| Small Ammo | +30% reserve for current weapon |
| Large Ammo | +60% reserve for all weapons |
| Full Ammo | 100% reserve for all weapons |

### Reserve Limits

| Weapon | Magazine | Max Reserve |
|--------|----------|-------------|
| Pistol | 12 | Unlimited |
| Shotgun | 6 | 24 |
| SMG | 30 | 120 |
| Assault Rifle | 30 | 90 |
| Sniper Rifle | 5 | 20 |
| Laser Gun | 100 energy | Regenerates |
| Grenade Launcher | 4 | 12 |

### Reload Mechanics

```
Reload Time = Base Reload × (1 - 0.12 × Reload Level)
```

- Reload can be interrupted by switching weapons
- Partial reloads don't waste ammo
- Shotgun reloads shell-by-shell

---

## Spawn System

### Zombie Spawning

- Zombies spawn at designated spawn points
- Minimum distance from player: 15 units
- Maximum active zombies: 15-100 (scales with wave)
- Spawn rate: 1 zombie every 0.5-2 seconds

### Pickup Spawning

| Trigger | Chance |
|---------|--------|
| Zombie death | 15% |
| Wave completion | 100% (3 pickups) |
| Boss death | 100% (5 pickups) |

### Pickup Types

| Type | Weight |
|------|--------|
| Health | 30% |
| Ammo | 50% |
| Grenade | 20% |

---

## Collision System

### Player Collision

- Player has a capsule collider
- Cannot walk through walls or obstacles
- Can jump onto some platforms
- Zombies push player on contact

### Bullet Collision

- Hitscan weapons: Instant ray check
- Projectiles: Physics-based travel
- Laser: Continuous beam damage
- Penetration: Laser only

### Zombie Collision

- Zombies avoid each other (separation)
- Zombies pathfind around obstacles
- Tanks can push through smaller zombies

---

## Audio System

### Sound Categories

| Category | Examples |
|----------|----------|
| Master | Overall volume |
| Music | Background tracks |
| SFX | Weapons, zombies, UI |
| Ambient | Environmental sounds |

### 3D Audio

- Sounds have positional audio
- Volume decreases with distance
- Stereo panning based on direction
- Max hearing distance: 50 units

---

## Performance Optimizations

### Level of Detail (LOD)

- Distant zombies use simpler models
- Particle effects reduced at distance
- Shadow quality scales with settings

### Culling

- Objects behind player not rendered
- Off-screen zombies still simulated
- Bullet impacts limited to visible area

### Settings Impact

| Setting | Performance Impact |
|---------|-------------------|
| Shadows | High |
| Particles | Medium |
| Draw Distance | Medium |
| Post-processing | Low |

---

## Randomization

### What's Random

- Zombie spawn locations (from fixed points)
- Pickup drops
- Zombie type selection (weighted)
- Damage variance (±5%)

### What's Not Random

- Wave composition percentages
- Upgrade costs
- Boss abilities and timing
- Weapon stats

---

## Debugging

### Debug Mode (Single Player)

Press F6 to toggle infinite ammo for testing.

### Debug Console

Available in developer mode:
- FPS counter
- Network latency display
- Entity count

---

## Technical Limits

| Limit | Value |
|-------|-------|
| Max zombies per room | 100 |
| Max players per room | 8 |
| Max projectiles | 50 |
| Max particles | 1000 |
| Update rate | 60 FPS |
| Network tick rate | 20 Hz |

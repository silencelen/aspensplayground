# Multiplayer

Everything you need to know about playing with friends.

---

## Getting Started

### Joining Multiplayer

1. From the main menu, select **MULTIPLAYER**
2. Enter your player name
3. You'll be placed in a lobby with other players
4. Wait for players or start when ready

### Lobby System

- Lobbies hold up to **8 players**
- Minimum **1 player** to start
- All players must ready up OR host can force start
- New players can join mid-game

---

## Room Management

### Creating a Room

Rooms are created automatically when you join multiplayer. You'll be placed in an available room or a new one if all rooms are full.

### Room Capacity

| Status | Players |
|--------|---------|
| Minimum | 1 |
| Recommended | 2-4 |
| Maximum | 8 |

### Joining Friends

Currently, rooms are joined automatically. To play with friends:
1. Coordinate timing - join at the same time
2. If separated, one player can leave and rejoin

---

## Gameplay Differences

### Shared vs Individual

| Mechanic | Type |
|----------|------|
| Wave progression | Shared |
| Zombie spawns | Shared (scaled) |
| Points/Score | Individual |
| Upgrades | Individual |
| Health | Individual |
| Ammo | Individual |
| Weapons | Individual |

### Scaling

Multiplayer scales difficulty based on player count:

```
Zombies = Base Zombies × (1 + 0.5 × (players - 1))
```

| Players | Zombie Multiplier |
|---------|-------------------|
| 1 | 1.0x |
| 2 | 1.5x |
| 3 | 2.0x |
| 4 | 2.5x |
| 8 | 4.5x |

---

## Cooperation

### Reviving

When a player's health reaches 0:
- They enter a **downed state**
- Other players can revive them
- Revive time: 5 seconds
- Revived with 50% health

### If All Players Down

- Game Over for the room
- Final scores calculated
- All players return to lobby

### Team Strategies

**Roles to Consider:**

| Role | Focus | Recommended Upgrades |
|------|-------|---------------------|
| Tank | Draw aggro, survive | Max Health, Regen |
| DPS | Kill priority targets | Damage, Fire Rate |
| Support | Clear minions, watch flanks | Movement, Reload |
| Sniper | Long-range priority kills | Damage, Accuracy |

---

## Communication

### Player Indicators

Each player has:
- Colored name tag above their head
- Health bar visible to teammates
- Unique color for identification

### In-Game Signals

- Players can see each other's positions
- Damage numbers visible for all hits
- Kill feed shows who killed what

---

## Network & Connection

### Connection Requirements

- Stable internet connection
- WebSocket support (all modern browsers)
- Recommended: < 100ms latency

### Connection Status

Look for these indicators:
- **Green**: Good connection
- **Yellow**: Moderate latency
- **Red**: Poor connection/packet loss

### Reconnection

If disconnected:
- The game attempts automatic reconnection
- If successful, you rejoin your room
- If failed, return to main menu and rejoin

---

## Multiplayer Tips

### Do's

1. **Communicate positions** - Call out dangerous zombies
2. **Share the kills** - Let others get points too
3. **Watch each other's backs** - Cover blind spots
4. **Prioritize revives** - A downed player means less DPS
5. **Coordinate upgrades** - Don't all go glass cannon

### Don'ts

1. **Don't hog all pickups** - Share health and ammo
2. **Don't camp spawn points** - Let zombies spread out
3. **Don't ignore downed players** - They need help!
4. **Don't split up too far** - Stick within revive range
5. **Don't waste grenades** - Save for emergencies

---

## Shop in Multiplayer

### Shop Timer

- Shop opens after each wave
- 15-second timer
- All players shop simultaneously
- Game continues when timer ends OR all ready

### Ready System

- Each player has a "Ready" button
- When all players ready, shop closes early
- Unready players lose remaining shop time

### Shared Purchases?

No - all purchases are individual:
- Your upgrades are yours
- Your points are yours
- Your progress is yours

---

## Scoring

### Individual Scores

Each player earns points independently:
- Kill points go to the killer
- Headshot bonuses are individual
- Wave bonuses are shared equally

### Leaderboard

After game over:
- Each player's score is submitted individually
- Scores marked as multiplayer vs solo
- Leaderboard shows top scores from all modes

---

## Boss Fights in Multiplayer

### Boss Targeting

- Boss targets the nearest player
- Target can change mid-attack
- Ground slam hits all players in range
- Charge targets one player

### Multiplayer Boss Strategy

1. **Kiting Rotation**: Take turns being targeted
2. **Focus Fire**: Coordinate damage during windows
3. **Minion Control**: Assign one player to clear minions
4. **Spread Out**: Don't all get hit by ground slam

---

## Known Issues

### Latency

High latency (>200ms) may cause:
- Delayed damage registration
- Zombie position jitter
- Shop timing issues

### Workarounds

- Use wired connection if possible
- Close bandwidth-heavy applications
- Try playing during off-peak hours

---

## FAQ

### Can I play with friends only?

Private rooms are not yet available. You'll be matched with whoever joins the same room.

### What happens if I disconnect?

The game attempts to reconnect you. If unsuccessful, your progress is lost but other players continue.

### Do upgrades carry between games?

No - all upgrades reset when a game ends, same as single player.

### Is there friendly fire?

No - you cannot damage other players with weapons or grenades.

### How many zombies spawn in multiplayer?

Zombies scale with player count. 8 players face roughly 4.5x as many zombies as solo.

---

## Performance Tips

### For Smooth Multiplayer

1. **Lower graphics settings** - Reduces CPU/GPU load
2. **Close other tabs** - Frees up memory
3. **Use Ethernet** - More stable than WiFi
4. **Reduce particles** - Less network overhead

### Minimum Requirements

- Modern browser (Chrome, Firefox, Edge, Safari)
- Stable internet (5+ Mbps)
- WebGL support
- JavaScript enabled

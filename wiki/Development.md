# Development Guide

Technical documentation for developers working on Aspen's Playground.

---

## Architecture Overview

### Technology Stack
- **Rendering**: Three.js (WebGL)
- **Networking**: WebSocket for multiplayer
- **Storage**: localStorage for settings, achievements
- **Platform**: Browser-based (desktop and mobile)
- **Desktop**: Electron for standalone builds

### File Structure

```
aspensplayground/
├── index.html          # Single-page app (HTML, CSS, game container)
├── game.js             # Main game logic (~14,000+ lines)
├── server.js           # WebSocket server, leaderboard API
├── leaderboard.json    # Persistent leaderboard storage
├── modules/
│   ├── GameCore.js     # Shared game mechanics (constants, formulas)
│   ├── config.js       # CONFIG object with game constants
│   ├── utils.js        # Utilities (DebugLog, SpatialGrid, etc.)
│   ├── ui.js           # UI components (KillFeed, DamageNumbers)
│   └── maps/
│       ├── MapManager.js   # Map loading and transitions
│       ├── BaseMap.js      # Base class for all maps
│       └── *.js            # Individual map definitions
├── electron/           # Desktop app packaging
├── wiki/               # Documentation (this wiki)
└── .github/            # CI/CD workflows
```

---

## Key Sections in game.js

| Section | Lines (approx) | Contents |
|---------|----------------|----------|
| Configuration | 1-1000 | CONFIG, DevSettings, GameState, playerState |
| Leaderboard | 500-650 | fetchLeaderboard, submitScore, renderLeaderboard |
| Weapons | 1000-1200 | WeaponUpgrades, Achievements, getWeaponStats |
| Networking | 2900-3500 | connectToServer, handleServerMessage, sendToServer |
| Player | 3500-4000 | Player mesh, weapons, health, grenades |
| Zombie AI | 9500-10500 | Pathfinding, steering, abilities |
| Environment | 5000-6500 | Arena, obstacles, props, themed areas |
| Rendering | 7000-8500 | Camera, animations, particles |
| Minimap | 8700-8900 | Canvas radar, coordinate transforms |
| UI/HUD | 8500-9500 | HUD, menus, mobile UI |

---

## Collision System

### AABB Structure

All collidable objects store bounds in `userData.collision`:

```javascript
group.userData.collision = {
    minX: number,    // World-space left boundary
    maxX: number,    // World-space right boundary
    minZ: number,    // World-space back boundary
    maxZ: number,    // World-space front boundary
    maxY: number     // Object height for jump detection
};
collisionObjects.push(group);
```

### Height-Based Collision

- `maxY` indicates obstacle height
- Player feet = `player.position.y - CONFIG.player.height`
- If feet > maxY, collision is skipped (jump over)

**Jumpable Objects (maxY <= 1.0m):**
- Tables, crates, barrels, benches, ball pit walls

**Non-Jumpable Objects (maxY > 1.5m):**
- Arcade machines, pillars, walls, play structures

### Collision Detection

```javascript
const playerFeetY = player.position.y - CONFIG.player.height;

for (const obj of collisionObjects) {
    const bounds = obj.userData.collision;

    // Skip if player's feet are above obstacle
    if (bounds.maxY !== undefined && playerFeetY > bounds.maxY) {
        continue;
    }

    // AABB circle collision check
    if (px + pr > bounds.minX && px - pr < bounds.maxX &&
        pz + pr > bounds.minZ && pz - pr < bounds.maxZ) {
        // Push player out of collision
    }
}
```

---

## Zombie AI System

### Pathfinding Architecture

Hybrid approach combining:
1. **A* Grid Pathfinding** - Long-range navigation via NavGrid
2. **Steering Behaviors** - Smooth obstacle avoidance
3. **Line of Sight** - Direct movement when path is clear

### Movement Flow (per frame)

1. Check if zombie should use special ability
2. If ability active, use ability-specific movement
3. Check direct line of sight to player
4. If LOS clear: move directly toward player
5. If LOS blocked: follow A* path (cached or recomputed)
6. Apply steering avoidance to prevent prop collisions
7. Check for stuck condition
8. Apply final velocity with speed and deltaTime

### NavGrid

- Coarse grid representation of walkable areas
- Cell size ~1 unit
- Rebuilt when destructible objects change

### Stuck Detection

- Tracks position history over time window
- If zombie hasn't moved >1m in threshold AND >4m from player:
  - Enters "unstuck mode"
  - Tries 8 cardinal/diagonal directions via raycast
  - Times out after 5 seconds

### Zombie Types

| Type | Special Ability |
|------|-----------------|
| Normal | None |
| Runner | Leap Attack (parabolic jump, 400ms) |
| Tank | Charge Attack (4x speed, straight line) |
| Spitter | Acid Spit (ranged DoT pool) |
| Boss | Ground Slam, Charge, Summon |

---

## Multiplayer Networking

### Connection Flow

**Client:**
1. User clicks "Multiplayer"
2. `connectToServer()` creates WebSocket
3. Sends player name and cosmetics
4. Receives 'init' with player ID
5. Shows lobby with player list

**Server:**
1. WebSocket server alongside HTTP
2. Assigns unique ID, creates player object
3. Sends 'init' with lobby state
4. Broadcasts 'playerJoined' to others

### Message Types

**Client → Server:**
| Message | Purpose |
|---------|---------|
| setName | Update display name |
| setCosmetic | Update cosmetics |
| ready | Toggle ready state |
| playerUpdate | Position/rotation (throttled) |
| shoot | Weapon fire event |
| zombieHit | Damage report |

**Server → Client:**
| Message | Purpose |
|---------|---------|
| init | Connection data, lobby state |
| lobbyUpdate | Player list changes |
| playerJoined/Left | Player connect/disconnect |
| playerUpdate | Other player positions |
| zombieSync | Authoritative zombie state |
| gameStart | Game beginning |
| waveStart | New wave |
| gameOver | Game ended |

### State Synchronization

- Position updates capped at 60Hz (16ms throttle)
- Server broadcasts to all clients
- Clients interpolate remote positions
- Zombies are server-authoritative
- Damage reported to server, reconciled

### Sync Throttling

```javascript
const SYNC_THROTTLE_MS = 50;  // Max 20 syncs/sec
if (now - lastSyncProcess < SYNC_THROTTLE_MS) return;
```

---

## Developer Settings

### DevSettings Object

```javascript
const DevSettings = {
    godMode: false  // No damage in singleplayer
};
```

### Debug Keys

| Key | Action |
|-----|--------|
| F4 | Toggle God Mode (singleplayer only) |
| F6 | Toggle Infinite Ammo (singleplayer only) |

### God Mode Behavior

- Player takes no damage
- Visual "GOD MODE" indicator
- Score NOT submitted to leaderboard
- Only works in singleplayer

### Leaderboard Protection

```javascript
function damagePlayer(damage) {
    if (DevSettings.godMode && GameState.mode === 'singleplayer') {
        return;  // No damage
    }
    // ... normal damage handling
}
```

---

## GameCore Module

Shared constants and calculations between client and server.

### Key Exports

```javascript
GameCore.ZOMBIE_TYPES      // Type configurations
GameCore.BOSS_CONFIG       // Boss attack patterns
GameCore.WaveSystem        // Wave calculations
GameCore.ZombieAI          // Ability triggers
GameCore.Combat            // Damage calculations
```

### Wave Scaling

```javascript
GameCore.WaveSystem.getZombieCount(wave)     // Zombies per wave
GameCore.WaveSystem.getHealthMultiplier(wave) // HP scaling
GameCore.WaveSystem.getSpeedMultiplier(wave)  // Speed scaling
```

---

## Adding New Content

### New Weapon

1. Add to `CONFIG.weapons` array
2. Create `createWeaponModel_WeaponName()` function
3. Update `getWeaponStats()` if needed
4. Add upgrade costs to `WeaponUpgrades`

### New Zombie Type

1. Add type configuration to GameCore.ZOMBIE_TYPES
2. Create mesh in `createZombieMesh()`
3. Add special abilities in zombie update loop
4. Update spawning logic with wave thresholds

### New Map

1. Create new file in `modules/maps/`
2. Extend `BaseMap` class
3. Implement `createEnvironment()` method
4. Register in `MapManager`

### New Environment Object

1. Create function like `createNewObject()`
2. Add collision bounds with `maxY`
3. Optionally add to `destructibleObjects`
4. Call from map's `createEnvironment()`

---

## UI Considerations

### Responsive Design

- Desktop: Default CSS styles
- Mobile: `@media (max-width: 900px), (hover: none)`
- Always test both viewports

### Mobile Detection

```javascript
const isMobile = window.innerWidth <= 900 ||
                 'ontouchstart' in window;
```

---

## Performance Tips

### Hot Paths

- `updateZombieSinglePlayer()` - Called per zombie per frame
- `calculateObstacleAvoidance()` - Multiple raycasts
- `handleSync()` - Network message processing

### Optimization Strategies

- Object pooling for zombies and projectiles
- NavGrid caching with invalidation
- Throttled network updates
- LOD for distant entities

---

## Testing

### Local Development

```bash
# Start server
node server.js

# Access at
http://localhost:3000
```

### Electron Development

```bash
cd electron
npm install
npm start
```

### Debug Console

- FPS counter available
- Network latency display
- Entity counts
- Use `DebugLog.log(category, message)` for logging

---

## Deployment

### Web (IIS/Nginx)

- Serve static files from root
- Proxy WebSocket to port 3000
- Enable HTTPS for wss://

### Desktop Releases

- GitHub Actions builds on tag push
- Platforms: Windows (NSIS), macOS (DMG), Linux (AppImage)
- Auto-publishes to GitHub Releases

---

## Common Issues

### Zombies Getting Stuck

- Check NavGrid regeneration
- Verify obstacle bounds are correct
- Stuck detection should trigger recovery

### Multiplayer Desync

- Check throttle rates
- Verify server authority for zombies
- Look for race conditions in state updates

### Mobile Performance

- Reduce particle counts
- Lower shadow quality
- Disable post-processing

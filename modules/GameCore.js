// ============================================
// GAME CORE - Shared Game Logic Module
// ============================================
// This module contains ALL game mechanics shared between
// singleplayer (game.js) and multiplayer (server.js).
// It is the single source of truth for game balance and behavior.

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node.js
        module.exports = factory();
    } else {
        // Browser global
        root.GameCore = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const GameCore = {};

    // ==================== CONSTANTS ====================
    // All game balance values in one place

    GameCore.Constants = {
        // Arena dimensions
        ARENA: {
            WIDTH: 50,
            DEPTH: 50
        },

        // Base stats for all zombie types
        ZOMBIE_TYPES: {
            normal:   { health: 100, speed: 3.0, damage: 15, scale: 1.0, points: 100 },
            runner:   { health: 50,  speed: 5.5, damage: 10, scale: 0.85, points: 120 },
            crawler:  { health: 80,  speed: 4.2, damage: 20, scale: 0.9, points: 130 },
            tank:     { health: 350, speed: 1.8, damage: 35, scale: 1.5, points: 200 },
            spitter:  { health: 70,  speed: 2.8, damage: 12, scale: 0.95, points: 150 },
            exploder: { health: 60,  speed: 3.5, damage: 50, scale: 1.1, points: 180 },
            minion:   { health: 40,  speed: 4.0, damage: 8,  scale: 0.7, points: 50 }
        },

        // Zombie ability parameters
        ABILITIES: {
            runner: {
                leap: {
                    duration: 400,          // ms
                    triggerRange: [4, 8],   // min/max distance to trigger
                    cooldown: 4000,         // ms
                    damageMult: 1.5,        // damage multiplier on landing
                    landingRange: 2,        // distance to hit player on landing
                    peakHeight: 2.5         // max height of leap arc
                }
            },
            tank: {
                charge: {
                    duration: 1200,         // ms
                    triggerRange: [6, 12],  // min/max distance to trigger
                    cooldown: 6000,         // ms
                    speedMult: 4,           // speed multiplier during charge
                    damageMult: 2,          // damage multiplier on hit
                    hitRange: 1.5           // distance to hit player during charge
                }
            },
            spitter: {
                retreatRange: 10,           // back away when player closer than this
                projectileSpeed: 12,        // units per second
                attackRange: 8,             // max attack range
                attackCooldown: 2000        // ms between attacks
            },
            default: {
                cooldown: 3000              // default ability cooldown
            }
        },

        // Attack ranges by zombie type
        ATTACK_RANGES: {
            default: 2,
            tank: 2.5,
            spitter: 8
        },

        // Attack cooldowns by zombie type (ms)
        ATTACK_COOLDOWNS: {
            default: 1000,
            spitter: 2000
        },

        // Wave scaling multipliers (per wave after wave 1)
        WAVE_SCALING: {
            health: 0.08,   // +8% per wave
            damage: 0.05,   // +5% per wave
            speed: 0.02     // +2% per wave
        },

        // Boss configuration
        BOSS: {
            WAVE_INTERVAL: 10,  // Boss every N waves
            NAMES: [
                'THE ABOMINATION',
                'NIGHTMARE KING',
                'DEATH BRINGER',
                'ETERNAL HORROR',
                'APOCALYPSE LORD'
            ],
            // Base boss stats (level 1 = wave 10)
            BASE: {
                health: 1500,
                healthPerLevel: 500,
                speed: 1.8,
                speedPerLevel: 0.1,
                damage: 50,
                damagePerLevel: 10,
                scale: 2.5,
                scalePerLevel: 0.2,
                points: 2000,
                pointsPerLevel: 500
            },
            // Boss attack definitions
            ATTACKS: {
                groundSlam: { cooldown: 8000, damage: 40, radius: 6 },
                charge: { cooldown: 12000, damage: 60, speed: 12, duration: 1500 },
                summon: { cooldown: 15000, baseCount: 2 }
            },
            // Health percentage thresholds for phases
            PHASE_THRESHOLDS: [0.66, 0.33],
            // Cooldown multipliers by phase (faster attacks at low health)
            COOLDOWN_MULTIPLIERS: { 1: 1, 2: 0.8, 3: 0.6 }
        },

        // Exploder death explosion
        EXPLODER: {
            EXPLOSION_RADIUS: 5,
            EXPLOSION_DAMAGE: 40
        },

        // Pickup drop configuration
        DROP_RATES: {
            normal: 0.3,        // 30% drop chance
            tank: 0.5,          // 50% drop chance
            boss: 1.0,          // 100% drop chance
            bossPickupCount: 3, // Extra pickups from boss
            // Type distribution
            types: {
                health: 0.4,    // 40% chance
                ammo: 0.4,      // 40% chance
                grenade: 0.2    // 20% chance
            }
        },

        // Pickup effects
        PICKUP_EFFECTS: {
            health: 25,         // HP restored
            ammoMultiplier: 1,  // Full mag restore
            grenadeCount: 2     // Grenades given
        },

        // Wave completion bonuses
        WAVE_BONUS: {
            normal: { base: 500, perWave: 100 },
            boss: { base: 2000, perWave: 200 }
        },

        // Spawn timing
        SPAWN: {
            baseInterval: 2000,     // Base spawn interval (ms)
            minInterval: 800,       // Minimum spawn interval
            intervalReduction: 100  // Reduction per wave
        }
    };

    // ==================== WAVE SYSTEM ====================
    // Wave progression, zombie selection, and scaling

    GameCore.WaveSystem = {
        // Check if wave is a boss wave (every 10 waves)
        isBossWave: function(wave) {
            return wave > 0 && wave % GameCore.Constants.BOSS.WAVE_INTERVAL === 0;
        },

        // Get number of zombies for a wave
        getZombieCount: function(wave, baseCount) {
            baseCount = baseCount || 5;
            if (this.isBossWave(wave)) return 1; // Boss wave = just the boss
            return Math.floor(baseCount + (wave - 1) * 2 + Math.pow(wave, 1.3));
        },

        // Get spawn interval for wave (ms) - faster spawning in later waves
        getSpawnInterval: function(wave) {
            const C = GameCore.Constants.SPAWN;
            return Math.max(C.minInterval, C.baseInterval - wave * C.intervalReduction);
        },

        // Select zombie type based on wave with weighted probabilities
        getZombieType: function(wave) {
            const roll = Math.random() * 100;

            if (wave <= 2) return 'normal';

            if (wave <= 4) {
                if (roll < 20) return 'runner';
                return 'normal';
            }

            if (wave <= 6) {
                if (roll < 15) return 'runner';
                if (roll < 30) return 'crawler';
                return 'normal';
            }

            if (wave <= 8) {
                if (roll < 15) return 'runner';
                if (roll < 27) return 'crawler';
                if (roll < 37) return 'tank';
                return 'normal';
            }

            // Wave 9+
            if (roll < 12) return 'runner';
            if (roll < 22) return 'crawler';
            if (roll < 32) return 'tank';
            if (roll < 40) return 'spitter';
            if (roll < 48) return 'exploder';
            return 'normal';
        },

        // Get base properties for a zombie type
        getTypeProps: function(type) {
            const props = GameCore.Constants.ZOMBIE_TYPES[type];
            if (!props) return GameCore.Constants.ZOMBIE_TYPES.normal;
            return {
                health: props.health,
                maxHealth: props.health,
                speed: props.speed,
                damage: props.damage,
                scale: props.scale,
                points: props.points
            };
        },

        // Scale zombie stats by wave number
        scaleByWave: function(props, wave, randomizeSpeed) {
            if (randomizeSpeed === undefined) randomizeSpeed = true;
            const S = GameCore.Constants.WAVE_SCALING;

            const healthMult = 1 + (wave - 1) * S.health;
            const damageMult = 1 + (wave - 1) * S.damage;
            const speedMult = 1 + (wave - 1) * S.speed;
            const speedVariance = randomizeSpeed ? (0.9 + Math.random() * 0.2) : 1;

            return {
                health: Math.floor(props.health * healthMult),
                maxHealth: Math.floor(props.health * healthMult),
                damage: Math.floor(props.damage * damageMult),
                speed: props.speed * speedMult * speedVariance,
                scale: props.scale,
                points: props.points
            };
        },

        // Get boss properties for a given wave
        getBossProps: function(wave) {
            const bossLevel = Math.floor(wave / GameCore.Constants.BOSS.WAVE_INTERVAL);
            const B = GameCore.Constants.BOSS.BASE;
            const A = GameCore.Constants.BOSS.ATTACKS;
            const names = GameCore.Constants.BOSS.NAMES;

            return {
                health: B.health + bossLevel * B.healthPerLevel,
                maxHealth: B.health + bossLevel * B.healthPerLevel,
                speed: B.speed + bossLevel * B.speedPerLevel,
                damage: B.damage + bossLevel * B.damagePerLevel,
                scale: B.scale + bossLevel * B.scalePerLevel,
                points: B.points + bossLevel * B.pointsPerLevel,
                name: names[Math.min(bossLevel - 1, names.length - 1)] || ('BOSS LV.' + bossLevel),
                attacks: {
                    groundSlam: { cooldown: A.groundSlam.cooldown, damage: A.groundSlam.damage, radius: A.groundSlam.radius },
                    charge: { cooldown: A.charge.cooldown, damage: A.charge.damage, speed: A.charge.speed },
                    summon: { cooldown: A.summon.cooldown, count: A.summon.baseCount + bossLevel }
                }
            };
        },

        // Get boss name for a level
        getBossName: function(level) {
            const names = GameCore.Constants.BOSS.NAMES;
            return names[Math.min(level - 1, names.length - 1)] || ('BOSS LV.' + level);
        },

        // Calculate wave completion bonus
        getWaveBonus: function(wave) {
            const isBoss = this.isBossWave(wave);
            const bonus = isBoss ? GameCore.Constants.WAVE_BONUS.boss : GameCore.Constants.WAVE_BONUS.normal;
            return bonus.base + wave * bonus.perWave;
        },

        // Get max zombies alive for a wave (for throttling spawns)
        getMaxZombiesAlive: function(wave, baseMax, perWave, absoluteMax) {
            baseMax = baseMax || 20;
            perWave = perWave || 5;
            absoluteMax = absoluteMax || 100;
            return Math.min(absoluteMax, baseMax + wave * perWave);
        }
    };

    // ==================== ZOMBIE AI ====================
    // Movement, abilities, and attack logic

    GameCore.ZombieAI = {
        // Get attack range for zombie type
        getAttackRange: function(type) {
            const ranges = GameCore.Constants.ATTACK_RANGES;
            return ranges[type] || ranges.default;
        },

        // Get attack cooldown for zombie type (ms)
        getAttackCooldown: function(type) {
            const cooldowns = GameCore.Constants.ATTACK_COOLDOWNS;
            return cooldowns[type] || cooldowns.default;
        },

        // Get ability cooldown for zombie type (ms)
        getAbilityCooldown: function(type) {
            const A = GameCore.Constants.ABILITIES;
            if (type === 'runner') return A.runner.leap.cooldown;
            if (type === 'tank') return A.tank.charge.cooldown;
            return A.default.cooldown;
        },

        // Initialize ability state for a zombie
        createAbilityState: function(type) {
            return {
                isLeaping: false,
                isCharging: false,
                lastAbilityUse: 0,
                abilityCooldown: this.getAbilityCooldown(type),
                leapStartTime: 0,
                leapStartPos: null,
                leapTargetPos: null,
                chargeStartTime: 0,
                chargeDirection: null
            };
        },

        // Check if runner should start leap attack
        shouldRunnerLeap: function(distance, abilityState, now) {
            const leap = GameCore.Constants.ABILITIES.runner.leap;
            if (distance < leap.triggerRange[0] || distance > leap.triggerRange[1]) return false;
            if (abilityState.isLeaping || abilityState.isCharging) return false;
            return now - abilityState.lastAbilityUse > leap.cooldown;
        },

        // Calculate leap progress (0 to 1)
        calculateLeapProgress: function(startTime, now) {
            const leap = GameCore.Constants.ABILITIES.runner.leap;
            return Math.min(1, (now - startTime) / leap.duration);
        },

        // Calculate position during leap (parabolic arc)
        calculateLeapPosition: function(startPos, targetPos, progress) {
            const leap = GameCore.Constants.ABILITIES.runner.leap;
            const height = leap.peakHeight * Math.sin(progress * Math.PI);
            return {
                x: startPos.x + (targetPos.x - startPos.x) * progress,
                z: startPos.z + (targetPos.z - startPos.z) * progress,
                y: height
            };
        },

        // Check if leap landed close enough to hit target
        checkLeapLanding: function(zombiePos, targetPos) {
            const leap = GameCore.Constants.ABILITIES.runner.leap;
            const dx = zombiePos.x - targetPos.x;
            const dz = zombiePos.z - targetPos.z;
            return Math.sqrt(dx * dx + dz * dz) < leap.landingRange;
        },

        // Get leap damage (base damage * multiplier)
        getLeapDamage: function(baseDamage) {
            return baseDamage * GameCore.Constants.ABILITIES.runner.leap.damageMult;
        },

        // Check if tank should start charge attack
        shouldTankCharge: function(distance, abilityState, now) {
            const charge = GameCore.Constants.ABILITIES.tank.charge;
            if (distance < charge.triggerRange[0] || distance > charge.triggerRange[1]) return false;
            if (abilityState.isLeaping || abilityState.isCharging) return false;
            return now - abilityState.lastAbilityUse > charge.cooldown;
        },

        // Calculate charge progress (0 to 1)
        calculateChargeProgress: function(startTime, now) {
            const charge = GameCore.Constants.ABILITIES.tank.charge;
            return (now - startTime) / charge.duration;
        },

        // Get charge speed (base speed * multiplier)
        getChargeSpeed: function(baseSpeed) {
            return baseSpeed * GameCore.Constants.ABILITIES.tank.charge.speedMult;
        },

        // Check if charge hit target
        checkChargeHit: function(zombiePos, targetPos) {
            const charge = GameCore.Constants.ABILITIES.tank.charge;
            const dx = zombiePos.x - targetPos.x;
            const dz = zombiePos.z - targetPos.z;
            return Math.sqrt(dx * dx + dz * dz) < charge.hitRange;
        },

        // Get charge damage (base damage * multiplier)
        getChargeDamage: function(baseDamage) {
            return baseDamage * GameCore.Constants.ABILITIES.tank.charge.damageMult;
        },

        // Check if spitter should retreat (maintain distance)
        shouldSpitterRetreat: function(distance) {
            return distance < GameCore.Constants.ABILITIES.spitter.retreatRange;
        },

        // Calculate retreat direction (move away from target)
        calculateRetreatDirection: function(zombiePos, targetPos) {
            const dx = zombiePos.x - targetPos.x;
            const dz = zombiePos.z - targetPos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist === 0) return { x: 0, z: 0 };
            return { x: dx / dist, z: dz / dist };
        }
    };

    // ==================== BOSS AI ====================
    // Boss attack patterns and phase management

    GameCore.BossAI = {
        // Initialize boss attack state
        createAttackState: function(attacks) {
            const A = GameCore.Constants.BOSS.ATTACKS;
            return {
                phase: 1,
                lastGroundSlam: 0,
                lastCharge: 0,
                lastSummon: 0,
                isCharging: false,
                isDoingGroundSlam: false,
                chargeDirection: null,
                chargeStartTime: 0,
                attacks: attacks || {
                    groundSlam: { ...A.groundSlam },
                    charge: { ...A.charge },
                    summon: { cooldown: A.summon.cooldown, count: A.summon.baseCount }
                }
            };
        },

        // Update boss phase based on health percentage
        updatePhase: function(healthPercent) {
            const thresholds = GameCore.Constants.BOSS.PHASE_THRESHOLDS;
            if (healthPercent <= thresholds[1]) return 3;
            if (healthPercent <= thresholds[0]) return 2;
            return 1;
        },

        // Get cooldown multiplier for current phase
        getCooldownMultiplier: function(phase) {
            return GameCore.Constants.BOSS.COOLDOWN_MULTIPLIERS[phase] || 1;
        },

        // Check if ground slam should trigger
        shouldGroundSlam: function(distance, lastSlam, now, attacks, phase) {
            if (distance >= 8) return false;
            const mult = this.getCooldownMultiplier(phase);
            return now - lastSlam > attacks.groundSlam.cooldown * mult;
        },

        // Check if charge should trigger
        shouldCharge: function(distance, lastCharge, now, attacks, phase) {
            if (distance < 10 || distance > 25) return false;
            const mult = this.getCooldownMultiplier(phase);
            return now - lastCharge > attacks.charge.cooldown * mult;
        },

        // Check if minion summon should trigger
        shouldSummon: function(phase, lastSummon, now, attacks) {
            if (phase < 2) return false;
            const mult = this.getCooldownMultiplier(phase);
            return now - lastSummon > attacks.summon.cooldown * mult;
        },

        // Calculate minion spawn positions around boss
        calculateMinionSpawnPositions: function(bossPosition, count) {
            const positions = [];
            for (var i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 3 + Math.random() * 2;
                positions.push({
                    x: bossPosition.x + Math.cos(angle) * dist,
                    y: 0,
                    z: bossPosition.z + Math.sin(angle) * dist
                });
            }
            return positions;
        },

        // Get boss charge duration
        getChargeDuration: function() {
            return GameCore.Constants.BOSS.ATTACKS.charge.duration;
        }
    };

    // ==================== COMBAT ====================
    // Damage calculations, scoring, and drops

    GameCore.Combat = {
        // Calculate score for zombie kill
        calculateKillScore: function(basePoints, isHeadshot) {
            const bonus = isHeadshot ? Math.floor(basePoints * 0.5) : 0;
            return basePoints + bonus;
        },

        // Calculate exploder explosion damage based on distance
        calculateExploderDamage: function(distance) {
            const C = GameCore.Constants.EXPLODER;
            if (distance >= C.EXPLOSION_RADIUS) return 0;
            return Math.floor(C.EXPLOSION_DAMAGE * (1 - distance / C.EXPLOSION_RADIUS));
        },

        // Get explosion radius
        getExplosionRadius: function() {
            return GameCore.Constants.EXPLODER.EXPLOSION_RADIUS;
        },

        // Get base explosion damage
        getExplosionBaseDamage: function() {
            return GameCore.Constants.EXPLODER.EXPLOSION_DAMAGE;
        },

        // Get drop chance for zombie type
        getDropChance: function(zombieType, isBoss) {
            const rates = GameCore.Constants.DROP_RATES;
            if (isBoss) return rates.boss;
            return rates[zombieType] || rates.normal;
        },

        // Get number of pickups boss drops
        getBossPickupCount: function() {
            return GameCore.Constants.DROP_RATES.bossPickupCount;
        },

        // Roll for pickup type
        rollPickupType: function() {
            const types = GameCore.Constants.DROP_RATES.types;
            const roll = Math.random();
            if (roll < types.health) return 'health';
            if (roll < types.health + types.ammo) return 'ammo';
            return 'grenade';
        },

        // Check if should drop pickup
        shouldDropPickup: function(zombieType, isBoss) {
            return Math.random() < this.getDropChance(zombieType, isBoss);
        },

        // Get pickup effect value
        getPickupEffect: function(type) {
            return GameCore.Constants.PICKUP_EFFECTS[type] || 0;
        }
    };

    // ==================== UTILITIES ====================
    // Math and distance helpers

    GameCore.Utils = {
        // Calculate distance between two positions
        distance: function(pos1, pos2) {
            const dx = pos1.x - pos2.x;
            const dz = pos1.z - pos2.z;
            return Math.sqrt(dx * dx + dz * dz);
        },

        // Calculate squared distance (faster, no sqrt)
        distanceSquared: function(pos1, pos2) {
            const dx = pos1.x - pos2.x;
            const dz = pos1.z - pos2.z;
            return dx * dx + dz * dz;
        },

        // Calculate direction vector from one position to another
        direction: function(from, to) {
            const dx = to.x - from.x;
            const dz = to.z - from.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist === 0) return { x: 0, z: 0, distance: 0 };
            return { x: dx / dist, z: dz / dist, distance: dist };
        },

        // Normalize angle to -PI to PI range
        normalizeAngle: function(angle) {
            return Math.atan2(Math.sin(angle), Math.cos(angle));
        },

        // Linearly interpolate between angles
        lerpAngle: function(current, target, factor) {
            const diff = this.normalizeAngle(target - current);
            return current + diff * factor;
        },

        // Clamp value between min and max
        clamp: function(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },

        // Random value in range
        randomInRange: function(min, max) {
            return min + Math.random() * (max - min);
        }
    };

    return GameCore;
}));

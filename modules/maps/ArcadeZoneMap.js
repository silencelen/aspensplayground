// ==================== ARCADE ZONE MAP ====================
// Map 2: Arcade area with neon atmosphere (Waves 3-4)
// Arcade cabinets along walls, medium difficulty

class ArcadeZoneMap extends BaseMap {
    constructor() {
        super('arcade_zone', 'Arcade Zone');
        this.arenaWidth = 50;
        this.arenaDepth = 50;
    }

    createContent(scene) {
        // ==================== ARCADE CABINETS ====================
        // Left wall - 4 cabinets with 6-unit spacing
        this.addArcadeCabinet(scene, -22, -12, Math.PI / 2);
        this.addArcadeCabinet(scene, -22, -4, Math.PI / 2);
        this.addArcadeCabinet(scene, -22, 4, Math.PI / 2);
        this.addArcadeCabinet(scene, -22, 12, Math.PI / 2);

        // Right wall - 4 cabinets
        this.addArcadeCabinet(scene, 22, -12, -Math.PI / 2);
        this.addArcadeCabinet(scene, 22, -4, -Math.PI / 2);
        this.addArcadeCabinet(scene, 22, 4, -Math.PI / 2);
        this.addArcadeCabinet(scene, 22, 12, -Math.PI / 2);

        // Back wall - 3 cabinets (facing south)
        this.addArcadeCabinet(scene, -8, -22, 0);
        this.addArcadeCabinet(scene, 0, -22, 0);
        this.addArcadeCabinet(scene, 8, -22, 0);

        // ==================== CENTER ISLANDS ====================
        // Two small cabinet clusters in center - wide apart
        // Left cluster
        this.addArcadeCabinet(scene, -8, -3, Math.PI);
        this.addArcadeCabinet(scene, -8, 3, 0);

        // Right cluster
        this.addArcadeCabinet(scene, 8, -3, Math.PI);
        this.addArcadeCabinet(scene, 8, 3, 0);

        // ==================== PRIZE COUNTER ====================
        // Front counter for tickets/prizes
        this.addBox(scene, 0, 18, 8, 2, 1.2, 0x3a2a1a);

        // Prize shelves behind counter
        this.addBox(scene, 0, 22, 10, 1, 2.5, 0x2a1a1a);

        // ==================== TOKEN MACHINES ====================
        this.addBox(scene, -18, 18, 1.2, 0.8, 1.8, 0x4a4a4a);
        this.addBox(scene, 18, 18, 1.2, 0.8, 1.8, 0x4a4a4a);

        // ==================== PILLARS ====================
        this.addPillar(scene, -15, -15, 0.6);
        this.addPillar(scene, 15, -15, 0.6);
        this.addPillar(scene, -15, 10, 0.6);
        this.addPillar(scene, 15, 10, 0.6);

        // ==================== NEON FLOOR STRIPS ====================
        this.addNeonStrip(scene, -10, 0, 0.3, 30, 0x00ff00);
        this.addNeonStrip(scene, 10, 0, 0.3, 30, 0xff00ff);

        // ==================== SPAWN POINTS ====================
        this.addPlayerSpawn(0, 12);
        this.addPlayerSpawn(-6, 10);
        this.addPlayerSpawn(6, 10);

        // Zombie spawns
        this.addZombieSpawn(-22, -18, Math.PI / 4);
        this.addZombieSpawn(22, -18, -Math.PI / 4);
        this.addZombieSpawn(-22, 0, Math.PI / 2);
        this.addZombieSpawn(22, 0, -Math.PI / 2);
        this.addZombieSpawn(0, -22, 0);
    }

    // Add neon floor strip (decorative)
    addNeonStrip(scene, x, z, width, length, color) {
        const geo = new THREE.PlaneGeometry(width, length);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });
        const strip = new THREE.Mesh(geo, mat);
        strip.rotation.x = -Math.PI / 2;
        strip.position.set(x, 0.01, z);
        scene.add(strip);
        this.meshes.push(strip);
        this.decorations.push(strip);

        // Add glow light
        const light = new THREE.PointLight(color, 0.3, 8);
        light.position.set(x, 0.5, z);
        scene.add(light);
        this.lights.push(light);
    }

    // Override lighting for neon arcade vibe
    createLighting(scene) {
        // Dark ambient
        const ambient = new THREE.AmbientLight(0x050510, 0.2);
        scene.add(ambient);
        this.lights.push(ambient);

        // Neon accent lights
        const neonColors = [0xff0066, 0x00ffff, 0xff00ff, 0x00ff00];
        const positions = [[-15, -10], [15, -10], [-15, 10], [15, 10]];

        positions.forEach((pos, i) => {
            const light = new THREE.PointLight(neonColors[i], 0.7, 18);
            light.position.set(pos[0], 3, pos[1]);
            scene.add(light);
            this.lights.push(light);
        });

        // Center blacklight effect
        const blacklight = new THREE.PointLight(0x6600ff, 0.5, 25);
        blacklight.position.set(0, 5, 0);
        scene.add(blacklight);
        this.lights.push(blacklight);

        // Darker fog
        scene.fog = new THREE.Fog(0x050008, 5, 40);
    }

    // Override walls with darker arcade theme
    createWalls(scene) {
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x0a0510,
            roughness: 0.9
        });

        // Walls
        const walls = [
            { pos: [0, this.wallHeight / 2, -halfD], size: [this.arenaWidth, this.wallHeight, 0.5] },
            { pos: [0, this.wallHeight / 2, halfD], size: [this.arenaWidth, this.wallHeight, 0.5] },
            { pos: [halfW, this.wallHeight / 2, 0], size: [0.5, this.wallHeight, this.arenaDepth] },
            { pos: [-halfW, this.wallHeight / 2, 0], size: [0.5, this.wallHeight, this.arenaDepth] }
        ];

        walls.forEach(wall => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(...wall.size),
                wallMat
            );
            mesh.position.set(...wall.pos);
            scene.add(mesh);
            this.meshes.push(mesh);
        });

        // Dark ceiling
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth),
            new THREE.MeshStandardMaterial({ color: 0x020205, side: THREE.DoubleSide })
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.wallHeight;
        scene.add(ceiling);
        this.meshes.push(ceiling);
    }

    // Override floor with dark carpet
    createFloor(scene) {
        const floorGeo = new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a15,
            roughness: 0.95
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        this.meshes.push(floor);

        // Arena boundaries
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;
        this.obstacles.push({ minX: -halfW - 1, maxX: -halfW, minZ: -halfD, maxZ: halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: halfW, maxX: halfW + 1, minZ: -halfD, maxZ: halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: -halfW, maxX: halfW, minZ: -halfD - 1, maxZ: -halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: -halfW, maxX: halfW, minZ: halfD, maxZ: halfD + 1, maxY: this.wallHeight });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ArcadeZoneMap = ArcadeZoneMap;
}

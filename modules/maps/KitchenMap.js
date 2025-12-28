// ==================== KITCHEN MAP ====================
// Map 4: Kitchen and service area (Waves 7-8)
// Counters, prep stations, L-shaped chokepoints

class KitchenMap extends BaseMap {
    constructor() {
        super('kitchen', 'Kitchen');
        this.arenaWidth = 55;
        this.arenaDepth = 55;
    }

    createContent(scene) {
        // ==================== MAIN PREP LINE (Center) ====================
        // Long stainless steel prep counter
        this.addCounter(scene, 0, -5, 12, 1.5, 1);

        // Prep stations with cutting boards
        this.addPrepStation(scene, -4, -5);
        this.addPrepStation(scene, 4, -5);

        // ==================== COOKING LINE (North) ====================
        // Stoves and ovens along back wall
        this.addStove(scene, -12, -20);
        this.addStove(scene, -4, -20);
        this.addStove(scene, 4, -20);
        this.addStove(scene, 12, -20);

        // Hood vents (visual)
        this.addHoodVent(scene, 0, -20, 28);

        // ==================== WALK-IN COOLER (West) ====================
        // Large refrigeration unit
        this.addBox(scene, -22, -10, 6, 8, 3, 0x8899aa);
        // Door indicator
        this.addBox(scene, -19, -10, 0.2, 2.5, 2.8, 0x444455);

        // ==================== DRY STORAGE (East) ====================
        // Shelving units
        this.addShelf(scene, 22, -15);
        this.addShelf(scene, 22, -5);
        this.addShelf(scene, 22, 5);

        // ==================== DISHWASHING AREA (Southeast) ====================
        this.addCounter(scene, 18, 15, 8, 2, 1);
        this.addSink(scene, 15, 15);
        this.addSink(scene, 21, 15);

        // ==================== SERVING WINDOW (South) ====================
        // Pass-through to dining
        this.addCounter(scene, -8, 20, 10, 1.2, 1.1);
        this.addCounter(scene, 8, 20, 10, 1.2, 1.1);

        // Heat lamps
        this.addHeatLamp(scene, -8, 19);
        this.addHeatLamp(scene, 8, 19);

        // ==================== ISLAND PREP TABLE ====================
        this.addCounter(scene, -12, 8, 5, 3, 0.9);
        this.addCounter(scene, 12, 8, 5, 3, 0.9);

        // ==================== FLOOR DRAINS (decorative) ====================
        this.addFloorDrain(scene, 0, 0);
        this.addFloorDrain(scene, -15, 0);
        this.addFloorDrain(scene, 15, 0);

        // ==================== PILLARS ====================
        this.addPillar(scene, -10, -12, 0.5);
        this.addPillar(scene, 10, -12, 0.5);

        // ==================== SPAWN POINTS ====================
        // Players spawn near serving window
        this.addPlayerSpawn(0, 14);
        this.addPlayerSpawn(-5, 12);
        this.addPlayerSpawn(5, 12);

        // Zombies from multiple entry points
        this.addZombieSpawn(-24, 0, Math.PI / 2);
        this.addZombieSpawn(24, 0, -Math.PI / 2);
        this.addZombieSpawn(-24, -20, Math.PI / 4);
        this.addZombieSpawn(24, -20, -Math.PI / 4);
        this.addZombieSpawn(0, -24, 0);
    }

    // Add stainless steel counter
    addCounter(scene, x, z, width, depth, height) {
        const group = new THREE.Group();

        // Counter top
        const topGeo = new THREE.BoxGeometry(width, 0.08, depth);
        const topMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2
        });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = height;
        group.add(top);

        // Base cabinet
        const baseGeo = new THREE.BoxGeometry(width - 0.1, height - 0.1, depth - 0.1);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.6,
            roughness: 0.4
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = (height - 0.1) / 2;
        group.add(base);

        group.position.set(x, 0, z);
        group.castShadow = true;
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - width / 2,
            maxX: x + width / 2,
            minZ: z - depth / 2,
            maxZ: z + depth / 2,
            maxY: height + 0.1
        });

        return group;
    }

    // Add prep station with cutting board
    addPrepStation(scene, x, z) {
        // Cutting board on counter
        const boardGeo = new THREE.BoxGeometry(0.6, 0.05, 0.4);
        const boardMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.set(x, 1.05, z);
        scene.add(board);
        this.meshes.push(board);
        this.decorations.push(board);
    }

    // Add commercial stove
    addStove(scene, x, z) {
        const group = new THREE.Group();

        // Stove body
        const bodyGeo = new THREE.BoxGeometry(2.5, 1, 1.8);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        group.add(body);

        // Burner grates
        const grateMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        for (let gx = -0.6; gx <= 0.6; gx += 0.6) {
            const grate = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.05, 0.5),
                grateMat
            );
            grate.position.set(gx, 1.02, 0);
            group.add(grate);
        }

        // Knobs
        const knobGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
        const knobMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        for (let kx = -0.8; kx <= 0.8; kx += 0.4) {
            const knob = new THREE.Mesh(knobGeo, knobMat);
            knob.rotation.x = Math.PI / 2;
            knob.position.set(kx, 0.6, 0.92);
            group.add(knob);
        }

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - 1.4,
            maxX: x + 1.4,
            minZ: z - 1,
            maxZ: z + 1,
            maxY: 1.1
        });

        return group;
    }

    // Add hood vent
    addHoodVent(scene, x, z, width) {
        const hoodGeo = new THREE.BoxGeometry(width, 0.6, 2);
        const hoodMat = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.8,
            roughness: 0.2
        });
        const hood = new THREE.Mesh(hoodGeo, hoodMat);
        hood.position.set(x, 4, z);
        scene.add(hood);
        this.meshes.push(hood);
        this.decorations.push(hood);
    }

    // Add storage shelf
    addShelf(scene, x, z) {
        const group = new THREE.Group();

        // Frame
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.6
        });

        // Posts
        const postGeo = new THREE.BoxGeometry(0.08, 2.2, 0.08);
        [[-0.7, -0.5], [-0.7, 0.5], [0.7, -0.5], [0.7, 0.5]].forEach(([px, pz]) => {
            const post = new THREE.Mesh(postGeo, frameMat);
            post.position.set(px, 1.1, pz);
            group.add(post);
        });

        // Shelves with items
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.5 });
        for (let h = 0.4; h <= 2; h += 0.5) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 0.03, 1.1),
                shelfMat
            );
            shelf.position.y = h;
            group.add(shelf);
        }

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - 0.9,
            maxX: x + 0.9,
            minZ: z - 0.7,
            maxZ: z + 0.7,
            maxY: 2.2
        });

        return group;
    }

    // Add sink
    addSink(scene, x, z) {
        const group = new THREE.Group();

        // Basin
        const basinGeo = new THREE.BoxGeometry(1.2, 0.4, 0.8);
        const basinMat = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.9,
            roughness: 0.1
        });
        const basin = new THREE.Mesh(basinGeo, basinMat);
        basin.position.y = 0.85;
        group.add(basin);

        // Faucet
        const faucetGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
        const faucetMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1,
            roughness: 0.1
        });
        const faucet = new THREE.Mesh(faucetGeo, faucetMat);
        faucet.position.set(0, 1.25, -0.3);
        group.add(faucet);

        // Spout
        const spoutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
        const spout = new THREE.Mesh(spoutGeo, faucetMat);
        spout.rotation.x = Math.PI / 2;
        spout.position.set(0, 1.4, -0.15);
        group.add(spout);

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);
        this.decorations.push(group);

        return group;
    }

    // Add heat lamp
    addHeatLamp(scene, x, z) {
        // Lamp fixture
        const lampGeo = new THREE.ConeGeometry(0.3, 0.4, 8, 1, true);
        const lampMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            side: THREE.DoubleSide
        });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(x, 2, z);
        lamp.rotation.x = Math.PI;
        scene.add(lamp);
        this.meshes.push(lamp);
        this.decorations.push(lamp);

        // Warm light
        const light = new THREE.PointLight(0xff6600, 0.5, 6);
        light.position.set(x, 1.7, z);
        scene.add(light);
        this.lights.push(light);
    }

    // Add floor drain (decorative)
    addFloorDrain(scene, x, z) {
        const drainGeo = new THREE.CircleGeometry(0.25, 16);
        const drainMat = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.8
        });
        const drain = new THREE.Mesh(drainGeo, drainMat);
        drain.rotation.x = -Math.PI / 2;
        drain.position.set(x, 0.01, z);
        scene.add(drain);
        this.meshes.push(drain);
        this.decorations.push(drain);
    }

    // Override lighting for bright kitchen
    createLighting(scene) {
        // Bright ambient for commercial kitchen
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambient);
        this.lights.push(ambient);

        // Fluorescent overhead panels
        const panelPositions = [
            [-10, -12], [10, -12], [0, 0], [-10, 10], [10, 10]
        ];
        panelPositions.forEach(([x, z]) => {
            const light = new THREE.RectAreaLight(0xffffff, 2, 3, 1.5);
            light.position.set(x, 5.5, z);
            light.rotation.x = -Math.PI / 2;
            scene.add(light);
            this.lights.push(light);

            // Visual panel
            const panelGeo = new THREE.PlaneGeometry(3, 1.5);
            const panelMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(x, 5.8, z);
            panel.rotation.x = Math.PI / 2;
            scene.add(panel);
            this.meshes.push(panel);
            this.decorations.push(panel);
        });

        // Stove area orange glow
        const stoveGlow = new THREE.PointLight(0xff4400, 0.4, 15);
        stoveGlow.position.set(0, 2, -18);
        scene.add(stoveGlow);
        this.lights.push(stoveGlow);

        // Light fog
        scene.fog = new THREE.Fog(0x181820, 15, 55);
    }

    // Override walls for tiled kitchen look
    createWalls(scene) {
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;

        // White tile walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            roughness: 0.3
        });

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

        // Ceiling
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide })
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.wallHeight;
        scene.add(ceiling);
        this.meshes.push(ceiling);
    }

    // Override floor for kitchen tile
    createFloor(scene) {
        const floorGeo = new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.4,
            metalness: 0.1
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
    window.KitchenMap = KitchenMap;
}

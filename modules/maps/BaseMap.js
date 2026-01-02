// ==================== BASE MAP CLASS ====================
// Base class for all game maps - extend this to create new maps

class BaseMap {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.meshes = [];           // All 3D objects created by this map
        this.obstacles = [];        // Collision bounds for pathfinding
        this.playerSpawns = [];     // Where players can spawn
        this.zombieSpawns = [];     // Where zombies enter from
        this.decorations = [];      // Visual-only objects (no collision)
        this.lights = [];           // Map-specific lights
        this.isCreated = false;

        // Arena dimensions (can be overridden)
        this.arenaWidth = 50;
        this.arenaDepth = 50;
        this.wallHeight = 6;
    }

    // Override this to create your map
    create(scene) {
        if (this.isCreated) {
            console.warn(`[${this.name}] Map already created`);
            return;
        }

        console.log(`[${this.name}] Creating map...`);

        // Create base elements
        this.createFloor(scene);
        this.createWalls(scene);
        this.createLighting(scene);

        // Create map-specific content (override in subclass)
        this.createContent(scene);

        this.isCreated = true;
        console.log(`[${this.name}] Map created with ${this.obstacles.length} obstacles`);
    }

    // Override this to add map-specific content
    createContent(scene) {
        // Override in subclass
    }

    // Destroy map and clean up
    destroy(scene) {
        if (!this.isCreated) return;

        console.log(`[${this.name}] Destroying map...`);

        // Remove all meshes
        this.meshes.forEach(mesh => {
            scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(m => m.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        });

        // Remove lights
        this.lights.forEach(light => {
            scene.remove(light);
        });

        // Clear arrays
        this.meshes = [];
        this.obstacles = [];
        this.lights = [];
        this.decorations = [];
        this.playerSpawns = [];
        this.zombieSpawns = [];

        this.isCreated = false;
        console.log(`[${this.name}] Map destroyed`);
    }

    // Get obstacles for pathfinding
    getObstacles() {
        return this.obstacles;
    }

    // Get player spawn points
    getPlayerSpawns() {
        return this.playerSpawns;
    }

    // Get zombie spawn points
    getZombieSpawns() {
        return this.zombieSpawns;
    }

    // ==================== BASE CREATION METHODS ====================

    // Create floor with checker pattern
    createFloor(scene) {
        const floorGeo = new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x2a1a0a,
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        this.meshes.push(floor);

        // Add floor bounds as unwalkable edges
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;

        // Arena boundaries (outer walls)
        this.obstacles.push({ minX: -halfW - 1, maxX: -halfW, minZ: -halfD, maxZ: halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: halfW, maxX: halfW + 1, minZ: -halfD, maxZ: halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: -halfW, maxX: halfW, minZ: -halfD - 1, maxZ: -halfD, maxY: this.wallHeight });
        this.obstacles.push({ minX: -halfW, maxX: halfW, minZ: halfD, maxZ: halfD + 1, maxY: this.wallHeight });
    }

    // Create arena walls
    createWalls(scene) {
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1a0a0a,
            roughness: 0.8
        });

        // North wall
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.arenaWidth, this.wallHeight, 0.5),
            wallMat
        );
        northWall.position.set(0, this.wallHeight / 2, -halfD);
        scene.add(northWall);
        this.meshes.push(northWall);

        // South wall
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.arenaWidth, this.wallHeight, 0.5),
            wallMat
        );
        southWall.position.set(0, this.wallHeight / 2, halfD);
        scene.add(southWall);
        this.meshes.push(southWall);

        // East wall
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, this.wallHeight, this.arenaDepth),
            wallMat
        );
        eastWall.position.set(halfW, this.wallHeight / 2, 0);
        scene.add(eastWall);
        this.meshes.push(eastWall);

        // West wall
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, this.wallHeight, this.arenaDepth),
            wallMat
        );
        westWall.position.set(-halfW, this.wallHeight / 2, 0);
        scene.add(westWall);
        this.meshes.push(westWall);

        // Ceiling
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth),
            new THREE.MeshStandardMaterial({ color: 0x0a0505, side: THREE.DoubleSide })
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.wallHeight;
        scene.add(ceiling);
        this.meshes.push(ceiling);
    }

    // Create basic lighting
    createLighting(scene) {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x1a0505, 0.3);
        scene.add(ambient);
        this.lights.push(ambient);

        // Main overhead light
        const mainLight = new THREE.PointLight(0xff4400, 1.0, 40);
        mainLight.position.set(0, 5, 0);
        mainLight.castShadow = true;
        scene.add(mainLight);
        this.lights.push(mainLight);

        // Corner lights
        const cornerPositions = [
            [-15, -15], [15, -15], [-15, 15], [15, 15]
        ];
        cornerPositions.forEach(([x, z]) => {
            const light = new THREE.PointLight(0xff4400, 0.6, 20);
            light.position.set(x, 4, z);
            scene.add(light);
            this.lights.push(light);
        });

        // Fog
        scene.fog = new THREE.Fog(0x0a0000, 5, 45);
    }

    // ==================== HELPER METHODS ====================

    // Add a box obstacle with matching visual
    addBox(scene, x, z, width, depth, height, color = 0x4a3a2a) {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, height / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        this.meshes.push(mesh);

        // Add collision - EXACT match to visual
        this.obstacles.push({
            minX: x - width / 2,
            maxX: x + width / 2,
            minZ: z - depth / 2,
            maxZ: z + depth / 2,
            maxY: height
        });

        return mesh;
    }

    // Add a cylinder obstacle with matching visual
    addCylinder(scene, x, z, radius, height, color = 0x4a3a2a) {
        const geo = new THREE.CylinderGeometry(radius, radius, height, 16);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, height / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        this.meshes.push(mesh);

        // Add collision as square (simpler for pathfinding)
        this.obstacles.push({
            minX: x - radius,
            maxX: x + radius,
            minZ: z - radius,
            maxZ: z + radius,
            maxY: height
        });

        return mesh;
    }

    // Add a table (round top with pedestal)
    addTable(scene, x, z, radius = 1.5, height = 0.9) {
        const group = new THREE.Group();

        // Table top
        const topGeo = new THREE.CylinderGeometry(radius, radius, 0.1, 16);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = height;
        group.add(top);

        // Pedestal
        const legGeo = new THREE.CylinderGeometry(0.15, 0.2, height, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.y = height / 2;
        group.add(leg);

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Add collision
        this.obstacles.push({
            minX: x - radius,
            maxX: x + radius,
            minZ: z - radius,
            maxZ: z + radius,
            maxY: height + 0.1
        });

        return group;
    }

    // Add arcade cabinet
    addArcadeCabinet(scene, x, z, rotation = 0) {
        const group = new THREE.Group();

        // Cabinet body
        const bodyGeo = new THREE.BoxGeometry(1.0, 1.9, 0.85);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x2a1a4a,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.95;
        group.add(body);

        // Screen
        const screenGeo = new THREE.PlaneGeometry(0.75, 0.55);
        const screenMat = new THREE.MeshBasicMaterial({
            color: 0x002200,
            transparent: true,
            opacity: 0.95
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 1.35, 0.44);
        group.add(screen);

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        scene.add(group);
        this.meshes.push(group);

        // Add collision (account for rotation)
        const cos = Math.abs(Math.cos(rotation));
        const sin = Math.abs(Math.sin(rotation));
        const hw = 0.6, hd = 0.5;
        this.obstacles.push({
            minX: x - cos * hw - sin * hd,
            maxX: x + cos * hw + sin * hd,
            minZ: z - sin * hw - cos * hd,
            maxZ: z + sin * hw + cos * hd,
            maxY: 1.9
        });

        return group;
    }

    // Add a pillar
    addPillar(scene, x, z, radius = 0.6) {
        const geo = new THREE.CylinderGeometry(radius, radius, this.wallHeight, 12);
        const mat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, this.wallHeight / 2, z);
        mesh.castShadow = true;
        scene.add(mesh);
        this.meshes.push(mesh);

        this.obstacles.push({
            minX: x - radius,
            maxX: x + radius,
            minZ: z - radius,
            maxZ: z + radius,
            maxY: this.wallHeight
        });

        return mesh;
    }

    // Add player spawn point
    addPlayerSpawn(x, z) {
        this.playerSpawns.push({ x, z });
    }

    // Add zombie spawn point (usually at edges)
    addZombieSpawn(x, z, rotation = 0) {
        this.zombieSpawns.push({ x, z, rotation });
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.BaseMap = BaseMap;
}

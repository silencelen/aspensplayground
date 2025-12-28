// ==================== BACKSTAGE MAP ====================
// Map 3: Storage/backstage area (Waves 5-6)
// Crates, equipment, tactical corridors

class BackstageMap extends BaseMap {
    constructor() {
        super('backstage', 'Backstage');
        this.arenaWidth = 55;
        this.arenaDepth = 55;
    }

    createContent(scene) {
        // ==================== LEFT STORAGE SECTION ====================
        // Large shipping crates - stacked arrangement
        this.addCrate(scene, -18, -15, 3, 3, 2.5);
        this.addCrate(scene, -18, -8, 2.5, 2.5, 2);
        this.addCrate(scene, -22, -12, 2, 2, 3);

        // Medium crates left side
        this.addCrate(scene, -20, 5, 2, 3, 1.8);
        this.addCrate(scene, -16, 8, 2.5, 2, 2.2);

        // ==================== RIGHT STORAGE SECTION ====================
        // Mirror crate arrangement
        this.addCrate(scene, 18, -15, 3, 3, 2.5);
        this.addCrate(scene, 18, -8, 2.5, 2.5, 2);
        this.addCrate(scene, 22, -12, 2, 2, 3);

        // Medium crates right side
        this.addCrate(scene, 20, 5, 2, 3, 1.8);
        this.addCrate(scene, 16, 8, 2.5, 2, 2.2);

        // ==================== CENTER CORRIDOR ====================
        // Equipment racks creating center lane
        this.addEquipmentRack(scene, -6, -10, Math.PI / 2);
        this.addEquipmentRack(scene, 6, -10, -Math.PI / 2);

        // Prop storage in center
        this.addCrate(scene, 0, -18, 4, 2, 1.5);

        // ==================== COSTUME RACKS ====================
        this.addCostumeRack(scene, -10, 0);
        this.addCostumeRack(scene, 10, 0);
        this.addCostumeRack(scene, -10, 10);
        this.addCostumeRack(scene, 10, 10);

        // ==================== WORKBENCH AREA (South) ====================
        this.addBox(scene, -8, 18, 5, 1.5, 1, 0x5a4a3a);
        this.addBox(scene, 8, 18, 5, 1.5, 1, 0x5a4a3a);

        // Tool cabinets
        this.addBox(scene, -15, 22, 2, 1, 2.2, 0x3a3a4a);
        this.addBox(scene, 15, 22, 2, 1, 2.2, 0x3a3a4a);

        // ==================== FORKLIFT (decorative obstacle) ====================
        this.addForklift(scene, 0, 8);

        // ==================== PILLARS ====================
        this.addPillar(scene, -12, -18, 0.7);
        this.addPillar(scene, 12, -18, 0.7);
        this.addPillar(scene, -12, 15, 0.7);
        this.addPillar(scene, 12, 15, 0.7);

        // ==================== EMERGENCY LIGHTING ====================
        this.addEmergencyLight(scene, -20, 0);
        this.addEmergencyLight(scene, 20, 0);
        this.addEmergencyLight(scene, 0, -20);

        // ==================== SPAWN POINTS ====================
        // Players spawn near workbench
        this.addPlayerSpawn(0, 15);
        this.addPlayerSpawn(-5, 14);
        this.addPlayerSpawn(5, 14);

        // Zombies from storage areas
        this.addZombieSpawn(-24, -20, Math.PI / 4);
        this.addZombieSpawn(24, -20, -Math.PI / 4);
        this.addZombieSpawn(-24, 10, Math.PI / 3);
        this.addZombieSpawn(24, 10, -Math.PI / 3);
        this.addZombieSpawn(0, -24, 0);
    }

    // Add shipping crate
    addCrate(scene, x, z, width, depth, height) {
        const group = new THREE.Group();

        // Main crate body
        const bodyGeo = new THREE.BoxGeometry(width, height, depth);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = height / 2;
        body.castShadow = true;
        group.add(body);

        // Add wooden slat details
        const slatMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
        for (let i = 0; i < 3; i++) {
            const slat = new THREE.Mesh(
                new THREE.BoxGeometry(width + 0.05, 0.1, 0.15),
                slatMat
            );
            slat.position.set(0, height * 0.2 + i * (height * 0.3), depth / 2);
            group.add(slat);
        }

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - width / 2,
            maxX: x + width / 2,
            minZ: z - depth / 2,
            maxZ: z + depth / 2,
            maxY: height
        });

        return group;
    }

    // Add equipment rack
    addEquipmentRack(scene, x, z, rotation = 0) {
        const group = new THREE.Group();

        // Frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });

        // Vertical posts
        const postGeo = new THREE.BoxGeometry(0.1, 2.2, 0.1);
        [[-0.8, -0.4], [-0.8, 0.4], [0.8, -0.4], [0.8, 0.4]].forEach(([px, pz]) => {
            const post = new THREE.Mesh(postGeo, frameMat);
            post.position.set(px, 1.1, pz);
            group.add(post);
        });

        // Shelves
        const shelfGeo = new THREE.BoxGeometry(1.8, 0.05, 1);
        for (let h = 0.5; h <= 2; h += 0.5) {
            const shelf = new THREE.Mesh(shelfGeo, frameMat);
            shelf.position.y = h;
            group.add(shelf);
        }

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        scene.add(group);
        this.meshes.push(group);

        // Collision (account for rotation)
        const hw = 1.0, hd = 0.6;
        const cos = Math.abs(Math.cos(rotation));
        const sin = Math.abs(Math.sin(rotation));
        this.obstacles.push({
            minX: x - cos * hw - sin * hd,
            maxX: x + cos * hw + sin * hd,
            minZ: z - sin * hw - cos * hd,
            maxZ: z + sin * hw + cos * hd,
            maxY: 2.2
        });

        return group;
    }

    // Add costume rack
    addCostumeRack(scene, x, z) {
        const group = new THREE.Group();

        // Main pole
        const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 1.4;
        group.add(pole);

        // Base
        const baseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 12);
        const base = new THREE.Mesh(baseGeo, poleMat);
        base.position.y = 0.05;
        group.add(base);

        // Hanging costumes (colored boxes)
        const costumeColors = [0x8b0000, 0x4a0080, 0x006400];
        costumeColors.forEach((color, i) => {
            const costume = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 1.2, 0.15),
                new THREE.MeshStandardMaterial({ color })
            );
            costume.position.set(-0.5 + i * 0.5, 1.2, 0);
            group.add(costume);
        });

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);
        this.decorations.push(group);

        // Small collision for base
        this.obstacles.push({
            minX: x - 0.5,
            maxX: x + 0.5,
            minZ: z - 0.5,
            maxZ: z + 0.5,
            maxY: 0.5
        });

        return group;
    }

    // Add forklift obstacle
    addForklift(scene, x, z) {
        const group = new THREE.Group();

        // Body
        const bodyGeo = new THREE.BoxGeometry(1.5, 1.2, 2.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 0.8, 0);
        group.add(body);

        // Mast
        const mastGeo = new THREE.BoxGeometry(0.2, 2.5, 0.2);
        const mastMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const mast = new THREE.Mesh(mastGeo, mastMat);
        mast.position.set(0, 1.5, 1.5);
        group.add(mast);

        // Forks
        const forkGeo = new THREE.BoxGeometry(0.15, 0.1, 1.2);
        const forkMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        [-0.4, 0.4].forEach(fx => {
            const fork = new THREE.Mesh(forkGeo, forkMat);
            fork.position.set(fx, 0.15, 2);
            group.add(fork);
        });

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
        wheelGeo.rotateZ(Math.PI / 2);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        [[-0.8, -0.8], [0.8, -0.8], [-0.5, 0.8], [0.5, 0.8]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.position.set(wx, 0.3, wz);
            group.add(wheel);
        });

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - 1,
            maxX: x + 1,
            minZ: z - 1.5,
            maxZ: z + 2.5,
            maxY: 2.5
        });

        return group;
    }

    // Add emergency light
    addEmergencyLight(scene, x, z) {
        const light = new THREE.PointLight(0xff3300, 0.4, 12);
        light.position.set(x, 3, z);
        scene.add(light);
        this.lights.push(light);

        // Visual fixture
        const fixtureGeo = new THREE.BoxGeometry(0.3, 0.15, 0.15);
        const fixtureMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.8
        });
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.set(x, 3, z);
        scene.add(fixture);
        this.meshes.push(fixture);
        this.decorations.push(fixture);
    }

    // Override lighting for industrial backstage feel
    createLighting(scene) {
        // Dim ambient
        const ambient = new THREE.AmbientLight(0x101520, 0.25);
        scene.add(ambient);
        this.lights.push(ambient);

        // Harsh overhead fluorescent lights
        const lightPositions = [
            [0, -8], [-12, 0], [12, 0], [0, 12]
        ];
        lightPositions.forEach(([x, z]) => {
            const light = new THREE.PointLight(0xccddff, 0.6, 18);
            light.position.set(x, 4.5, z);
            scene.add(light);
            this.lights.push(light);
        });

        // Spot on work area
        const workSpot = new THREE.SpotLight(0xffffcc, 0.8, 20, Math.PI / 5, 0.5);
        workSpot.position.set(0, 5, 20);
        workSpot.target.position.set(0, 0, 18);
        scene.add(workSpot);
        scene.add(workSpot.target);
        this.lights.push(workSpot);

        // Fog for atmosphere
        scene.fog = new THREE.Fog(0x080810, 8, 45);
    }

    // Override walls for industrial look
    createWalls(scene) {
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;

        // Concrete walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x404550,
            roughness: 0.95
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

        // Industrial ceiling with exposed beams
        const ceilingMat = new THREE.MeshStandardMaterial({
            color: 0x202025,
            side: THREE.DoubleSide
        });
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth),
            ceilingMat
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.wallHeight;
        scene.add(ceiling);
        this.meshes.push(ceiling);

        // Ceiling beams
        const beamMat = new THREE.MeshStandardMaterial({ color: 0x2a2a30 });
        for (let i = -20; i <= 20; i += 10) {
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(this.arenaWidth, 0.4, 0.6),
                beamMat
            );
            beam.position.set(0, this.wallHeight - 0.2, i);
            scene.add(beam);
            this.meshes.push(beam);
        }
    }

    // Override floor for concrete look
    createFloor(scene) {
        const floorGeo = new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x3a3a40,
            roughness: 0.85
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
    window.BackstageMap = BackstageMap;
}

// ==================== PARTY ROOM MAP ====================
// Map 5: Party/boss arena (Waves 9+)
// Circular arena, balloons, party tables - boss fight arena

class PartyRoomMap extends BaseMap {
    constructor() {
        super('party_room', 'Party Room');
        this.arenaWidth = 60;
        this.arenaDepth = 60;
    }

    createContent(scene) {
        // ==================== CENTRAL STAGE ====================
        // Raised circular platform in center
        this.addCentralStage(scene, 0, 0, 6);

        // Central pillar/pedestal (boss spawn point)
        this.addCylinder(scene, 0, 0, 1.2, 2.5, 0x4a2a5a);

        // ==================== PARTY TABLES (Circular arrangement) ====================
        // 6 tables in hexagonal pattern around center
        const tableRadius = 14;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * tableRadius;
            const z = Math.sin(angle) * tableRadius;
            this.addPartyTable(scene, x, z);
        }

        // ==================== BALLOON CLUSTERS ====================
        // Decorative balloons at corners
        this.addBalloonCluster(scene, -22, -22);
        this.addBalloonCluster(scene, 22, -22);
        this.addBalloonCluster(scene, -22, 22);
        this.addBalloonCluster(scene, 22, 22);

        // Additional balloon strings
        this.addBalloonCluster(scene, -20, 0);
        this.addBalloonCluster(scene, 20, 0);
        this.addBalloonCluster(scene, 0, -20);
        this.addBalloonCluster(scene, 0, 20);

        // ==================== GIFT PILE DECORATIONS ====================
        this.addGiftPile(scene, -18, -10);
        this.addGiftPile(scene, 18, -10);
        this.addGiftPile(scene, -18, 10);
        this.addGiftPile(scene, 18, 10);

        // ==================== ANIMATRONIC DISPLAY ====================
        // Main stage with animatronics at back
        this.addBox(scene, 0, -24, 16, 5, 1.2, 0x3a2a4a);

        // Animatronic pedestals
        this.addCylinder(scene, -5, -24, 0.8, 2, 0x2a1a3a);
        this.addCylinder(scene, 0, -24, 0.8, 2, 0x2a1a3a);
        this.addCylinder(scene, 5, -24, 0.8, 2, 0x2a1a3a);

        // ==================== CAKE TABLE ====================
        this.addCakeTable(scene, 0, 20);

        // ==================== PILLARS ====================
        // 4 main support pillars
        this.addPillar(scene, -20, -15, 0.8);
        this.addPillar(scene, 20, -15, 0.8);
        this.addPillar(scene, -20, 15, 0.8);
        this.addPillar(scene, 20, 15, 0.8);

        // ==================== BANNER STRINGS ====================
        this.addBannerString(scene, -15, 5, 15, 5);
        this.addBannerString(scene, -15, -5, 15, -5);

        // ==================== SPAWN POINTS ====================
        // Players spawn at edges
        this.addPlayerSpawn(0, 22);
        this.addPlayerSpawn(-10, 20);
        this.addPlayerSpawn(10, 20);

        // Zombie spawns from all directions
        this.addZombieSpawn(-26, 0, Math.PI / 2);
        this.addZombieSpawn(26, 0, -Math.PI / 2);
        this.addZombieSpawn(0, -26, 0);
        this.addZombieSpawn(-20, -20, Math.PI / 4);
        this.addZombieSpawn(20, -20, -Math.PI / 4);
        this.addZombieSpawn(-20, 20, 3 * Math.PI / 4);
        this.addZombieSpawn(20, 20, -3 * Math.PI / 4);
    }

    // Add raised central stage
    addCentralStage(scene, x, z, radius) {
        // Stage platform
        const stageGeo = new THREE.CylinderGeometry(radius, radius + 0.5, 0.4, 24);
        const stageMat = new THREE.MeshStandardMaterial({
            color: 0x5a3a6a,
            roughness: 0.6
        });
        const stage = new THREE.Mesh(stageGeo, stageMat);
        stage.position.set(x, 0.2, z);
        scene.add(stage);
        this.meshes.push(stage);

        // Glowing edge ring
        const ringGeo = new THREE.TorusGeometry(radius, 0.1, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, 0.45, z);
        scene.add(ring);
        this.meshes.push(ring);
        this.decorations.push(ring);

        // Stage light
        const light = new THREE.PointLight(0xff00ff, 0.6, 15);
        light.position.set(x, 0.5, z);
        scene.add(light);
        this.lights.push(light);
    }

    // Add party table with tablecloth
    addPartyTable(scene, x, z) {
        const group = new THREE.Group();

        // Table top with cloth
        const clothGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.1, 16);
        const clothMat = new THREE.MeshStandardMaterial({
            color: 0xff4488,
            roughness: 0.8
        });
        const cloth = new THREE.Mesh(clothGeo, clothMat);
        cloth.position.y = 0.85;
        group.add(cloth);

        // Table base
        const baseGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x2a1a1a });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.4;
        group.add(base);

        // Party items on table
        this.addPartyPlate(group, -0.5, 0.9, 0);
        this.addPartyPlate(group, 0.5, 0.9, 0);
        this.addPartyPlate(group, 0, 0.9, 0.5);

        // Party hat decoration
        const hatGeo = new THREE.ConeGeometry(0.15, 0.35, 8);
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const hat = new THREE.Mesh(hatGeo, hatMat);
        hat.position.set(0, 1.1, -0.3);
        group.add(hat);

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - 1.8,
            maxX: x + 1.8,
            minZ: z - 1.8,
            maxZ: z + 1.8,
            maxY: 1
        });

        return group;
    }

    // Add party plate
    addPartyPlate(parent, x, y, z) {
        const plateGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 12);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.set(x, y, z);
        parent.add(plate);
    }

    // Add balloon cluster
    addBalloonCluster(scene, x, z) {
        const group = new THREE.Group();
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

        colors.forEach((color, i) => {
            const balloon = new THREE.Group();

            // Balloon body
            const balloonGeo = new THREE.SphereGeometry(0.4, 12, 12);
            balloonGeo.scale(1, 1.3, 1);
            const balloonMat = new THREE.MeshStandardMaterial({
                color,
                roughness: 0.3,
                metalness: 0.1
            });
            const balloonMesh = new THREE.Mesh(balloonGeo, balloonMat);
            balloon.add(balloonMesh);

            // String
            const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 2, 4);
            const stringMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
            const string = new THREE.Mesh(stringGeo, stringMat);
            string.position.y = -1.5;
            balloon.add(string);

            // Position in cluster
            const offsetX = (Math.random() - 0.5) * 1.5;
            const offsetZ = (Math.random() - 0.5) * 1.5;
            const offsetY = 4 + Math.random() * 1;
            balloon.position.set(offsetX, offsetY, offsetZ);

            group.add(balloon);
        });

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);
        this.decorations.push(group);

        return group;
    }

    // Add gift pile
    addGiftPile(scene, x, z) {
        const group = new THREE.Group();
        const giftColors = [0xff0000, 0x00aa00, 0x0000ff, 0xffaa00];

        // Stack of gift boxes
        const positions = [
            { pos: [0, 0.3, 0], size: [0.8, 0.6, 0.8] },
            { pos: [0.3, 0.8, 0.2], size: [0.5, 0.4, 0.5] },
            { pos: [-0.25, 0.65, -0.15], size: [0.6, 0.5, 0.55] }
        ];

        positions.forEach((gift, i) => {
            const giftGeo = new THREE.BoxGeometry(...gift.size);
            const giftMat = new THREE.MeshStandardMaterial({
                color: giftColors[i % giftColors.length],
                roughness: 0.5
            });
            const giftMesh = new THREE.Mesh(giftGeo, giftMat);
            giftMesh.position.set(...gift.pos);
            group.add(giftMesh);

            // Ribbon
            const ribbonGeo = new THREE.BoxGeometry(gift.size[0] + 0.05, 0.08, 0.08);
            const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
            const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
            ribbon.position.set(gift.pos[0], gift.pos[1], gift.pos[2]);
            group.add(ribbon);
        });

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Small collision area
        this.obstacles.push({
            minX: x - 0.8,
            maxX: x + 0.8,
            minZ: z - 0.8,
            maxZ: z + 0.8,
            maxY: 1.2
        });

        return group;
    }

    // Add cake table
    addCakeTable(scene, x, z) {
        const group = new THREE.Group();

        // Table
        const tableGeo = new THREE.BoxGeometry(4, 1, 2);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a });
        const table = new THREE.Mesh(tableGeo, tableMat);
        table.position.y = 0.5;
        group.add(table);

        // Tablecloth
        const clothGeo = new THREE.BoxGeometry(4.2, 0.05, 2.2);
        const clothMat = new THREE.MeshStandardMaterial({ color: 0xff88aa });
        const cloth = new THREE.Mesh(clothGeo, clothMat);
        cloth.position.y = 1.02;
        group.add(cloth);

        // Birthday cake
        this.addBirthdayCake(group, 0, 1.1, 0);

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);

        // Collision
        this.obstacles.push({
            minX: x - 2.2,
            maxX: x + 2.2,
            minZ: z - 1.2,
            maxZ: z + 1.2,
            maxY: 1.5
        });

        return group;
    }

    // Add birthday cake
    addBirthdayCake(parent, x, y, z) {
        const cakeGroup = new THREE.Group();

        // Bottom tier
        const tier1Geo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
        const cakeMat = new THREE.MeshStandardMaterial({ color: 0xffc0cb });
        const tier1 = new THREE.Mesh(tier1Geo, cakeMat);
        tier1.position.y = 0.2;
        cakeGroup.add(tier1);

        // Top tier
        const tier2Geo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const tier2 = new THREE.Mesh(tier2Geo, cakeMat);
        tier2.position.y = 0.55;
        cakeGroup.add(tier2);

        // Candles
        const candleMat = new THREE.MeshStandardMaterial({ color: 0xffff88 });
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const cx = Math.cos(angle) * 0.25;
            const cz = Math.sin(angle) * 0.25;

            const candle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 0.15, 6),
                candleMat
            );
            candle.position.set(cx, 0.8, cz);
            cakeGroup.add(candle);

            const flame = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 6, 6),
                flameMat
            );
            flame.position.set(cx, 0.9, cz);
            cakeGroup.add(flame);
        }

        cakeGroup.position.set(x, y, z);
        parent.add(cakeGroup);
    }

    // Add banner string between two points
    addBannerString(scene, x1, z1, x2, z2) {
        const group = new THREE.Group();
        const bannerColors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0xff00ff];
        const segments = 8;

        for (let i = 0; i < segments; i++) {
            const t = i / (segments - 1);
            const x = x1 + (x2 - x1) * t;
            const z = z1 + (z2 - z1) * t;
            // Catenary curve
            const sag = Math.sin(t * Math.PI) * 0.8;
            const y = 4.5 - sag;

            const flagGeo = new THREE.PlaneGeometry(0.4, 0.5);
            const flagMat = new THREE.MeshBasicMaterial({
                color: bannerColors[i % bannerColors.length],
                side: THREE.DoubleSide
            });
            const flag = new THREE.Mesh(flagGeo, flagMat);
            flag.position.set(x, y, z);
            flag.rotation.y = Math.atan2(x2 - x1, z2 - z1);
            group.add(flag);
        }

        scene.add(group);
        this.meshes.push(group);
        this.decorations.push(group);
    }

    // Override lighting for party atmosphere
    createLighting(scene) {
        // Purple ambient
        const ambient = new THREE.AmbientLight(0x2a1a3a, 0.35);
        scene.add(ambient);
        this.lights.push(ambient);

        // Colorful disco lights
        const discoColors = [0xff0066, 0x00ff66, 0x6600ff, 0xffff00];
        const discoPositions = [[-12, -12], [12, -12], [-12, 12], [12, 12]];

        discoPositions.forEach((pos, i) => {
            const light = new THREE.SpotLight(discoColors[i], 1.2, 30, Math.PI / 4, 0.5);
            light.position.set(pos[0], 5.5, pos[1]);
            light.target.position.set(0, 0, 0);
            scene.add(light);
            scene.add(light.target);
            this.lights.push(light);
        });

        // Stage spotlight
        const stageSpot = new THREE.SpotLight(0xffffff, 1.5, 35, Math.PI / 5, 0.3);
        stageSpot.position.set(0, 6, -18);
        stageSpot.target.position.set(0, 1, -24);
        scene.add(stageSpot);
        scene.add(stageSpot.target);
        this.lights.push(stageSpot);

        // Center overhead
        const centerLight = new THREE.PointLight(0xff44ff, 0.8, 25);
        centerLight.position.set(0, 5, 0);
        scene.add(centerLight);
        this.lights.push(centerLight);

        // Fog for atmosphere
        scene.fog = new THREE.Fog(0x0a0510, 10, 50);
    }

    // Override walls for party room
    createWalls(scene) {
        const halfW = this.arenaWidth / 2;
        const halfD = this.arenaDepth / 2;

        // Dark purple walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1a0a1a,
            roughness: 0.85
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

        // Ceiling with stars
        const ceilingMat = new THREE.MeshStandardMaterial({
            color: 0x050510,
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

        // Disco ball
        this.addDiscoBall(scene, 0, 5.5, 0);
    }

    // Add disco ball
    addDiscoBall(scene, x, y, z) {
        const ballGeo = new THREE.IcosahedronGeometry(0.5, 1);
        const ballMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1,
            roughness: 0.1,
            envMapIntensity: 2
        });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(x, y, z);
        scene.add(ball);
        this.meshes.push(ball);
        this.decorations.push(ball);

        // Chain
        const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6);
        const chainMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const chain = new THREE.Mesh(chainGeo, chainMat);
        chain.position.set(x, y + 0.6, z);
        scene.add(chain);
        this.meshes.push(chain);
        this.decorations.push(chain);
    }

    // Override floor for party carpet
    createFloor(scene) {
        const floorGeo = new THREE.PlaneGeometry(this.arenaWidth, this.arenaDepth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x2a1a2a,
            roughness: 0.9
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
    window.PartyRoomMap = PartyRoomMap;
}

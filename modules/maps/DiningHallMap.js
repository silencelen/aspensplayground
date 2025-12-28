// ==================== DINING HALL MAP ====================
// Map 1: Open dining area - beginner friendly (Waves 1-2)
// Wide open spaces with minimal cover, easy for zombies to navigate

class DiningHallMap extends BaseMap {
    constructor() {
        super('dining_hall', 'Dining Hall');
        this.arenaWidth = 50;
        this.arenaDepth = 50;
    }

    createContent(scene) {
        // ==================== TABLES ====================
        // 4 tables in a diamond pattern - wide spacing (8+ units apart)
        this.addTable(scene, -8, -8, 1.5, 0.9);   // Northwest
        this.addTable(scene, 8, -8, 1.5, 0.9);    // Northeast
        this.addTable(scene, -8, 8, 1.5, 0.9);    // Southwest
        this.addTable(scene, 8, 8, 1.5, 0.9);     // Southeast

        // ==================== CORNER PILLARS ====================
        // Structural pillars - well away from center
        this.addPillar(scene, -18, -18, 0.8);
        this.addPillar(scene, 18, -18, 0.8);
        this.addPillar(scene, -18, 18, 0.8);
        this.addPillar(scene, 18, 18, 0.8);

        // ==================== STAGE AREA (North) ====================
        // Simple raised platform at the back
        this.addBox(scene, 0, -20, 12, 4, 0.8, 0x2a1a2a);

        // Animatronic pedestals on stage
        this.addCylinder(scene, -4, -20, 0.5, 1.5, 0x1a1a1a);
        this.addCylinder(scene, 0, -20, 0.5, 1.5, 0x1a1a1a);
        this.addCylinder(scene, 4, -20, 0.5, 1.5, 0x1a1a1a);

        // ==================== COUNTER (South) ====================
        // Simple service counter
        this.addBox(scene, 0, 20, 10, 1.5, 1.2, 0x4a3a2a);

        // ==================== DECORATIVE LIGHTS ====================
        // Add some hanging light fixtures (visual only, no collision)
        this.addHangingLight(scene, 0, 0);
        this.addHangingLight(scene, -12, 0);
        this.addHangingLight(scene, 12, 0);

        // ==================== SPAWN POINTS ====================
        // Player spawns in center-south area
        this.addPlayerSpawn(0, 12);
        this.addPlayerSpawn(-5, 12);
        this.addPlayerSpawn(5, 12);

        // Zombie spawns from edges
        this.addZombieSpawn(-22, 0, Math.PI / 2);     // West
        this.addZombieSpawn(22, 0, -Math.PI / 2);     // East
        this.addZombieSpawn(0, -22, 0);               // North (behind stage)
        this.addZombieSpawn(-15, -22, 0);             // North-West
        this.addZombieSpawn(15, -22, 0);              // North-East
    }

    // Add a decorative hanging light (no collision)
    addHangingLight(scene, x, z) {
        const group = new THREE.Group();

        // Chain
        const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6);
        const chainMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const chain = new THREE.Mesh(chainGeo, chainMat);
        chain.position.y = 5.25;
        group.add(chain);

        // Fixture
        const fixtureGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.3, 8);
        const fixtureMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            emissive: 0xff2200,
            emissiveIntensity: 0.3
        });
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.y = 4.5;
        group.add(fixture);

        // Light
        const light = new THREE.PointLight(0xff4400, 0.8, 15);
        light.position.y = 4.3;
        group.add(light);
        this.lights.push(light);

        group.position.set(x, 0, z);
        scene.add(group);
        this.meshes.push(group);
        this.decorations.push(group);
    }

    // Override lighting for warmer dining atmosphere
    createLighting(scene) {
        // Warmer ambient
        const ambient = new THREE.AmbientLight(0x2a1505, 0.35);
        scene.add(ambient);
        this.lights.push(ambient);

        // Warm overhead lights
        const mainLight = new THREE.PointLight(0xffaa44, 1.2, 45);
        mainLight.position.set(0, 5, 0);
        mainLight.castShadow = true;
        scene.add(mainLight);
        this.lights.push(mainLight);

        // Stage spotlight
        const stageSpot = new THREE.SpotLight(0xff0000, 1.0, 30, Math.PI / 6, 0.5);
        stageSpot.position.set(0, 5, -15);
        stageSpot.target.position.set(0, 0, -20);
        scene.add(stageSpot);
        scene.add(stageSpot.target);
        this.lights.push(stageSpot);

        // Atmospheric fog
        scene.fog = new THREE.Fog(0x0a0500, 8, 50);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.DiningHallMap = DiningHallMap;
}

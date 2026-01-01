/**
 * Icon Generation Script
 *
 * Generates all required icon sizes for Windows, macOS, and Linux
 * from a source PNG image (1024x1024 recommended).
 *
 * Usage: node scripts/generate-icons.js [source-image.png]
 *
 * Requires: sharp (npm install sharp)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = process.argv[2] || path.join(__dirname, '..', 'resources', 'icon-source.png');
const RESOURCES_DIR = path.join(__dirname, '..', 'resources');
const ICONS_DIR = path.join(RESOURCES_DIR, 'icons');

// Icon sizes needed for different platforms
const ICON_SIZES = {
    // Linux icons (individual PNGs)
    linux: [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024],
    // Windows ICO needs these sizes embedded
    windows: [16, 24, 32, 48, 64, 128, 256],
    // macOS ICNS needs these sizes
    mac: [16, 32, 64, 128, 256, 512, 1024]
};

async function generateIcons() {
    // Check if source image exists
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.log(`
Icon source image not found: ${SOURCE_IMAGE}

Please create a 1024x1024 PNG icon and save it as:
  ${path.join(RESOURCES_DIR, 'icon-source.png')}

The icon should:
- Be 1024x1024 pixels (square)
- Have a transparent background (or solid color)
- Be a PNG file with alpha channel
- Represent the game (zombie theme recommended)
        `);

        // Create a placeholder icon
        console.log('Creating placeholder icon...');
        await createPlaceholderIcon();
        return;
    }

    // Ensure directories exist
    if (!fs.existsSync(ICONS_DIR)) {
        fs.mkdirSync(ICONS_DIR, { recursive: true });
    }

    console.log('Generating icons from:', SOURCE_IMAGE);

    // Generate Linux icons
    console.log('\nGenerating Linux icons...');
    for (const size of ICON_SIZES.linux) {
        const outputPath = path.join(ICONS_DIR, `${size}x${size}.png`);
        await sharp(SOURCE_IMAGE)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`  Created: ${size}x${size}.png`);
    }

    // Copy main icon sizes to resources root
    await sharp(SOURCE_IMAGE)
        .resize(256, 256)
        .png()
        .toFile(path.join(RESOURCES_DIR, 'icon.png'));
    console.log('\nCreated: icon.png (256x256)');

    console.log(`
Icon generation complete!

Note: For Windows (.ico) and macOS (.icns) icons, you'll need to
convert the PNG manually or use online tools:

Windows ICO:
  - Use https://convertico.com/ or similar
  - Upload the 256x256 icon.png
  - Download as icon.ico
  - Save to: ${path.join(RESOURCES_DIR, 'icon.ico')}

macOS ICNS:
  - On macOS, use: iconutil -c icns icon.iconset
  - Or use https://cloudconvert.com/png-to-icns
  - Save to: ${path.join(RESOURCES_DIR, 'icon.icns')}

DMG Background (optional):
  - Create a 540x400 image for the macOS installer background
  - Save to: ${path.join(RESOURCES_DIR, 'dmg-background.png')}
    `);
}

async function createPlaceholderIcon() {
    // Create a simple placeholder icon with a zombie emoji style
    const size = 1024;
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2d1a1a"/>
                <stop offset="100%" style="stop-color:#1a0a0a"/>
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Background -->
        <rect width="${size}" height="${size}" rx="200" fill="url(#bg)"/>

        <!-- Blood splatter accents -->
        <circle cx="200" cy="150" r="80" fill="#8b0000" opacity="0.3"/>
        <circle cx="850" cy="800" r="100" fill="#8b0000" opacity="0.3"/>

        <!-- Main "AP" text -->
        <text x="512" y="600"
              font-family="Impact, Arial Black, sans-serif"
              font-size="500"
              font-weight="bold"
              text-anchor="middle"
              fill="#cc0000"
              filter="url(#glow)">AP</text>

        <!-- Zombie claw marks -->
        <g stroke="#660000" stroke-width="30" stroke-linecap="round" opacity="0.6">
            <line x1="100" y1="100" x2="250" y2="300"/>
            <line x1="180" y1="80" x2="330" y2="280"/>
            <line x1="260" y1="60" x2="410" y2="260"/>
        </g>
    </svg>`;

    if (!fs.existsSync(RESOURCES_DIR)) {
        fs.mkdirSync(RESOURCES_DIR, { recursive: true });
    }
    if (!fs.existsSync(ICONS_DIR)) {
        fs.mkdirSync(ICONS_DIR, { recursive: true });
    }

    // Save SVG and convert to PNG
    const svgPath = path.join(RESOURCES_DIR, 'icon-source.svg');
    fs.writeFileSync(svgPath, svg);

    await sharp(Buffer.from(svg))
        .resize(1024, 1024)
        .png()
        .toFile(path.join(RESOURCES_DIR, 'icon-source.png'));

    await sharp(Buffer.from(svg))
        .resize(256, 256)
        .png()
        .toFile(path.join(RESOURCES_DIR, 'icon.png'));

    // Generate Linux icon sizes
    for (const iconSize of [16, 32, 48, 64, 128, 256, 512]) {
        await sharp(Buffer.from(svg))
            .resize(iconSize, iconSize)
            .png()
            .toFile(path.join(ICONS_DIR, `${iconSize}x${iconSize}.png`));
    }

    console.log('Placeholder icons created!');
    console.log('Replace icon-source.png with your actual game icon.');
}

generateIcons().catch(console.error);

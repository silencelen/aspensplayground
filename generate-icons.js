const sharp = require('sharp');
const path = require('path');

// Create iOS app icon (180x180)
async function generateIcons() {
    const size = 180;

    // Create SVG with game-themed design
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2a0a1a"/>
                <stop offset="100%" style="stop-color:#1a0a0a"/>
            </linearGradient>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6666"/>
                <stop offset="100%" style="stop-color:#cc0000"/>
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Background -->
        <rect width="${size}" height="${size}" fill="url(#bg)" rx="20"/>

        <!-- Border glow -->
        <rect x="4" y="4" width="${size-8}" height="${size-8}" fill="none" stroke="#ff0000" stroke-width="2" rx="16" opacity="0.5"/>

        <!-- Zombie silhouette/claw marks -->
        <g opacity="0.3" fill="#ff0000">
            <path d="M 30 140 L 50 80 L 40 140" />
            <path d="M 50 140 L 70 70 L 60 140" />
            <path d="M 70 140 L 90 75 L 80 140" />
        </g>

        <!-- Main text: AP -->
        <text x="90" y="105" font-family="Impact, Arial Black, sans-serif" font-size="72" font-weight="bold" fill="url(#textGrad)" text-anchor="middle" filter="url(#glow)">AP</text>

        <!-- Subtitle -->
        <text x="90" y="145" font-family="Arial, sans-serif" font-size="16" fill="#888888" text-anchor="middle">PLAYGROUND</text>

        <!-- Crosshair accent -->
        <g stroke="#ff4444" stroke-width="2" opacity="0.6">
            <line x1="150" y1="30" x2="150" y2="50"/>
            <line x1="140" y1="40" x2="160" y2="40"/>
            <circle cx="150" cy="40" r="8" fill="none"/>
        </g>
    </svg>`;

    try {
        // Generate 180x180 iOS icon
        await sharp(Buffer.from(svg))
            .png()
            .toFile(path.join(__dirname, 'apple-touch-icon.png'));

        console.log('Generated: apple-touch-icon.png (180x180)');

        // Generate 192x192 for Android/PWA
        await sharp(Buffer.from(svg.replace(/180/g, '192')))
            .resize(192, 192)
            .png()
            .toFile(path.join(__dirname, 'icon-192.png'));

        console.log('Generated: icon-192.png (192x192)');

        // Generate 512x512 for PWA
        const svg512 = svg.replace(/180/g, '512')
            .replace(/font-size="72"/g, 'font-size="200"')
            .replace(/font-size="16"/g, 'font-size="45"')
            .replace(/y="105"/g, 'y="290"')
            .replace(/y="145"/g, 'y="400"')
            .replace(/x="90"/g, 'x="256"')
            .replace(/rx="20"/g, 'rx="56"')
            .replace(/rx="16"/g, 'rx="45"')
            .replace(/x="4" y="4"/g, 'x="11" y="11"')
            .replace(/width="172" height="172"/g, 'width="490" height="490"')
            .replace(/stdDeviation="3"/g, 'stdDeviation="8"')
            .replace(/M 30 140 L 50 80 L 40 140/g, 'M 85 400 L 142 227 L 114 400')
            .replace(/M 50 140 L 70 70 L 60 140/g, 'M 142 400 L 199 199 L 170 400')
            .replace(/M 70 140 L 90 75 L 80 140/g, 'M 199 400 L 256 213 L 227 400')
            .replace(/x1="150" y1="30" x2="150" y2="50"/g, 'x1="426" y1="85" x2="426" y2="142"')
            .replace(/x1="140" y1="40" x2="160" y2="40"/g, 'x1="398" y1="114" x2="455" y2="114"')
            .replace(/cx="150" cy="40" r="8"/g, 'cx="426" cy="114" r="23"');

        await sharp(Buffer.from(svg512))
            .png()
            .toFile(path.join(__dirname, 'icon-512.png'));

        console.log('Generated: icon-512.png (512x512)');

        console.log('\nAll icons generated successfully!');
    } catch (err) {
        console.error('Error generating icons:', err);
        process.exit(1);
    }
}

generateIcons();

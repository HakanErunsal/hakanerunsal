const sharp = require("sharp");
const path = require("path");

async function generate() {
    const width = 1200;
    const height = 630;

    const svgOverlay = [
        '<svg width="' + width + '" height="' + height + '" xmlns="http://www.w3.org/2000/svg">',
        '  <defs>',
        '    <radialGradient id="glow" cx="50%" cy="0%" r="70%">',
        '      <stop offset="0%" stop-color="rgba(79,168,142,0.18)" />',
        '      <stop offset="100%" stop-color="rgba(0,0,0,0)" />',
        '    </radialGradient>',
        '    <linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%">',
        '      <stop offset="0%" stop-color="#101318" />',
        '      <stop offset="50%" stop-color="#161b22" />',
        '      <stop offset="100%" stop-color="#101318" />',
        '    </linearGradient>',
        '  </defs>',
        '  <rect width="' + width + '" height="' + height + '" fill="url(#bg)" />',
        '  <rect width="' + width + '" height="' + height + '" fill="url(#glow)" />',
        '',
        '  <rect x="64" y="180" width="72" height="72" rx="16" fill="rgba(79,168,142,0.12)" stroke="rgba(79,168,142,0.25)" stroke-width="1" />',
        '  <text x="100" y="233" text-anchor="middle" fill="#4fa88e" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="700">H</text>',
        '',
        '  <text x="64" y="310" fill="white" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="700" letter-spacing="-1">Hakan Erunsal</text>',
        '',
        '  <text x="64" y="360" fill="#8b919a" font-family="Inter, system-ui, sans-serif" font-size="22">Game Developer &amp; Software Engineer specializing in Unreal Engine.</text>',
        '  <text x="64" y="390" fill="#8b919a" font-family="Inter, system-ui, sans-serif" font-size="22">Portfolio of mobile shooter games and technical articles.</text>',
        '',
        '  <line x1="64" y1="545" x2="1136" y2="545" stroke="rgba(255,255,255,0.08)" stroke-width="1" />',
        '  <text x="64" y="580" fill="#4fa88e" font-family="Inter, system-ui, sans-serif" font-size="18">https://hakanerunsal.com</text>',
        '  <text x="1136" y="580" text-anchor="end" fill="#555b64" font-family="Inter, system-ui, sans-serif" font-size="18">Game Developer &amp; Software Engineer</text>',
        '</svg>',
    ].join("\n");

    await sharp(Buffer.from(svgOverlay))
        .png()
        .toFile(path.join(__dirname, "..", "app", "opengraph-image.png"));

    console.log("Generated opengraph-image.png");
}

generate().catch(console.error);

const sharp = require("sharp");
const path = require("path");

async function generate() {
  const width = 1200;
  const height = 630;
  const logoSize = 340;
  const logoOpacity = 0.07; // very subtle watermark

  // Load elephant logo and make it a ghost watermark
  // Extract alpha channel, tint it to a subtle color, then reduce opacity
  const logoRaw = await sharp(path.join(__dirname, "..", "public", "logos", "H_Logo.png"))
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Manually reduce alpha of every pixel to get true opacity control
  const { data, info } = logoRaw;
  const ghostBuf = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    // Tint towards the accent teal color
    ghostBuf[i] = Math.round(data[i] * 0.5 + 79 * 0.5);     // R blend with teal
    ghostBuf[i + 1] = Math.round(data[i + 1] * 0.5 + 168 * 0.5); // G
    ghostBuf[i + 2] = Math.round(data[i + 2] * 0.5 + 142 * 0.5); // B
    ghostBuf[i + 3] = Math.round(data[i + 3] * logoOpacity); // A - dramatically reduce
  }

  const ghostLogo = await sharp(ghostBuf, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // Dark background
  const bg = await sharp({
    create: {
      width, height, channels: 4,
      background: { r: 13, g: 17, b: 23, alpha: 255 } // #0d1117
    }
  }).png().toBuffer();

  // SVG overlay with text
  const svgText = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Subtle gradient overlay -->
    <defs>
      <linearGradient id="shine" x1="0" y1="0" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.02)" />
        <stop offset="50%" stop-color="rgba(255,255,255,0)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.01)" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#shine)" />

    <!-- Accent line at top -->
    <rect x="80" y="0" width="100" height="3" rx="1.5" fill="#4fa88e" opacity="0.7" />

    <!-- Name -->
    <text x="80" y="270" fill="#e6edf3" font-family="Segoe UI, system-ui, sans-serif" font-size="54" font-weight="700" letter-spacing="-1">Hakan Erunsal</text>

    <!-- Description -->
    <text x="80" y="320" fill="#7d8590" font-family="Segoe UI, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="0.3">Game Developer &amp; Software Engineer specializing in Unreal Engine.</text>

    <!-- Second line -->
    <text x="80" y="368" fill="#7d8590" font-family="Segoe UI, system-ui, sans-serif" font-size="22" font-weight="400" letter-spacing="0.3">Portfolio of plugins, games and technical articles.</text>

    <!-- Thin separator -->
    <line x1="80" y1="540" x2="400" y2="540" stroke="#21262d" stroke-width="1" />

    <!-- URL -->
    <text x="80" y="572" fill="#484f58" font-family="Segoe UI, system-ui, sans-serif" font-size="15" letter-spacing="0.8">hakanerunsal.com</text>
  </svg>`;

  // Compose: background + ghost logo + text
  await sharp(bg)
    .composite([
      {
        input: ghostLogo,
        top: 145,
        left: 790,
        blend: "over",
      },
      {
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
        blend: "over",
      },
    ])
    .png()
    .toFile(path.join(__dirname, "..", "app", "opengraph-image.png"));

  console.log("Generated opengraph-image.png (1200x630)");
}

generate().catch(console.error);

/** @type {import('next').NextConfig} */
module.exports = {
  // Static HTML export to out/. Previously injected by the GitHub Pages
  // configure-pages action; stated here so any host produces the same build.
  output: 'export',

  // Image optimization
  images: {
    // No image server in a static export; sources are served as authored.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,
  
  // React strict mode for better development
  reactStrictMode: true,
  
  // Webpack configuration
  webpack: (config, { dev }) => {
    config.plugins.push(new VeliteWebpackPlugin())

    // Ensure Velite output changes trigger a recompile (content MDX edits)
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**'],
        aggregateTimeout: 300,
      }
    }

    return config
  }
}

class VeliteWebpackPlugin {
  /** Shared across server/client/edge compilers — all must await Velite */
  static veliteReady = null

  constructor(/** @type {import('velite').Options} */ options = {}) {
    this.options = options
  }

  apply(/** @type {import('webpack').Compiler} */ compiler) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (!VeliteWebpackPlugin.veliteReady) {
        VeliteWebpackPlugin.veliteReady = (async () => {
          const dev = compiler.options.mode === 'development'
          this.options.watch = this.options.watch ?? dev
          this.options.clean = this.options.clean ?? !dev
          const { build } = await import('velite')
          await build(this.options)
        })()
      }

      await VeliteWebpackPlugin.veliteReady
    })
  }
}
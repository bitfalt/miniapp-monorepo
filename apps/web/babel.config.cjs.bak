// Check if we're in a Next.js environment
const isNextJs = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production';

// Only apply these presets for Jest/testing environments
module.exports = !isNextJs ? {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
} : {
  // For Next.js, use minimal config that doesn't interfere with SWC
  presets: []
}; 
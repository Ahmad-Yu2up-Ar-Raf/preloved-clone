// metro.config.js - ADD THIS TO YOUR PROJECT ROOT

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// ✅ Fix for TanStack Query Metro bundler issue
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// ✅ Additional resolver config
config.resolver = {
  ...config.resolver,
  // Handle .js files as ES modules
  unstable_enablePackageExports: true,
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });


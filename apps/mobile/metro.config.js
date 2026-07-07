const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// pnpm doesn't hoist `react-native-css-interop` (a transitive dep of nativewind)
// to the root node_modules, but NativeWind's `jsxImportSource` injects a bare
// `react-native-css-interop/jsx-runtime` import into every file. Map it so Metro
// can resolve it on both native and web.
const nativewindDir = path.dirname(require.resolve('nativewind/package.json'));
const cssInteropDir = path.dirname(
  require.resolve('react-native-css-interop/package.json', { paths: [nativewindDir] }),
);
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-native-css-interop': cssInteropDir,
};

module.exports = withNativeWind(config, { input: './global.css' });

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React Native'in JS engine performansını artırma
      'react-native-reanimated/plugin',
      
      // Hermes optimizasyonları
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic',
      }],
      
      // Native thread güvenliği için
      ['module-resolver', {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './components',
          '@assets': './assets',
          '@constants': './constants',
          '@app': './app',
        },
      }],
      
      // Native hataları azaltmak için async/await optimizasyonu
      '@babel/plugin-transform-async-to-generator'
    ],
  };
}; 
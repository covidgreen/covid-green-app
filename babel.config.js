const alias = require('./aliases.config.js');

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    'module:react-native-dotenv'
  ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};

module.exports = api => {
  api.cache(false);
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv'
    ],
    env: {
      development: {
        plugins: [
          [
            'module-resolver',
            {
              root: ['./src'],
              alias
            }
          ]
        ]
      },
      production: {
        plugins: [
          'transform-remove-console',
          [
            'module-resolver',
            {
              root: ['./src'],
              alias
            }
          ]
        ]
      }
    }
  };
};

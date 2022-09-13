const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';

const fixModuleRules = (config) => {
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.global\.(scss|sass)$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
    },
    // {
    //   test: /\.[jt]sx?$/,
    //   exclude: /node_modules/,
    //   use: [
    //     {
    //       loader: require.resolve('babel-loader'),
    //       options: {
    //         plugins: [
    //           isDevelopment && require.resolve('react-refresh/babel'),
    //         ].filter(Boolean),
    //       },
    //     },
    //   ],
    // },
  ];

  config.module.rules.forEach((rule) => {
    if (rule.test.toString().match(/s\(\[ac\]\)ss/)) {
      rule.exclude = /\.global\.(scss|sass)$/;
      rule.use = [
        {
          loader: 'style-loader',
        },
        {
          loader: '@teamsupercell/typings-for-css-modules-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
            importLoaders: 1,
          },
        },
        {
          loader: 'sass-loader',
        },
      ];
      return;
    }
  });
};
module.exports = function (config) {
  fixModuleRules(config);
  if (isDevelopment) {
    config.devServer = {
      ...config.devServer,
      historyApiFallback: true,
    };
    config.plugins = [
      ...config.plugins,
      new ReactRefreshWebpackPlugin(),
    ].filter(Boolean);
  }

  config.externals = [
    // ...config.externals,
    'webpack',
    'electron-agora-rtc-ng',
  ];
  console.log('config', config.module.rules);
  return config;
};

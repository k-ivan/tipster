const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pkg = require('./package.json');
const paths = {
  src: './src',
  dist: './dist'
}
const banner = `${pkg.description} v${pkg.version} | ${pkg.license} License | ${pkg.repository.url}`;

module.exports = (env, arg) => {
  return {
    entry: [
      `${paths.src}/tooltips.css`,
      `${paths.src}/tooltips.js`
    ],
    output: {
      filename: 'tooltips.js',
      library: 'Tipster',
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          ],
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, paths.src),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'],
              plugins: ['@babel/plugin-transform-object-assign']
            }
          }
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, paths.dist),
      compress: true,
      overlay: true,
      port: 8080
    },
    devtool: arg.mode === 'development' ? 'eval-source-map' : false,
    plugins: [
      new CleanWebpackPlugin({
        dry: true,
        verbose: true,
        cleanOnceBeforeBuildPatterns: ['**/*', '!index.html']
      }),
      new MiniCssExtractPlugin({
        filename: 'tooltips.css'
      }),
      new webpack.BannerPlugin({
        test: /\.js$/,
        banner: banner
      })
    ]
  };
};
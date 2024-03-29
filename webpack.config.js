const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyConfig = require('copy-webpack-plugin');

function getConfig(mode) {
  return {
    target: 'web', // 这是webpack5的bug
    entry: './src/index.tsx',
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        '@': path.resolve('src'),
        '@img': path.join(__dirname, 'src/assets/img'),
        '@components': path.join(__dirname, 'src/components'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        },
        {
          test: /\.(sc|c)ss$/,
          include: path.resolve(__dirname, 'src'), // 只让loader解析我们src底下自己写的文件
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /\.module.(sc|c)ss?$/, // 仅使用module.scss或者module.css
                  localIdentName:
                    mode === 'production'
                      ? '[hash:base64]'
                      : '[name]_[local]_[hash:base64:5]',
                },
              },
            },
            {
              loader: 'px2rem-loader',
              options: {
                remUnit: 50,
                remPrecision: 8,
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                //1024 == 1kb
                //小于10kb时打包成base64编码的图片否则单独打包成图片
                limit: 10240,
                publicPath: './',
                name:
                  mode === 'production'
                    ? 'img/[name].[hash:7].[ext]'
                    : 'src/assets/img/[name].[hash:7].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                name: path.resolve(
                  __dirname,
                  '/dist/font/[name].[hash:7].[ext]'
                ),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CopyConfig({ patterns: [{ from: './public/js', to: './js' }] }), // copy js
      new CleanWebpackPlugin(),
      new HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
        inject: true,
      }),
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },
  };
}

module.exports = function (env, argv) {
  const config = getConfig(argv.mode);
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.devServer = {
      hot: true,
      open: true,
      port: 9000,
      liveReload: true,
      historyApiFallback: true,
      overlay: {
        //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
        errors: true,
      },
    };
  }
  return config;
};

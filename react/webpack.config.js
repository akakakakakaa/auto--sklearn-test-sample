const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const webpack = require("webpack");
const HookShellScriptPlugin = require("hook-shell-script-webpack-plugin");
const { isJSDocCommentContainingNode } = require("typescript");

module.exports = (env, argv) => {
  const mode = argv.mode == "development" ? "development" : "production";
  return {
    mode: mode,

    // 엔트리 포인트
    entry: "./src/index.tsx",

    // 빌드 결과물을 dist/main.js에 위치
    output: {
      filename: "main.js",
      path: __dirname + "/dist",
    },

    // 디버깅을 위해 빌드 결과물에 소스맵 추가
    devtool: "inline-source-map",

    resolve: {
      // 파일 확장자 처리
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx|jsx)$/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          enforce: "pre",
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "source-map-loader",
        },
        {
          //test: /\.(gif|png|jpe?g|svg|ttf|mp3|ogg|wav|otf|woff|jpg|json|ico)$/,
          test: /\.(gif|png|jpe?g|svg|ttf|mp3|ogg|wav|otf|woff|jpg|ico)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            outputPath: "./",
          },
        },
        {
          test: /\.scss|.css$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.styl$/,
          use: ["style-loader"],
        },
        {
          test: /\.(html)$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.ejs"),
        filename: "index.html", // 생성한 템플릿 파일
      }),
    ].concat(
      mode == "development"
        ? [
            new webpack.HotModuleReplacementPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new HardSourceWebpackPlugin(),
          ]
        : [
            new CleanWebpackPlugin(),
            new HookShellScriptPlugin({
              afterEmit: ["./src/common/utils/i18n_support/i18n_build.sh"],
            }),
          ]
    ),
    devServer: {
      hot: true,
      // contentBase: [
      //   publicPath,
      //   resourcesPath,
      //   srcPath
      // ],
      compress: true,
      host: "localhost",
      port: 4545,
      historyApiFallback: true,
    },
  };
};

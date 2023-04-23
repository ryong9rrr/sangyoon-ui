const path = require("path")

module.exports = {
  mode: "production",
  entry: "./lib/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "sangyoon-ui.js",
    library: "sangyoon-ui",
    libraryTarget: "umd",
  },
  externals: {
    "sangyoon-ui/flux": "sangyoon-ui.flux",
    "sangyoon-ui/router": "sangyoon-ui.router",
    "sangyoon-ui/ui": "sangyoon-ui.ui",
  },
  resolve: {
    extensions: [".ts"], // 처리할 확장자
    modules: ["./lib"], // 모듈 경로
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /(\.test.ts$|node_modules)/,
      },
    ],
  },
}

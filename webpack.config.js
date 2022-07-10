module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  devServer: {
    static: "./dist"
  },
  resolve: {
    extensions: [".js", ".glsl", "vs", "fs"]
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // Shader
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },
      // Images
      {
        test: /\.(jpg|png|gif|svg|)$/,
        type: "asset/source",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },
      // CSS
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ],
  }
};
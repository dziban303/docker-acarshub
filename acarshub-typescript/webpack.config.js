const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

let config = {
  entry: {
    acarshub: path.resolve(__dirname, "src") + "/acarshub.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules|\.d\.ts$/,
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
      {
        test: /\.(sass|css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /\.test.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: "file-loader",
        options: {
          outputPath: "../images",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(mp3)$/i,
        loader: "file-loader",
        options: {
          outputPath: "../sounds",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(md)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@fortawesome/fontawesome-free-solid$":
        "@fortawesome/fontawesome-free-solid/shakable.es.js",
    },
    extensions: [
      ".js",
      ".ts",
      ".tsx",
      ".css",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".md",
    ],
  },
  output: {
    //filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist/static/js"),
    publicPath: "static/js/",
    clean: true,
  },

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        acarshub: {
          name: "acarshub",
          minChunks: 2,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/assets/images/acarshublogo.png", to: "../images" },
        // FIXME: we shouldn't have to manually copy this file....why did it break all the sudden?
        { from: "src/assets/sounds/alert.mp3", to: "../sounds" },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "./src/assets/images") + "/acarshub.svg",
      inject: true,
      cache: true,
      outputPath: "../images/favicons",
      publicPath: "../../static/images/favicons",
      prefix: "",
    }),
    new HtmlWebpackPlugin({
      title: "ACARS Hub",
      filename: "../index.html",
      meta: {
        viewport:
          "width=400, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui",
      },
    }),
    new InjectBodyPlugin({
      content: `<header class="header">
      <button class="menu-icon-btn" data-menu-icon-btn>
      <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="menu-icon"><g ><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g></svg>
    </button>
    </header>
    <div class="container">
    <aside class="sidebar" data-sidebar>
      <div class="top-sidebar">
        <img class="channel-logo" src="/static/images/acarshublogo.png" alt="ACARS Hub">
      </div>
      <div class="middle-sidebar">
        <ul class="sidebar-list">
          <li class="sidebar-list-item active" id="live_messages_link">
            <a href="javascript:sidebar_nav_link('live_messages')" class="sidebar-link">
              <svg class="sidebar-icon" viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" ><g ><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></g></svg>
              <div class="hidden-sidebar">Live Messages</div>
            </a>
          </li>
          <li class="sidebar-list-item">
            <a href="#" class="sidebar-link">
              <svg viewbox="0 0 24 24" class="sidebar-icon" preserveaspectratio="xMidYMid meet" focusable="false"><g><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path></g></svg>
              <div class="hidden-sidebar">Live Map</div>
            </a>
          </li>
          <li class="sidebar-list-item">
            <a href="#" class="sidebar-link">
              <svg class="sidebar-icon" viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" ><g><path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h13v-2H2v2zm15-2v6l5-3-5-3z"></path></g></svg>
              <div class="hidden-sidebar">Alerts</div>
            </a>
          </li>
          <li class="sidebar-list-item">
            <a href="#" class="sidebar-link">
              <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="sidebar-icon"><g><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></g></svg>
              <div class="hidden-sidebar">Search</div>
            </a>
          </li>
          <li class="sidebar-list-item">
            <a href="#" class="sidebar-link">
              <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="sidebar-icon"><g><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></g></svg>
              <div class="hidden-sidebar">Statistics</div>
            </a>
          </li>
          </ul>
      </div>
      <div class="bottom-sidebar">
        <ul class="sidebar-list">
          <li class="sidebar-list-item" id="settings_link">
            <a href="javascript:sidebar_nav_link('settings')" class="sidebar-link">
              <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="sidebar-icon"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg>
              <div class="hidden-sidebar">Settings</div>
            </a>
          </li>
          <li class="sidebar-list-item">
            <a href="#" class="sidebar-link">
              <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" class="sidebar-icon"><g><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></g></svg>
              <div class="hidden-sidebar">Send Feedback</div>
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <main class="content" id="acarshub_content">
    </main>
  </div>`,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
    config.output.filename = "[name].js";
  } else {
    config.devtool = "source-map";
    config.output.filename = "[name].[chunkhash].js";
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ];
  }
  config.experiments = config.experiments || {};
  config.experiments.topLevelAwait = true;
  return config;
};

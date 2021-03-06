const webpack = require('webpack');
const path = require('path');

const config = {
    // Entry points to the project
    mode: 'production',
    entry: {
        main: [
            // only- means to only hot reload for successful updates
            'webpack/hot/only-dev-server',
            './src/App.js',
        ],
    },
    // Server Configuration options
    devServer: {
        headers:{
          "Access-Control-Allow-Origin": "*"
        },
        contentBase: 'build', // Relative directory for base of server
        hot: true, // Live-reload
        inline: true,
        port: 4000, // Port Number
        host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        public: 'www.israhospitality.com'
    },
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname, 'build'), // Path of output file
        filename: 'app.bundle.js',
    },
    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["env", "react", "stage-2"],
                    cacheDirectory: true,
                },
            },
        ],
    },
};

module.exports = config;

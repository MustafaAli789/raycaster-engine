const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]

            }
        ]
    },
    resolve: { //allowing for imports
        extensions: ['.ts', '.js']
    },
    devServer: {
        publicPath: "/",
        contentBase: "./public",
        hot: true
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    }
}
module.exports = {
    entry: './src/example/game.ts',
    mode:'development',
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};

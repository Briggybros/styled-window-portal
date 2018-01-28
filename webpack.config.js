const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'StyledWindowPortal.jsx'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'styled-window-portal.min.js',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [{
            test: /\.j(s|sx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'stage-0', 'react'],
            },
        }],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    externals: {
        react: {
            root: 'ReactDOM',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'React',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
        },
    },
};

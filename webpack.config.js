const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'StyledWindowPortal.jsx'),
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'styled-window-portal.min.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: path.resolve(__dirname, 'node_modules'),
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    externals: {
        react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
        },
        'styled-components': {
            root: 'styled-components',
            commonjs: 'styled-components',
            commonjs2: 'styled-components',
            amd: 'styled-components',
        },
    },
};

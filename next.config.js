const path = require('path');
const withSass = require('@zeit/next-sass');


module.exports = withSass({
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
    },
    webpack: (config) => {
        config.module.rules.push(
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: 'react-svg-loader'
            }
        );

        Object.assign(config.resolve.alias, {
            Data: path.resolve(__dirname, 'data'),
            Helpers: path.resolve(__dirname, 'helpers'),
            Components: path.resolve(__dirname, 'components'),
            Sass: path.resolve(__dirname, 'static/sass'),
            Svg: path.resolve(__dirname, 'static/svg'),
        });

        return config;
    }
});
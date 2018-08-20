const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = ({ env }) => ({
    'autoprefixer': env === 'production' ? autoprefixer() : false,
    'cssnano': env === 'production' ? cssnano() : false
});
const configBuilder = require('webpack-focus').configBuilder;
const path = require('path');
const webpack = require('webpack');
const localFocus = process.env.LOCAL_FOCUS ? JSON.parse(process.env.LOCAL_FOCUS) : false;

const customConfig = localFocus ? {
    resolve: {
        alias: {
            react: path.resolve(process.cwd(), './node_modules/react'),
            'focus-components': path.resolve(process.cwd(), '../focus-components'),
            'focus-graph': path.resolve(process.cwd(), '../focus-graph'),
            'i18next': path.resolve(process.cwd(), './node_modules/i18next'),
        }
    }
} : {}

module.exports = configBuilder(customConfig, {
    __LOCAL_FOCUS__: localFocus
});

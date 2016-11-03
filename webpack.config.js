const configBuilder = require('webpack-focus').configBuilder;
const path = require('path');
const webpack = require('webpack');
const localFocus = process.env.LOCAL_FOCUS ? JSON.parse(process.env.LOCAL_FOCUS) : false;

const customConfig = localFocus ? {
    stats: {
        colors: true,
        version: true,
        timings: true,
        assets: true,
        chunks: true,
        modules: true,
        reasons: true,
        children: true,
        source: true,
        errors: true,
        errorDetails: true,
        warnings: true
    },
    proxy: null,
    externals: {
        'react-dom': 'ReactDOM',
        'redux-devtools': 'redux-devtools',
        'react-addons-css-transition-group': {
            root: ['React', 'addons', 'CSSTransitionGroup']
        },
        moment: 'moment',
        lodash: 'lodash'
    },
    resolve: {
        alias: {
            react: path.resolve(process.cwd(), './node_modules/react'),
            'focus-application': path.resolve(process.cwd(), '../focus-application'),
            'focus-components': path.resolve(process.cwd(), '../focus-components'),
            'focus-graph': path.resolve(process.cwd(), '../focus-graph'),
        }
    }
} : {
    stats: {
        colors: true,
        version: true,
        timings: true,
        assets: true,
        chunks: true,
        modules: true,
        reasons: true,
        children: true,
        source: true,
        errors: true,
        errorDetails: true,
        warnings: true
    },
    proxy: null,
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux-devtools': 'redux-devtools',
        'react-addons-css-transition-group': {
            root: ['React', 'addons', 'CSSTransitionGroup']
        },
        moment: 'moment',
        lodash: 'lodash'
    }
}

module.exports = configBuilder(customConfig, {
    __LOCAL_FOCUS__: localFocus,
    __FOCUS_COMPONENTS_RELATIVE_PATH__: localFocus ? "'../../focus-components/'" : "'../node_modules/focus-components/'"
});

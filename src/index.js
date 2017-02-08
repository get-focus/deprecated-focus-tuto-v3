import focusApplicationConf from 'focus-application/package.json';
import focusComponentsConf from 'focus-components/package.json';
import focusGraphConf from 'focus-graph/package.json';
import reactConf from 'react/package.json';
import reactDomConf from 'react-dom/package.json';
import reactReduxConf from 'react-redux/package.json';
import reactRouterConf from 'react-router/package.json';
import reduxConf from 'redux/package.json';


console.info(
    `
        ------------------------------------------------
        TUTORIEL FOCUS v3
        documentation       http://getfocus.io/focus-documentation
        ------------------------------------------------
        focus-application   ${focusApplicationConf.version}
        focus-components    ${focusComponentsConf.version}
        focus-graph         ${focusGraphConf.version}
        react               ${reactConf.version}
        react-dom           ${reactDomConf.version}
        react-router        ${reactRouterConf.version}
        redux               ${reduxConf.version}
        react-redux         ${reactReduxConf.version}
    `
);


import 'babel-polyfill';
import 'focus-components/style';
import 'focus-graph/style';
import 'focus-application/style';

import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {createStore} from 'redux';
import Application from './application';
import configureStore from './store';
const store = configureStore();

import i18next from 'i18next';
import {intializeTranslation} from 'focus-application/translation';
import focusComponentsFr from 'focus-components/translation/resources/fr-FR';
import tutoFr from './config/translations/fr-FR';
intializeTranslation(i18next, 'fr-FR', [focusComponentsFr, tutoFr]);


const renderApp = RootComponent => {
    console.info('App rendered')
    ReactDOM.render(
        <AppContainer>
            <RootComponent store={store} />
        </AppContainer>,
        document.querySelector('.focus-tuto-app')
    );
}
renderApp(Application);

if (module.hot) {
    // module.hot.decline('./routes.js');
    module.hot.accept('./application', () => {
        console.log('Root change')

        // If you use Webpack 2 in ES modules mode, you can
        // use <App /> here rather than require() a <NextApp />.
        const NextRoot = require('./application');
        renderApp(NextRoot);
    });
}

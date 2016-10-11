import 'babel-polyfill';
import 'focus-components/style';
import 'focus-graph/src/style/field.scss';
import 'focus-application/layout/index.scss'
import 'focus-application/header/index.scss'
import {intializeTranslation} from 'focus-application/translation';
import i18n from 'i18next';
import focusTranslation from 'focus-components/translation/resources/fr-FR';
import frTranslation from './config/translations/fr';
////------------------------------
// INIT FOCUS TRANSLATION
intializeTranslation(i18n, 'fr-FR', [focusTranslation, frTranslation]);
//------------------------------

import React , {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {createStore} from 'redux';
import Root from './root';
import configureStore from './store';
import {initFetch} from './services/fetch';
const store = configureStore();
initFetch(store.dispatch);

const renderApp = RootComponent => {
    console.info('App rendered')
    ReactDOM.render(
        <AppContainer>
            <RootComponent store={store} />
        </AppContainer>,
        document.querySelector('.focus-tuto-app')
    );
}

renderApp(Root);

if (module.hot) {

    //   module.hot.decline('./routes.js');
    module.hot.accept('./root', () => {
        console.log('Root change')

        // If you use Webpack 2 in ES modules mode, you can
        // use <App /> here rather than require() a <NextApp />.
        const NextRoot = require('./root');
        renderApp(NextRoot);
    });
}

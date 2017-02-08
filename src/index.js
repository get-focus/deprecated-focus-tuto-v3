import 'babel-polyfill';
import 'focus-components/style';
import 'focus-graph/src/style/field.scss';
import 'focus-application/layout/index.scss'
import 'focus-application/header/index.scss'

// INIT FOCUS TRANSLATION
import {intializeTranslation} from 'focus-application/translation';
import i18n from 'i18next';
import focusTranslation from 'focus-components/translation/resources/fr-FR';
import frTranslation from './config/translations/fr/';
intializeTranslation(i18n, 'fr-FR', [focusTranslation, frTranslation]);

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {createStore} from 'redux';
import {initFetch} from './services/fetch';
import configureStore from './store';
const store = configureStore();
initFetch(store.dispatch);

import Home from './views/home.js';

const renderApp = RootComponent => {
    console.info('App rendered')
    ReactDOM.render(
        <AppContainer>
            <RootComponent store={store}/>
        </AppContainer>,
        document.querySelector('.focus-tuto-app')
    );
}

renderApp(Home);

import 'babel-polyfill';
import 'focus-components/style';
import 'focus-graph/src/style/field.scss';
import 'focus-application/layout/index.scss'
import 'focus-application/header/index.scss'
import {init as initTranslation} from 'focus-components/translation';

//------------------------------
// INIT FOCUS TRANSLATION
initTranslation();
//------------------------------

import React , {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {createStore} from 'redux';
import Root from './root';
import {initFetch} from './services/fetch';

const renderApp = RootComponent => {
    console.info('App rendered')
    ReactDOM.render(
        <AppContainer>
        </AppContainer>,
        document.querySelector('.focus-graph-demo-app')
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

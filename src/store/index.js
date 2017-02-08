import createStoreWithFocus, {combineReducerWithFocus} from 'focus-graph/store/create-store';

import headerReducer from 'focus-application/header/header-reducer';
import messageReducer from 'focus-application/messages/messages-reducer';
import confirmReducer from 'focus-application/confirm/confirm-reducer';
import fetchReducer from 'focus-application/fetch/fetch-reducer';

import DevTools from '../containers/dev-tools'
import rootReducer from '../reducer';
import customReducer from '../reducer/custom-reducer'

import {amoutToUpperCaseMiddleware, errorFieldMiddleware, ownActiondMiddleware} from '../../src/middleware/user-middleware';

import i18n from 'i18next';

let lastCreatedStore;

export default function configureStore(initialState) {
    const store = createStoreWithFocus(
        // Le reducer de données
        {
            dataset: rootReducer,
            header: headerReducer,
            messages: messageReducer,
            confirm: confirmReducer,
            fetch:fetchReducer,
            customData: customReducer
        },
        // Le tableau de middleware custom
        [amoutToUpperCaseMiddleware, errorFieldMiddleware, ownActiondMiddleware],
        // on ajoute les devtools focus
        [DevTools.instrument()],
        props => {return i18n.t(props)}
    );

    lastCreatedStore = store;
    return store;
};

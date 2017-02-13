import createStoreWithFocus, {combineReducerWithFocus} from 'focus-graph/store/create-store';
import headerReducer from 'focus-application/header/header-reducer';
import fetchReducer from 'focus-application/fetch/fetch-reducer';
import confirmReducer from 'focus-application/confirm/confirm-reducer';
import messageReducer from 'focus-application/messages/messages-reducer';

import DevTools from '../containers/dev-tools'
import rootReducer from '../reducer';

import customReducer from '../reducer/custom-reducer'
import {amoutToUpperCaseMiddleware, errorFieldMiddleware, ownActiondMiddleware} from '../../src/middleware/user-middleware';

let lastCreatedStore;

export default function configureStore(initialState){
    const store = createStoreWithFocus(
        {
            dataset: rootReducer,
            header: headerReducer,
            messages: messageReducer,
            confirm: confirmReducer,
            customData: customReducer,
            fetch:fetchReducer
        },
        [amoutToUpperCaseMiddleware, errorFieldMiddleware, ownActiondMiddleware],
        [DevTools.instrument()]
    );

    lastCreatedStore = store;
    return store;
};

import createStoreWithFocus, {combineReducerWithFocus} from 'focus-graph/store/create-store';
import DevTools from '../containers/dev-tools'

import headerReducer from 'focus-application/header/header-reducer';
import fetchReducer from 'focus-application/fetch/fetch-reducer';
import confirmReducer from 'focus-application/confirm/confirm-reducer';
import messageReducer from 'focus-application/messages/messages-reducer';

let lastCreatedStore;

export default function configureStore(initialState){
  const store = createStoreWithFocus({
      dataset: [],
      header: headerReducer,
      messages: messageReducer,
      confirm: confirmReducer,
      fetch:fetchReducer
    },
    [],
    [DevTools.instrument()]
  );

  lastCreatedStore = store;
  return store;
};

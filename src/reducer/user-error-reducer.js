import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadErrorUserTypes,saveErrorUserTypes} from '../actions/user-actions-global-error';

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Amélie'
};

// Utilisation du reducerBuilder qui attend un name correspondant à votre entité, puis les types de load renvoyés par les actions
// mais aussi les types des saves et enfin les defaultData.
const userErrorReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadErrorUserTypes,
    saveTypes: saveErrorUserTypes,
    defaultData: DEFAULT_DATA
});

export default userErrorReducer;

import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserTypes, saveUserTypes} from '../actions/user-actions';

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Pierre'
};

// Utilisation du reducerBuilder qui attends un name correspondant à votre entité, puis les types de load renvoyés par les actions
// mais aussi les types des saves et enfin les defaultData.
const userReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadUserTypes,
    saveTypes: saveUserTypes,
    defaultData: DEFAULT_DATA
});

export default userReducer;

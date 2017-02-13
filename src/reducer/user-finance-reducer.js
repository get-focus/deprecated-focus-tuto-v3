import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserFinanceTypes, saveUserFinanceTypes} from '../actions/finance-user-actions';

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Amélie'
};

// Utilisation du reducerBuilder qui attends le type des trois actions créés par l'actionBuimlder
export const financeReducer = reducerBuilder({
  name: 'finance',
  loadTypes: loadUserFinanceTypes,
  saveTypes: saveUserFinanceTypes
});

export const userReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadUserFinanceTypes,
    saveTypes: saveUserFinanceTypes,
    defaultData: DEFAULT_DATA
});

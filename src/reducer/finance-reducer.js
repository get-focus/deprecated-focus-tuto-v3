import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadFinanceTypes, saveFinanceTypes} from '../actions/finance-actions';

const financeReducer = reducerBuilder({
    name: 'finance',
    loadTypes: loadFinanceTypes,
    saveTypes: saveFinanceTypes
});

export default financeReducer;

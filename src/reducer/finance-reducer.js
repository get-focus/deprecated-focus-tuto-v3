import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadFinanceTypes, saveFinanceTypes} from '../actions/finance-actions';

const financeReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadFinanceTypes,
    saveTypes: saveFinanceTypes
});

export default financeReducer;

import {combineReducers} from 'redux';
import financeReducer from './finance-reducer';

export default combineReducers({
    finance : financeReducer
});

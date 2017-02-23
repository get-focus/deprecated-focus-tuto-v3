import {combineReducers} from 'redux';

//import userReducer from './user-reducer';
//import financeReducer from './finance-reducer';
import {userReducer, financeReducer} from './user-finance-reducer'

export default combineReducers({
    user : userReducer,
    finance : financeReducer
});

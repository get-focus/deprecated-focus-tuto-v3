import {combineReducers} from 'redux';
import {userReducer, financeReducer} from './user-finance-reducer'

export default combineReducers({
    user: userReducer,
    finance: financeReducer
});

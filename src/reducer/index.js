import {combineReducers} from 'redux';

//import userReducer from './user-reducer';
//import financeReducer from './finance-reducer';
import {userReducer, financeReducer} from './user-finance-reducer'
import userErrorReducer from './user-error-reducer';

export default combineReducers({
    user : userErrorReducer,
    finance : financeReducer
});

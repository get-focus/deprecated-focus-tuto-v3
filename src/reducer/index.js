import {combineReducers} from 'redux';
<<<<<<< HEAD

//import userReducer from './user-reducer';
//import financeReducer from './finance-reducer';
import {userReducer, financeReducer} from './user-finance-reducer'

export default combineReducers({
    user : userReducer,
    finance : financeReducer
=======
import userErrorReducer from './user-error-reducer';

export default combineReducers({
    user : userErrorReducer
>>>>>>> form 6 tuto+code
});

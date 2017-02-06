import {combineReducers} from 'redux';
import financeReducer from './finance-reducer';
import userReducer from './user-reducer';
import {customReducer} from './custom-reducer';

export default combineReducers({
    user: userReducer,
    finance: financeReducer
});

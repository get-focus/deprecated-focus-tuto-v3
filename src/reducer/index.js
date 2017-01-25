import {combineReducers} from 'redux';
import {userReducer, financeReducer} from './user-finance-reducer';
import {customReducer} from './custom-reducer';

export default combineReducers({
  user: userReducer,
  finance: financeReducer
});

import { combineReducers } from "redux";

import { appReducer } from './reducers/appReducer';
import { authReducer } from './reducers/authReducer';
import { mainReducer } from './reducers/mainReducer';

export const reducers = combineReducers({
    appReducer,
    authReducer,
    mainReducer
})
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import users, { userSaga } from './users';

export function* rootSaga() {
    yield all([userSaga()]);
}

const rootReducer = combineReducers({ users });
export default rootReducer;
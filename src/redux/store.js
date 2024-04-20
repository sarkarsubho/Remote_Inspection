import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";

const reducers = combineReducers({});

const store = legacy_createStore(combineReducers, applyMiddleware(thunk));

export { store };

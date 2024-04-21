import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { appReducer } from "./app/reducer";

const reducers = combineReducers({
  app: appReducer,
});

const store = legacy_createStore(reducers, applyMiddleware(thunk));

export { store };

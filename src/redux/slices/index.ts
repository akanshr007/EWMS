import { combineReducers } from "redux";
import loadingSlice from "./loading.slice";
import userSlice from "./user.slice";
import { api } from "services/api";

/**COMBINE ALL REDUCERS */
const reducers = combineReducers({
  [api.reducerPath]: api.reducer,
  loading: loadingSlice,
  user: userSlice,
});

const rootReducers = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    state = undefined; // Reset state to undefined
  }
  return reducers(state, action);
};

export default rootReducers;

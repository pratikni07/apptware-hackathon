import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import activityReducer from "../slices/activitySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  activity: activityReducer,
});

export default rootReducer;

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    permissions: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const { setUserData, setUserPermissions } = userSlice.actions;
export default userSlice.reducer;

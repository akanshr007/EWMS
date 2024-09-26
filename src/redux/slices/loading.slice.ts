import { createSlice } from "@reduxjs/toolkit";

interface loading {
  loading: boolean;
}
const initialState: loading = {
  loading: false,
};
/**LOADING DETAILS SLICE */
export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

/**ACTIONS FOR SLICE*/
export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

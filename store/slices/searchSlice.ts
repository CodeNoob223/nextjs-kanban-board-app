import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";

import { berry } from "@/app/types";

const initialState: SearchState = {
  search: "",
  data: []
}

const searchSlice = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {
    setSearch: (state: SearchState, action: PayloadAction<string>) => {
      state.search = action.payload;
      return state;
    },
    setData: (state: SearchState, action: PayloadAction<berry[]>) => {
      state.data = action.payload;
      return state;
    }
  }
});

export const { setSearch, setData } = searchSlice.actions;
export default searchSlice.reducer;
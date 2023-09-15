import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userDataSlice";
import searchReducer from "./slices/searchSlice";
import notificationSlice from "./slices/notificationSlice";
import todoSlice from "./slices/todoSlice";
import { useDispatch } from "react-redux";
import { berryApi } from "./berryApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
    notification: notificationSlice,
    berryApi: berryApi.reducer,
    todos: todoSlice
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(berryApi.middleware);
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
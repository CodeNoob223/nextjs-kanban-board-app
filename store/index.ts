import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userDataSlice";
import searchReducer from "./slices/searchSlice";
import notificationSlice from "./slices/notificationSlice";
import todoSlice from "./slices/todoSlice";
import { useDispatch } from "react-redux";
import projectSlice from "./slices/projectSlice";
import serverNotifSlice from "./slices/serverNotifSlice";
import messageSlice from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
    notification: notificationSlice,
    todos: todoSlice,
    project: projectSlice,
    serverNotif: serverNotifSlice,
    chatMessage: messageSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
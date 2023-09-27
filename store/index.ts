import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userDataSlice";
import notificationSlice from "./slices/notificationSlice";
import todoSlice from "./slices/todoSlice";
import { useDispatch } from "react-redux";
import projectSlice from "./slices/projectSlice";
import serverNotifSlice from "./slices/serverNotifSlice";
import messageSlice from "./slices/messageSlice";
import reportSlice from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationSlice,
    todos: todoSlice,
    project: projectSlice,
    serverNotif: serverNotifSlice,
    chatMessage: messageSlice,
    reports: reportSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
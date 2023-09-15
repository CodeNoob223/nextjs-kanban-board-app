import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { v4 as uuidv4 } from 'uuid';

const notificationSlice = createSlice({
  name: "notification",
  initialState: [] as AppNotification[],
  reducers: {
    addNotification: (state: AppNotification[], action: PayloadAction<{
      content: string,
      type: AppNotification["type"]
    }>) => {
      state.push({
        id: uuidv4(),
        content: action.payload.content,
        type: action.payload.type
      });
      return state;
    },
    removeNotification: (state: AppNotification[], action: PayloadAction<string>) => {
      state = state.filter(item => item.id !== action.payload);
      return state;
    }
  }
});

export const {addNotification, removeNotification} = notificationSlice.actions;
export default notificationSlice.reducer;
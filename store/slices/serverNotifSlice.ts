import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNotification } from "./notificationSlice";

export const deleteSN = createAsyncThunk("serverNotif/deleteSN", async (notification_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/notifications/api?id=${notification_id}`, {
    method: "delete"
  });

  const { error }: DeleteSupaBaseRes = await res.json();
  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));

    return thunkApi.rejectWithValue(error);
  }

  return notification_id;
});

export const fetchSN = createAsyncThunk("serverNotif/fetchSN", async (_: number = 0, thunkApi) => {
  const res = await fetch(`${location.origin}/notifications/api`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseRes<ServerNotification> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));

    return thunkApi.rejectWithValue(error);
  }

  return data;
})

const serverNotifSlice = createSlice({
  name: "serverNotif",
  initialState: {
    new: false,
    data: [] as ServerNotification[],
  } as ServerNotifState,
  reducers: {
    addSN: (state: ServerNotifState, action: PayloadAction<ServerNotification>) => {
      return {
        new: true,
        data: [...state.data, action.payload]
      }
    },
    noNewSN: (state: ServerNotifState) => {
      if (!state.new)
      return {...state, new: false}
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchSN.fulfilled, (state: ServerNotifState, action: PayloadAction<ServerNotification[]>) => {
      return {
        ...state,
        data: action.payload
      }
    })

    builder.addCase(deleteSN.fulfilled, (state: ServerNotifState, action: PayloadAction<number>) => {
      return {
        new: false,
        data: state.data.filter(notif => notif.notification_id !== action.payload)
      };
    });
  },
});

export default serverNotifSlice.reducer;
export const { addSN, noNewSN } = serverNotifSlice.actions;
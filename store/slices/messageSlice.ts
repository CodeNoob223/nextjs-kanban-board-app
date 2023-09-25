import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNotification } from "./notificationSlice";

type messageSliceState = {
  project_id: number,
  messages: ChatMessage[]
};

export const getNewMessage = createAsyncThunk("chatMessage/getNewMessage", async (message_id: number, thunkApi) => {
  const res = await fetch(`http://localhost:3000/messages/api?message=${message_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseResSingle<ChatMessage> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi lấy tin nhắn!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };
  return data;
});

export const fetchMessages = createAsyncThunk("chatMessage/fetchMessages", async (project_id: number, thunkApi) => {
  const res = await fetch(`http://localhost:3000/messages/api?project=${project_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseRes<ChatMessage> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi lấy tin nhắn!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };
  return {
    project_id,
    messages: data
  } as messageSliceState;
});

export const postMessage = createAsyncThunk("chatMessage/postMessage", async (target: {
  content: string,
  project_id: number
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/messages/api`, {
    method: "post",
    body: JSON.stringify(target)
  });

  const { data, error }: PostSupaBaseRes<ChatMessage> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi gửi tin nhắn!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };

  return data;
});

const messageSlice = createSlice({
  name: "chatMessage",
  initialState: {
    project_id: 0,
    messages: []
  } as messageSliceState,
  reducers: {
    addChatMessage: (state: messageSliceState, action: PayloadAction<ChatMessage>) => {
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchMessages.fulfilled, (state: messageSliceState, action: PayloadAction<messageSliceState>) => {
      return {
        project_id: action.payload.project_id,
        messages: action.payload.messages
      }
    });

    builder.addCase(getNewMessage.fulfilled, (state: messageSliceState, action: PayloadAction<ChatMessage>) => {
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    });
  }
});

export default messageSlice.reducer;
export const { addChatMessage } = messageSlice.actions;
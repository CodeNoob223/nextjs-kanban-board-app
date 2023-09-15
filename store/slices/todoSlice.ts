import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { addNotification } from "./notificationSlice";

export const toLowerFirst = (str : string) : string => {
  return str[0].toLowerCase() + str.slice(1);
}

export const toUpperFirst = (str : string) : string => {
  return str[0].toUpperCase() + str.slice(1);
}

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (limit: number, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api?limit=${limit}`, {
    method: "GET"
  });

  const data: GetSupaBaseRes = await res.json();
  if (data.error) {
    thunkApi.dispatch(addNotification({
      content: data.error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(data.error);
  }

  return data.data;
});

export const postTodo = createAsyncThunk("todos/postTodo", async (newTodo: {
  task: string
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api`, {
    method: "post",
    body: JSON.stringify({
      task: newTodo.task
    })
  });
  const data: PostSupaBaseRes = await res.json();

  if (!data.error) {
    let newOrder = JSON.parse(localStorage.getItem("pendingOrder") as string);

    if (!newOrder) {
      newOrder = [data.data.id]
    } else {
      newOrder = [...newOrder, data.data.id];
    }

    localStorage.setItem("pendingOrder", JSON.stringify(newOrder));

    thunkApi.dispatch(addNotification({
      content: "Thêm thành công",
      type: "success"
    }));
    return data.data;

  } else {
    thunkApi.dispatch(addNotification({
      content: data.error,
      type: "error"
    }));

    return thunkApi.rejectWithValue(data.error);
  }
});

export const putTodo = createAsyncThunk("todos/putTodo", async (newTodo: {
  id: number,
  from: ToDo["status"],
  to: ToDo["status"],
  fromIndex: number,
  toIndex: number
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api`, {
    method: "PUT",
    body: JSON.stringify(newTodo)
  });
  const data: PutSupaBaseRes = await res.json();

  if (data.error) {
    thunkApi.dispatch(addNotification({
      content: data.error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(data.error);
  }

  let fromColumn = toLowerFirst(newTodo.from) + "Order";
  let toColumn = toLowerFirst(newTodo.to) + "Order";

  if (fromColumn === toColumn) {
    let fromOrder = JSON.parse(localStorage.getItem(fromColumn) as string) as number[];
    //Change order:
    const [removedItem] = fromOrder.splice(newTodo.fromIndex, 1);
    fromOrder.splice(newTodo.toIndex, 0, removedItem);

    localStorage.setItem(fromColumn, JSON.stringify(fromOrder));
  } else {
    let fromOrder = JSON.parse(localStorage.getItem(fromColumn) as string) as number[];
    fromOrder = fromOrder.filter(id => id !== newTodo.id);
    localStorage.setItem(fromColumn, JSON.stringify(fromOrder));

    let toOrder = JSON.parse(localStorage.getItem(toColumn) as string) as number[];
    
    if (newTodo.toIndex === -1) {
      toOrder = [...toOrder, newTodo.id];
    } else {
      //Insert new id:
      toOrder.splice(newTodo.toIndex, 0, newTodo.id);
    }
    localStorage.setItem(toColumn, JSON.stringify(toOrder));
  }

  return data.data;
});

export const deleteTodos = createAsyncThunk("todos/deleteTodos", async (
  target: {
    id: number
    status: ToDo["status"]
  }, thunkApi
) => {
  const res = await fetch(`http://localhost:3000/todos/api`, {
    method: "delete",
    body: JSON.stringify({
      id: target.id
    })
  });

  const data: DeleteSupaBaseRes = await res.json();
  let orderName = toLowerFirst(target.status) + "Order";

  if (!data.error) {
    //Update order
    let newOrder: number[] = JSON.parse(localStorage.getItem(orderName) as string);

    if (newOrder) {
      newOrder = newOrder.filter(id => id !== target.id);
      localStorage.setItem(orderName, JSON.stringify(newOrder));
    }

    thunkApi.dispatch(addNotification({
      content: "Xóa thành công",
      type: "success"
    }));
    return target.id;
  } else {
    thunkApi.dispatch(addNotification({
      content: data.error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(data.error);
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState: [] as ToDo[],
  reducers: {
    addTodos: (state: ToDo[], action: PayloadAction<ToDo>) => {
      state = [...state, action.payload];
      return state;
    },
    removeTodos: (state: ToDo[], action: PayloadAction<number>) => {
      state = state.filter(td => td.id !== action.payload);
      return state;
    },
    updateTodos: (state: ToDo[], action: PayloadAction<{
      id: number,
      status: ToDo["status"]
    }>) => {
      state = state.map(td => {
        if (td.id === action.payload.id) {
          td.status = action.payload.status;
        }
        return td;
      });
    },
    setTodos: (state: ToDo[], action: PayloadAction<ToDo[]>) => {
      state = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state: ToDo[], action: PayloadAction<ToDo[]>) => {
      state = action.payload;
      return state;
    });

    builder.addCase(putTodo.fulfilled, (state: ToDo[], action: PayloadAction<ToDo>) => {
      state = state.map(td => {
        if (td.id === action.payload.id) {
          td = {
            ...td,
            status: action.payload.status
          } 
        }
        return td;
      });
      
      return state;
    });

    builder.addCase(postTodo.fulfilled, (state: ToDo[], action: PayloadAction<ToDo>) => {
      state = [...state, action.payload];
      return state;
    });

    builder.addCase(deleteTodos.fulfilled, (state: ToDo[], action: PayloadAction<number>) => {
      state = state.filter(td => td.id !== action.payload);
      return state;
    });
  }
});

export const { addTodos, removeTodos, setTodos, updateTodos } = todosSlice.actions;
export default todosSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { addNotification } from "./notificationSlice";

export const toLowerFirst = (str: string): string => {
  return str[0].toLowerCase() + str.slice(1);
}

export const toUpperFirst = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
}

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (limit: number, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api?limit=${limit}`, {
    method: "GET"
  });

  const data: GetSupaBaseRes<Task> = await res.json();
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
  content: string,
  deadline: string
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api`, {
    method: "post",
    body: JSON.stringify({
      content: newTodo.content,
      deadline: newTodo.deadline,
      project_id: ""
    })
  });
  const data: PostSupaBaseRes<Task> = await res.json();

  if (!data.error) {
    let newOrder = JSON.parse(localStorage.getItem("pendingOrder") as string);

    if (!newOrder) {
      newOrder = [data.data.task_id]
    } else {
      newOrder = [...newOrder, data.data.task_id];
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
  from: Task["status"],
  to: Task["status"],
  fromIndex: number,
  toIndex: number,
  progress: string
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/todos/api`, {
    method: "PUT",
    body: JSON.stringify(newTodo)
  });
  const data: PutSupaBaseRes<Task> = await res.json();

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
    status: Task["status"]
  }, thunkApi
) => {
  const res = await fetch(`http://localhost:3000/todos/api?id=${target.id}`, {
    method: "delete"
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
  initialState: [] as Task[],
  reducers: {
    addTodos: (state: Task[], action: PayloadAction<Task>) => {
      state = [...state, action.payload];
      return state;
    },
    removeTodos: (state: Task[], action: PayloadAction<number>) => {
      state = state.filter(td => td.task_id !== action.payload);
      return state;
    },
    updateTodos: (state: Task[], action: PayloadAction<{
      id: number,
      status: Task["status"],
      progress: string
    }>) => {
      state = state.map(td => {
        if (td.task_id === action.payload.id) {
          td.status = action.payload.status;
          if (action.payload.status === "Done") {
            td.progress = 100;
          } else if (action.payload.progress) {
            td.progress = parseInt(action.payload.progress);
          }
        }
        return td;
      });
    },
    setTodos: (state: Task[], action: PayloadAction<Task[]>) => {
      state = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state: Task[], action: PayloadAction<Task[]>) => {
      state = action.payload.filter(task => !task.project_id);
      return state;
    });

    builder.addCase(putTodo.fulfilled, (state: Task[], action: PayloadAction<Task>) => {
      state = state.map(td => {
        if (td.task_id === action.payload.task_id) {
          td = {
            ...td,
            progress: action.payload.progress,
            status: action.payload.progress === 100 ? "Done" : action.payload.status,
          }
        }
        return td;
      });

      return state;
    });

    builder.addCase(postTodo.fulfilled, (state: Task[], action: PayloadAction<Task>) => {
      state = [...state, action.payload];
      return state;
    });

    builder.addCase(deleteTodos.fulfilled, (state: Task[], action: PayloadAction<number>) => {
      state = state.filter(td => td.task_id !== action.payload);
      return state;
    });
  }
});

export const { addTodos, removeTodos, setTodos, updateTodos } = todosSlice.actions;
export default todosSlice.reducer;
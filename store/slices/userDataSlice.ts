import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { addNotification } from "./notificationSlice";

export const fetchProjects = createAsyncThunk("user/fetchProjects", async (limit: number, thunkApi) => {
  const res = await fetch(`http://localhost:3000/projects/api?limit=${limit}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseRes<Project> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    console.log(error);
    return thunkApi.rejectWithValue(error);
  }

  return data;
});

export const postProject = createAsyncThunk("user/postProject", async ({ project_id, project_name }: {
  project_id: string,
  project_name: string
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/projects/api/`, {
    method: "post",
    body: JSON.stringify({
      project_id,
      project_name
    })
  });

  const { data, error }: PostSupaBaseRes<Project> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  if (project_id && project_name) {
    thunkApi.dispatch(addNotification({
      content: "Đã gia nhập dự án " + data.project_name,
      type: "success"
    }));
  } else if (project_name && !project_id) {
    thunkApi.dispatch(addNotification({
      content: "Đã tạo dự án " + data.project_name,
      type: "success"
    }));
  }

  return data;
});

export const putProject = createAsyncThunk("user/putProject", async (params: {
  project_id: number,
  project_name?: string,
  description?: string,
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/projects/api/`, {
    method: "put",
    body: JSON.stringify({
      project_id: params.project_id,
      project_name: params.project_name || "",
      description: params.description || ""
    })
  });

  const { data, error }: PutSupaBaseRes<Project> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  thunkApi.dispatch(addNotification({
    content: "Cập nhật thành công!",
    type: "success"
  }));

  return data;
});

export const deleteProject = createAsyncThunk("user/deleteProject", async (params: {
  flag: "delete" | "leave",
  project_id: number,
  profile_id: string
}, thunkApi) => {
  const res = await fetch(`http://localhost:3000/projects/api?flag=${params.flag}&project=${params.project_id}&profile=${params.profile_id}`, {
    method: "delete"
  });

  const { id, error }: DeleteSupaBaseRes = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  if (params.flag === "delete") {
    thunkApi.dispatch(addNotification({
      content: "Đã xóa dự án " + id, //id - sẽ mang giá trị project_name
      type: "success"
    }));
  } else if (params.flag === "leave") {
    thunkApi.dispatch(addNotification({
      content: "Đã rời khỏi dự án " + id, //id - sẽ mang giá trị project_name
      type: "success"
    }));
  }

  return id as number;
});

const userSlice = createSlice({
  name: "user",
  initialState: null as UserState | null,
  reducers: {
    signIn: (state: UserState | null, action: PayloadAction<UserState>) => {
      state = {...action.payload, projects: state?.projects || []};
      return state;
    },
    signOut: () => {
      return null;
    },
    filterUserProjectList: (state: UserState | null, action: PayloadAction<number>) => {
      if (state)
      return {
        ...state,
        projects: state.projects.filter(project => project.project_id !== action.payload)
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchProjects.fulfilled, (state: UserState | null, action: PayloadAction<Project[]>) => {
      if (state) state = { ...state, projects: [...action.payload] };
      return state;
    });

    builder.addCase(postProject.fulfilled, (state: UserState | null, action: PayloadAction<Project>) => {
      if (state) state = { ...state, projects: [...state.projects, action.payload] };
      return state;
    });

    builder.addCase(putProject.fulfilled, (state: UserState | null, action: PayloadAction<Project>) => {
      if (state) state = { ...state, projects: state.projects.map(project => {
        if (project.project_id === action.payload.project_id) {
          return action.payload;
        }
        return project;
      }) };
      return state;
    });

    builder.addCase(deleteProject.fulfilled, (state: UserState | null, action: PayloadAction<number>) => {
      if (state) state = { ...state, projects: state.projects.filter(project => project.project_name !== action.payload.toString()) };
      return state;
    });
  },
});

export const { signIn, signOut, filterUserProjectList } = userSlice.actions;
export default userSlice.reducer;
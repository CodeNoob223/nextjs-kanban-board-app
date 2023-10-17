import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNotification } from "./notificationSlice";

export const fetchProjectData = createAsyncThunk("project/fetchProjectData", async (projectId: number, thunkApi) => {
  const res = await fetch(`${location.origin}/projects/${projectId}/api?id=${projectId}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseResSingle<Project> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Dự án không còn tồn tại!",
      type: "error"
    }));

    return thunkApi.rejectWithValue(projectId);
  }

  return data;
});

export const postProjectTask = createAsyncThunk("project/addProjectTask", async (newTask: {
  content: string,
  deadline: string,
  project_id: number
}, thunkApi) => {
  const res = await fetch(`${location.origin}/todos/api`, {
    method: "post",
    body: JSON.stringify({
      content: newTask.content,
      deadline: newTask.deadline || "",
      project_id: newTask.project_id
    })
  });
  const { data, error }: PostSupaBaseRes<Task> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  return data;
});

export const fetchNewTaskData = createAsyncThunk("project/fetchNewTaskData", async (task_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/todos/api?limit=1&task_id=${task_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseResSingle<Task> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  return data;
});

export const fetchNewProjectMember = createAsyncThunk("project/fetchNewProjectMember", async (target: {
  profile_id: string,
  project_id: number 
}, thunkApi) => {
  const res = await fetch(`${location.origin}/projects/0/api/workers?profile=${target.profile_id}&project=${target.project_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseResSingle<{
    id: number,
    profiles: {
      profile_id: string,
      username: string,
      avatar_url: string
    }
  }> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  return data;
});


export const putProjectTask = createAsyncThunk("project/putProjectTask", async (newTask: {
  id: number,
  from: Task["status"],
  to: Task["status"],
  fromIndex: number,
  toIndex: number,
  progress: string,
  workers: Task["workers"]
}, thunkApi) => {
  const res = await fetch(`${location.origin}/todos/api`, {
    method: "PUT",
    body: JSON.stringify(newTask)
  });
  const { data, error }: PutSupaBaseRes<Task> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  }

  return data;
});

export const deleteProjectTask = createAsyncThunk("project/deleteProjectTask", async (task_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/todos/api?id=${task_id}`, {
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

  return task_id;
});

export const postTaskMember = createAsyncThunk("project/postTaskMember", async (task_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/projects/0/api/workers`, {
    method: "post",
    body: JSON.stringify({
      task_id
    })
  });

  const {error} : PostSupaBaseRes<Task> = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));

    return thunkApi.rejectWithValue(error);
  }

  return true;
});

export const deleteTaskMember = createAsyncThunk("project/deleteTaskMember", async (target: {
  task_id: number,
  profile_id: string,
  workersNum: number
}, thunkApi) => {
  const res = await fetch(`${location.origin}/projects/0/api/workers?profile=${target.profile_id}&task=${target.task_id}&length=${target.workersNum}`, {
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

  return id;
});

export const deleteOwnProject = createAsyncThunk("project/deleteProject", async (target: {
  profile_id: string,
  project_id: number
}, thunkApi) => {
  const res = await fetch(`${location.origin}/projects/api?profile=${target.profile_id}&project=${target.project_id}&flag=delete`, {
    method: "delete"
  });

  const {error} : DeleteSupaBaseRes = await res.json();

  if (error) {
    thunkApi.dispatch(addNotification({
      content: error,
      type: "error"
    }));

    return thunkApi.rejectWithValue(error);
  }

  return target.project_id;
});

export const deleteProjectMember = createAsyncThunk("project/deleteProjectMember", async (target : {
  profile_id: string,
  project_id: number,
  flag: "leave" | "delete"
}, thunkApi) => {
  if (!confirm("Xóa thành viên?")) return;
  const res = await fetch(`${location.origin}/projects/api?profile=${target.profile_id}&project=${target.project_id}&flag=${target.flag}`, {
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

  return id as string;
});

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project_id: -1,
    project_name: "",
    team_lead: {
      profile_id: "",
      username: "",
      avatar_url: ""
    },
    description: "",
    joined_date: "",
    created_at: "",
    tasks: [] as Task[],
    project_members: []
  } as Project,
  reducers: {
    addProjectTask: (state: Project, action: PayloadAction<Task>) => {
      state = { ...state, tasks: [...state.tasks, action.payload] }
      return;
    },
    filterProjectTask: (state: Project, action: PayloadAction<number>) => {
      const newTasksList = state.tasks.filter(task => task.task_id !== action.payload);
      return { ...state, tasks: newTasksList }
    },
    updateProjectTask: (state: Project, action: PayloadAction<Task>) => {
      const newTasksList = state.tasks.map(task => {
        if (task.task_id === action.payload.task_id) return action.payload;
        return task;
      });
      return { ...state, tasks: newTasksList }
    },
    addTaskMember: (state: Project, action: PayloadAction<{
      task_id: number,
      id: number,
      username: string,
      avatar_url: string,
      profile_id: string
    }>) => {
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.task_id === action.payload.task_id) {
            task.workers?.push({
              profiles: {
                profile_id: action.payload.profile_id,
                username: action.payload.username,
                avatar_url: action.payload.avatar_url
              }
            });
          }

          return task;
        })
      }
    },
    removeTaskMember: (state: Project, action: PayloadAction<{
      task_id: number,
      profile_id: string
    }>) => {
      return {
        ...state,
        tasks: state.tasks.filter(task => {
          if (task.task_id === action.payload.task_id) {
            task.workers?.filter(worker => worker.profiles.profile_id !== action.payload.profile_id);
          }
          return task;
        })
      }
    },
    filterProjectMember: (state: Project, action: PayloadAction<number>) => {
      return {
        ...state,
        project_members: state.project_members.filter(member => member.id !== action.payload)
      };
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchProjectData.fulfilled, (state: Project, action: PayloadAction<Project>) => {
      return action.payload;
    });
    // Let listener handle this instead
    // builder.addCase(postProjectTask.fulfilled, (state: Project, action: PayloadAction<Task>) => {
    //   return {...state,
    //     tasks: [...state.tasks, action.payload]
    //   };
    // }); 

    builder.addCase(fetchNewTaskData.fulfilled, (state: Project, action: PayloadAction<Task>) => {
      let newTasksList = state.tasks.filter(task => task.task_id !== action.payload.task_id);

      return {
        ...state,
        tasks: [...newTasksList, action.payload]
      }
    });

    builder.addCase(fetchNewProjectMember.fulfilled, (state: Project, action: PayloadAction<{
      id: number,
      profiles: {
        profile_id: string,
        username: string,
        avatar_url: string
      }
    }>) => {
      return {...state, project_members: [...state.project_members, action.payload]}
    });

    // Let listener handle this instead
    // builder.addCase(deleteProjectMember.fulfilled, (state: Project, action: PayloadAction<string>) => {
    //   let newMembersList = state.project_members.filter(member => member.profiles.profile_id !== action.payload);

    //   return {
    //     ...state,
    //     project_members: newMembersList
    //   };
    // });

    // builder.addCase(putProjectTask.fulfilled, (state: Project, action: PayloadAction<Task>) => {
    //   return {
    //     ...state,
    //     tasks: state.tasks.map(task => {
    //       if (task.task_id === action.payload.task_id) return action.payload;
    //       return task;
    //     })
    //   }
    // });

    // builder.addCase(deleteProjectTask.fulfilled, (state: Project, action: PayloadAction<number>) => {
    //   return {
    //     ...state,
    //     tasks: state.tasks.filter(task => task.task_id !== action.payload)
    //   };
    // });

  },
});

export const { addProjectTask, filterProjectTask, updateProjectTask, addTaskMember, filterProjectMember, removeTaskMember } = projectSlice.actions;
export default projectSlice.reducer;
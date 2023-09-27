import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNotification } from "./notificationSlice";

type reportSliceState = {
  project_id: number,
  reports: ProjectReport[]
}

export const fetchReports = createAsyncThunk("report/fetchReports", async (project_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/reports/api?project=${project_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseRes<ProjectReport> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi lấy thông tin!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };

  return {
    project_id,
    data
  };
});

export const postReport = createAsyncThunk("report/postReport", async (report: {
  project_id: number,
  content: string,
  title: string
}, thunkApi) => {
  const res = await fetch(`${location.origin}/reports/api`, {
    method: "post",
    body: JSON.stringify(report)
  });

  const { data, error }: PostSupaBaseRes<ProjectReport> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi gửi báo cáo!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };

  return data;
});

export const putReport = createAsyncThunk("report/putReport", async (report: {
  report_id: number,
  content: string,
  title: string
}, thunkApi) => {
  const res = await fetch(`${location.origin}/reports/api`, {
    method: "put",
    body: JSON.stringify(report)
  });

  const { data, error }: PutSupaBaseRes<ProjectReport> = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi cập nhật báo cáo!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };

  return data;
});

export const deleteReport = createAsyncThunk("report/fetchReports", async (report_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/reports/api?report=${report_id}`, {
    method: "delete"
  });

  const { error }: DeleteSupaBaseRes = await res.json();

  if (error) {
    console.log(error);
    thunkApi.dispatch(addNotification({
      content: "Có lỗi khi xóa!",
      type: "error"
    }));
    return thunkApi.rejectWithValue(error);
  };

  return report_id;
});

export const getNewReport = createAsyncThunk("report/getNewReport", async (report_id: number, thunkApi) => {
  const res = await fetch(`${location.origin}/reports/api?report=${report_id}`, {
    method: "get"
  });

  const { data, error }: GetSupaBaseResSingle<ProjectReport> = await res.json();

  if (error) {
    console.log(error);

    return thunkApi.rejectWithValue(error);
  };

  return data;
});

const reportSlice = createSlice({
  name: "report",
  initialState: {
    project_id: -1,
    reports: []
  } as reportSliceState,
  reducers: {
    filterReport: (state: reportSliceState, action: PayloadAction<number>) => {
      if (state.project_id) {
        console.log(state);
        return {
          ...state,
          reports: [...state.reports.filter(report => report.report_id !== action.payload)]
        }
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchReports.fulfilled, (state: reportSliceState, action) => {
      return {
        project_id: action.payload.project_id,
        reports: action.payload.data
      }
    });

    builder.addCase(getNewReport.fulfilled, (state: reportSliceState, action) => {
      return {
        ...state,
        reports: [...state.reports.filter(report => report.report_id !== action.payload.report_id), action.payload]
      }
    });
  },
});

export default reportSlice.reducer;
export const { filterReport } = reportSlice.actions;
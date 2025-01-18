import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL2 } from "../services/apis";
import { apiConnector } from "../services/apiconnector";

const initialState = {
  activities: [],
  stats: [],
  timeAnalysis: [],
  daily: [],
  window: [],
  category: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (startDate, endDate, category, limit, page) => {
    // const resp = await axios.get(`${BASE_URL2}/history`, {
    //   params: {
    //     startDate,
    //     endDate,
    //     category,
    //     limit,
    //     page,
    //   },
    // });
    // return resp.data;

    const instance = apiConnector("GET", `${BASE_URL2}/history`, null, null, {
      startDate,
      endDate,
      category,
      limit,
      page,
    });

    const resp = await instance;
    return resp.data;
  }
);

export const fetchStats = createAsyncThunk(
  "activity/fetchStats",
  async (startDate, endDate) => {
    // const resp = await axios.get(`${BASE_URL2}/stats`, {
    //   params: {
    //     startDate,
    //     endDate,
    //   },
    // });
    // return resp.data;

    const instance = apiConnector("GET", `${BASE_URL2}/stats`, null, null, {
      startDate,
      endDate,
    });

    const resp = await instance;
    return resp.data;
  }
);

export const fetchTimeAnalysis = createAsyncThunk(
  "activity/fetchTimeAnalysis",
  async (startDate, endDate) => {
    // const resp = await axios.get(`${BASE_URL2}/timeAnalysis`, {
    //   params: {
    //     startDate,
    //     endDate,
    //   },
    // });
    // return resp.data;

    const instance = apiConnector(
      "GET",
      `${BASE_URL2}/time-analytics`,
      null,
      null,
      {
        startDate,
        endDate,
      }
    );

    const resp = await instance;
    return resp.data;
  }
);

export const fetchDaily = createAsyncThunk(
  "activity/fetchDaily",
  async (date, id) => {
    const instance = apiConnector(
      "GET",
      `${BASE_URL2}/daily`,
      {
        userId: id,
      },
      null,
      {
        date,
      }
    );

    const resp = await instance;
    return resp.data;
  }
);

export const fetchWindow = createAsyncThunk(
  "activity/fetchWindow",
  async (date, id) => {
    const instance = apiConnector(
      "GET",
      `${BASE_URL2}/getwindow`,
      {
        userId: id,
      },
      null,
      {
        date,
      }
    );

    const resp = await instance;
    return resp.data;
  }
);

export const fetchCategory = createAsyncThunk(
  "activity/fetchCategory",
  async (startDate, endDate, category, id) => {
    const instance = apiConnector(
      "GET",
      `${BASE_URL2}/getcategory`,
      {
        userId: id,
      },
      null,
      {
        startDate,
        endDate,
        category,
      }
    );

    const resp = await instance;
    return resp.data;
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: initialState,
  reducers: {
    clearActivities(state) {
      state.activities = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActivities.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchActivities.fulfilled, (state, action) => {
      state.loading = false;
      state.activities = action.payload;
    });
    builder.addCase(fetchActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchTimeAnalysis.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTimeAnalysis.fulfilled, (state, action) => {
      state.loading = false;
      state.timeAnalysis = action.payload;
    });
    builder.addCase(fetchTimeAnalysis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchDaily.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDaily.fulfilled, (state, action) => {
      state.loading = false;
      state.daily = action.payload;
    });

    builder.addCase(fetchDaily.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchWindow.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchWindow.fulfilled, (state, action) => {
      state.loading = false;
      state.window = action.payload;
    });

    builder.addCase(fetchWindow.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload;
    });

    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;

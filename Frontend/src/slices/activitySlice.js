import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL2 } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import { memo } from "react";

const initialState = {
  user: null,
  activeHours: null,
  minutes: null,
  activities: [],
  stats: [],
  timeAnalysis: [],
  daily: [],
  category: [],
  loading: false,
  error: null,
  windows:[],
  linuxWindows:[],
  macWindows:[],
  windowsWindows:[],
  cpu: null,
  memory: null,
  disk: null,
  windowsCategory:[],
  linuxCategory:[],
  macCategory:[],
  windowsMatrix:[],
  linuxMatrix:[],
  macMatrix:[],
  windowsActiveHours:{
    hours:0,
    minutes:0,
    seconds:0
  },
  linuxActiveHours:{
    hours:0,
    minutes:0,
    seconds:0
  },
  macActiveHours:{
    hours:0,
    minutes:0,
    seconds:0
  },
};


export const fetchCategoryData = createAsyncThunk("activity/category", async (userId) => {
  const token=localStorage.getItem("token");
  const instance = apiConnector("GET", `${BASE_URL2}/category`, null, {
    Authorization: `Bearer ${token}`,
  }, {
    userId:userId
});

  const resp = await instance;

  console.log('category data',resp.data)
  return resp.data;
});


export const fetchUserData = createAsyncThunk("activity/userData", async (userId) => {
  const token=localStorage.getItem("token");
  const instance = apiConnector("GET", `${BASE_URL2}/userData`, null, {
    Authorization: `Bearer ${token}`,
  }, {
    userId:userId
});

  const resp = await instance;

  console.log('user data',resp.data)
  return resp.data;
});

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

const accumulateTime = (acc, curr) => {
  acc.hours += curr.duration.hours;
  acc.minutes += curr.duration.minutes;
  acc.seconds += curr.duration.seconds;
  return acc;
};

// Helper function to normalize time values
const normalizeTime = ({ hours, minutes, seconds }) => {
  minutes += Math.floor(seconds / 60);
  seconds %= 60;
  hours += Math.floor(minutes / 60);
  minutes %= 60;
  return { hours, minutes, seconds };
};

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
  async ({date,userId}) => {
    const token=localStorage.getItem("token");
    const instance = apiConnector(
      "GET",
      `${BASE_URL2}/getwindow`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      {
        date:date,
        userId: userId,
      }
    );

    const resp = await instance;
    console.log(resp.data)
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
      console.log('windows resp',action.payload)
      state.windows=action.payload?.data?.windowUsage
      state.linuxWindows=action.payload?.data?.linuxWindows
      state.macWindows=action.payload?.data?.macOsWindows
      state.windowsWindows=action.payload?.data?.windowsWindows
      console.log('windows',state.windows)
      state.windowsActiveHours = normalizeTime(
        state.windows.reduce(accumulateTime, { hours: 0, minutes: 0, seconds: 0 })
      );
      
      state.linuxActiveHours = normalizeTime(
        state.linuxWindows.reduce(accumulateTime, { hours: 0, minutes: 0, seconds: 0 })
      );
      
      state.macActiveHours = normalizeTime(
        state.macWindows.reduce(accumulateTime, { hours: 0, minutes: 0, seconds: 0 })
      );

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

    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload)
      state.user = action.payload.data.user;
      state.activeHours = action.payload.data.activeHours;
      state.minutes = action.payload.data.minutes;
      state.windowsMatrix = action.payload.data.platformMetrics.Windows;
      state.linuxMatrix = action.payload.data.platformMetrics.Linux;
      state.macMatrix = action.payload.data.platformMetrics.Mac;

    });

    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchCategoryData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchCategoryData.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload)
      state.windowsCategory = action.payload.data.Windows;
      state.linuxCategory = action.payload.data.Linux;
      state.macCategory = action.payload.data.Mac;

      console.log('mac category',action.payload.data.Mac)
    });

    builder.addCase(fetchCategoryData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });


   
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;

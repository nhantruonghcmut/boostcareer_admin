import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apijob } from "../api/api_jobs";

const initialState = {
  jobs: [],
  searchData: {
    title: "",
    industry: "",
    work_location: "",
    job_function: "",
    date_from: "",
    date_to: "",
    salary_min: "",
    salary_max: "",
    level_id: "",
    employer_id: "",
    require_experience: "",
    status_: "",
  },
  paging: {    
    active_page: 1,
    paging_size: 10,
    totalItems: 0,
    totalPages: 1}, 
};
const API_URL = "/api/job";
const jobSlice = createSlice({
  name: "Jobs_slice",
  initialState,
  reducers: {
    setjobs: (state, action) => {
      console.log("seetjob action");
      state.jobs = action.payload;
    },    
    setSearchData: (state, action) => {
      if (typeof action.payload === 'object' && action.payload !== null) {
        Object.entries(action.payload).forEach(([key, value]) => {
          state.searchData[key] = value;
        })
      }
      else {
        state.searchData[action.payload.key] = action.payload.value;
      }
    },
    setPaging: (state, action) => {
      if (typeof action.payload === 'object' && action.payload !== null) {
        Object.entries(action.payload).forEach(([key, value]) => {
          state.paging[key] = value;
        })
      }
      else {
        state.paging[action.payload.key] = action.payload.value;
      }
    },
  },
   extraReducers: (builder) => {
    builder.addMatcher(
      apijob.endpoints.fetchJobs.matchFulfilled,
      (state, action) => {
        console.log("Fetched jobs data:", action);
        state.jobs = action.payload.jobs;
        state.paging.totalPages = action.payload.totalPages || 1;
        state.paging.totalItems = action.payload.totalItems || 0;
      }
    );
    },
});

export const { setjobs, setSearchData, resetSearchData,setPaging } = jobSlice.actions;
export default jobSlice.reducer;

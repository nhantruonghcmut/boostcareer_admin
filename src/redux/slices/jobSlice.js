import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apijob } from "../api/api_job";

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
      apijob.endpoints.search_job.matchFulfilled, // Lắng nghe API đang xử lý
      (state, action) => {
        console.log("kiểm tra action.payload tai seach_job: ", action);
        state.jobs = action.payload.jobs; // Cập nhật danh sách jobs
        state.paging.totalPages = action.payload.totalPages;
        state.paging.active_page = 1;
      }); 
      builder.addMatcher(
        apijob.endpoints.get_all_job.matchFulfilled, // Lắng nghe API đang xử lý
        (state, action) => {
          console.log("kiểm tra action.payload tai get_all_job: ", action);
          state.jobs = action.payload.jobs; // Cập nhật danh sách jobs
          state.paging.totalPages = action.payload.totalPages;
          state.paging.active_page = 1;
        });
    },
});

export const { setjobs, setSearchData, resetSearchData,setPaging } = jobSlice.actions;
export default jobSlice.reducer;

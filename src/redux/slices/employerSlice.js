import { createSlice } from "@reduxjs/toolkit";
import { apiEmployer } from "../api/api_employers";

const initialState = {
    employers: [],
    searchData: {
    employer_id: "",
    username: "",
    company_name: "",
    email: "",
    industry_id: "",
    work_location: "",
    city_name: "",
    scale: "",
    employer_status: "",
  },
  paging: {    
    active_page: 1,
    paging_size: 10,
    totalItems: 0,
    totalPages: 1}, 
};
const API_URL = "/api/employer";
const EmployersSlice = createSlice({
  name: "Employers_slice",
  initialState,
  reducers: {
    setEmployers: (state, action) => {
      console.log("set employers action");
      state.employers = action.payload;
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
      apijob.endpoints.fetchEmployers.matchFulfilled,
      (state, action) => {
        console.log("Fetched Employers data:", action);
        state.employers = action.payload.Employers;
        state.paging.totalPages = action.payload.totalPages || 1;
        state.paging.totalItems = action.payload.totalItems || 0;
      }
    );
    },
});

export const { setEmployers, setSearchData, setPaging } = EmployersSlice.actions;
export default EmployersSlice.reducer;

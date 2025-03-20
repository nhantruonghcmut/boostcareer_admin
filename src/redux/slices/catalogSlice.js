import { createSlice } from "@reduxjs/toolkit";
import { apiCatalog } from "../api/api_catalog";

const initialState = {
  industries: [], // Danh sách ngành nghề
  jobfunctions:[],
  cities:[],
  joblevels:[],
  experiences:[{id:0,name:"Không yêu cầu"},{id:1,name:"Dưới 1 năm"},{id:2,name:"1-3 năm"},{id:3,name:"3-5 năm"},{id:4,name:"5-10 năm"},{id:5,name:"Trên 10 năm"}],
  job_status:[{id:1,name:"Đang mở"},{id:2,name:"Đã đóng"}],
};



const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setIndustries: (state, action) => {
      state.industries = action.payload;
    },    
    setJobfunctions: (state, action) => {
      state.jobfunctions = action.payload;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setJoblevels: (state, action) => {
      state.joblevels = action.payload;
    },
    // setExperiences: (state, action) => {
    //   state.experiences = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogIndustry.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.industries = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogJobfunction.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.jobfunctions = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogcity.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.cities = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogJoblevel.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.joblevels = action.payload; // Cập nhật industries trong Redux store
      }
    );
    // builder.addMatcher(
    //   apiCatalog.endpoints.getCatalogExperience.matchFulfilled, // Lắng nghe API thành công
    //   (state, action) => {
    //     state.experiences = action.payload; // Cập nhật industries trong Redux store
    //   }
    // );
  },
});

export const { setIndustries,setJobfunctions,setCities,setJoblevels } = catalogSlice.actions;
export default catalogSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/api__base"; // Import đúng baseApi
import { apiCatalog } from "./api/api_catalog"; // Import API catalog
import catalogReducer from "./slices/catalogSlice";
import uiReducer from "./slices/uiSlice";
import { apijob } from "./api/api_jobs";
import { apiEmployers } from "./api/api_employers";
import jobReducer from "./slices/jobSlice";
import EmployersReducer from "./slices/employerSlice";
export const store = configureStore({
  reducer: {
    catalog_state: catalogReducer,
    Jobs_state: jobReducer,  // Thêm reducer cho job
    Employers_state: EmployersReducer,  // Thêm reducer cho employer
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer, // Đăng ký baseApi vào store
    [apiCatalog.reducerPath]: apiCatalog.reducer, // Đăng ký apiCatalog vào store
    [apijob.reducerPath]: apijob.reducer, // Đăng ký api job vào store
    [apiEmployer.reducerPath]: apiEmployers.reducer, // Đăng ký api employer vào store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(apiCatalog.middleware).concat(apijob.middleware).concat(apiEmployers.middleware), // Thêm middleware cho api job,
  
});
// setupListeners: (store.dispatch);
export default store;

// import { get } from "core-js/core/dict";
import { baseApi } from "./api__base";

export const apiCatalog = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogIndustry: builder.query({
      query: () => "/api/category/getCategory_Industry",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogJobfunction: builder.query({
      query: () => "/api/category/getCategory_Jobfunction",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogJoblevel: builder.query({
      query: () => "/api/category/getCategory_Level",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),     
    // getCatalogExperience: builder.query({ //! chưa có!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //   query: () => "/api/category/getCategory_Experience",
    //   transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    // }),
    getCatalogcity: builder.query({
      query: () => "/api/category/getCategory_City",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
  }),
});

export const {  useGetCatalogIndustryQuery,
                useGetCatalogJobfunctionQuery,
                useGetCatalogJoblevelQuery,
                // useGetCatalogExperienceQuery,
                useGetCatalogcityQuery, 
            } = apiCatalog; // Đảm bảo export đúng tên

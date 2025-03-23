// import { get } from "core-js/core/dict";
import { baseApi } from "./api__base";
  /////////////////// BỎ TAGS VÌ NẾU DÚNG NÓ SẼ LUÔN GỌI get_all_job KHI  jobs có sự thay đổi bất kỳ ==> ko giữ được kết quả search sau khi xóa / update

export const apijob = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchJobs: builder.query({
      query: (params = {}) => {
        console.log("Query params received:", params); // Log để kiểm tra
        const { searchData, paging } = params;
        if (!params.searchData || (Object.values(params.searchData).every(val => val === "")
        && Object.values(params.paging).every(val => val === null || val === "")))  {
          return {
            url: `/api/job/get_all_job`,
            method: 'GET'
          };
        } 
        
        // Ngược lại, gọi search endpoint với searchData và paging
        return {
          url: `/api/job/search`,
          method: 'POST',
          body: { searchData, paging }
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return JSON.stringify(queryArgs);},
      providesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
      transformResponse: (response) => {console.log("thu được từ search_job : ",response);  return response}, // kiểm soát: console dữ liệu từ backend
    }),
    delete_jobs: builder.mutation({
      query: (job_ids) => ({
        url: `/api/job/deletejobs`,
        method: 'DELETE',
        body: job_ids,
      }),
      invalidatesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
    }),
    update_job: builder.mutation({
      query: (job) => ({
        url: `/api/job/updatejob`,
        method: 'PUT',
        body: job,
      }),
      invalidatesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
    }),   
    update_status_: builder.mutation({
      query: ({ status_, job_ids }) =>  {
        console.log("update_status", status_, job_ids);
        return {
        url: `/api/job/update_status_`,
        method: 'POST',
        body: {status_,job_ids},}},
      invalidatesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
    }),         
  }),
});

export const { useFetchJobsQuery,useDelete_jobsMutation,useUpdate_jobMutation, useUpdate_status_Mutation} = apijob; // Đảm bảo export đúng tên

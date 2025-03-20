// import { get } from "core-js/core/dict";
import { baseApi } from "./api__base";
  /////////////////// BỎ TAGS VÌ NẾU DÚNG NÓ SẼ LUÔN GỌI get_all_job KHI  jobs có sự thay đổi bất kỳ ==> ko giữ được kết quả search sau khi xóa / update

export const apijob = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get_all_job: builder.query({
      query: () => `/api/job/get_all_job`,
      method: 'GET',      
      transformResponse: (response) => {console.log("thu được từ get_all_job : ",response);  return response}, // kiểm soát: console dữ liệu từ backend

    }),
    search_job: builder.mutation({
      query: ({searchData, paging}) => ({
        url: `/api/job/search`,
        method: 'POST',
        body: {searchData,paging} , // Thêm tham số truyền vào cho query
      }),
      providesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
      transformResponse: (response) => {console.log("thu được từ search_job : ",response);  return response}, // kiểm soát: console dữ liệu từ backend
    }),
    delete_job: builder.mutation({
      query:(job_id) => ({
        url: `/api/job/deletejob/${job_id}`,
        method: 'DELETE',
      }),      
      invalidatesTags: ["SearchedJobs"], // Thêm invalidatesTags để tự động cập nhật sau khi xóa
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
      query: (status_,job_ids) => ({
        url: `/api/job/update_status_`,
        method: 'POST',
        body: {status_,job_ids},
      }),
      invalidatesTags: ["SearchedJobs"], // Tag để đánh dấu cho quản lý endpoint
    }),         
  }),
});

export const { useGet_all_jobQuery,useSearch_jobMutation,useDelete_jobMutation,useDelete_jobsMutation,useUpdate_jobMutation, useUpdate_status_Mutation} = apijob; // Đảm bảo export đúng tên

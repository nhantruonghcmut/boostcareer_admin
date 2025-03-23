import { baseApi } from "./api__base";

export const apiEmployers = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEmployers: builder.query({
      query: (params = {}) => {
        console.log("Query params received:", params); // Log để kiểm tra
        const { searchData, paging } = params;
        if (!params.searchData || (Object.values(params.searchData).every(val => val === "")
        && Object.values(params.paging).every(val => val === null || val === "")))  {
          return {
            url: `/api/employer/get_all_employer`,
            method: 'GET'
          };
        } 
        
        // Ngược lại, gọi search endpoint với searchData và paging
        return {
          url: `/api/employer/search_employer`,
          method: 'POST',
          body: { searchData, paging }
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return JSON.stringify(queryArgs);},
      providesTags: ["Employer"], // Tag để đánh dấu cho quản lý endpoint
      transformResponse: (response) => {console.log("thu được từ fetchEmployer : ",response);  return response}, // kiểm soát: console dữ liệu từ backend
    }),
    delete_Employers: builder.mutation({
      query: (Employers_ids) => ({
        url: `/api/employer/delete_employer`,
        method: 'DELETE',
        body: Employers_ids,
      }),
      invalidatesTags: ["Employer"], // Tag để đánh dấu cho quản lý endpoint
    }),
    update_Employers: builder.mutation({
      query: (Employers) => ({
        url: `/api/employer/updateEmployers`,
        method: 'PUT',
        body: Employers,
      }),
      invalidatesTags: ["Employer"], // Tag để đánh dấu cho quản lý endpoint
    }),   
    update_status_Employers: builder.mutation({
      query: ({ status_, Employers_ids }) =>  {
        console.log("update_status", status_, Employers_ids);
        return {
        url: `/api/employer/update_status_`,
        method: 'POST',
        body: {status_,Employers_ids},}},
      invalidatesTags: ["Employer"], // Tag để đánh dấu cho quản lý endpoint
    }),
    send_message: builder.mutation({
      query: (message) => ({
        url: `/api/employer/send_message`,
        method: 'POST',
        body: message,  })         
    }),
    reset_Password: builder.mutation({
      query: (employer_ids) => ({
        url: `/api/employer/reset_password`,
        method: 'POST',
        body: employer_ids,  })         
    }),
  }),
});

export const { 
  useFetchEmployersQuery,
  useDelete_EmployersMutation,
  useUpdate_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_messageMutation,
  useReset_PasswordMutation,
  } = apiEmployers; // Đảm bảo export đúng tên

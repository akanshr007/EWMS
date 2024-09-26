import { API_ENDPOINTS } from "utils/constants";
import { api } from "./api";


export const extendedApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get Roles List
    getRoles: builder.query({
      query: ({ page }) => ({
        url: `${API_ENDPOINTS.ROLE_LIST}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    getPmUsers: builder.query({
      query: ({ page }) => ({
        url: `${API_ENDPOINTS.GET_PM_EMPLOYEE}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    getMyUsers: builder.query({
      query: ({ page }) => ({
        url: `${API_ENDPOINTS.GET_DAILY_LIST}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    // Get Users List Based On Roles
    getUsers: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.ROLE_USERS,
        method: "POST",
        body,
      }),
    }),

    // Get Users List Based On Roles
    getUsersByRole: builder.query({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.USERS_BY_ROLE}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (res: any) => res?.data,
    }),

    // Get All Employees List
    getAllUsers: builder.query({
      query: ({ page, limit, sortKeyName, sortOrder }) => ({
        url: `${API_ENDPOINTS.GET_ALL_USERS}/${page}/${limit}/${sortKeyName}/${sortOrder}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (res: any) => res?.data,
    }),
  }),
});

export const {
  useGetUsersMutation,
  useGetRolesQuery,
  useGetUsersByRoleQuery,
  useGetAllUsersQuery,
  useGetPmUsersQuery,
  useGetMyUsersQuery,
} = extendedApiSlice;

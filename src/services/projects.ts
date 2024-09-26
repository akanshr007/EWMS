import { API_ENDPOINTS } from "utils/constants";
import { api } from "./api";

export const extendedApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnabledProjects: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.ENABLED_PROJECTS}`,
      }),

      transformResponse: (res: any) => res?.data,
      transformErrorResponse: (error: any) => {
        return error;
      },
    }),
    // Get Projects List
    getProjects: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.GET_PROJECTS}`,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (res: any) => res?.data,
      transformErrorResponse: (error: any) => {
        return error;
      },
    }),

    // Create Project
    createProject: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `${API_ENDPOINTS.CREATE_PROJECT}/${projectId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["getProjectDetails"],
      transformErrorResponse: (error: any) => {
        return error;
      },
    }),

    // Get Project Assigned to employee
    getAssignedProjects: builder.mutation({
      query: ({ employeeId, ...body }) => ({
        url: `${API_ENDPOINTS.GET_ASSIGNED_PROJECTS}/${employeeId}`,
        method: "GET",
        body,
      }),
    }),

    //LEAVES API
    getLeaves: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.GET_LEAVES}`,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (res: any) => res?.data,
      transformErrorResponse: (error: any) => {
        return error;
      },
    }),

    // Get Detailed Projects List
    getDetailedProjects: builder.query({
      query: ({ page, limit, sortKeyName, sortOrder }) => ({
        url: `${API_ENDPOINTS.GET_DETAILED_PROJECTS}/${page}/${limit}/${sortKeyName}/${sortOrder}`,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["getProjectDetails"],
      transformResponse: (res: any) => res?.data,
    }),

    // Get Project Sale Type List
    getProjectSaleType: builder.query({
      query: ({ page }) => ({
        url: `${API_ENDPOINTS.SALE_TYPES}/${page}`,
      }),
      transformResponse: (res: any) => res?.data,
    }),

    // Get Project Detail By Id
    getProjectById: builder.mutation({
      query: (body) => ({
        url: `${API_ENDPOINTS.GET_PROJECT_BY_ID}`,
        method: "POST",
        body,
      }),
    }),

    // Enable Project
    enableProject: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.ENABLE_PROJECT,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useEnableProjectMutation,
  useGetProjectsQuery,
  useGetDetailedProjectsQuery,
  useCreateProjectMutation,
  useGetProjectSaleTypeQuery,
  useGetAssignedProjectsMutation,
  useGetLeavesQuery,
  useGetProjectByIdMutation,
  useGetEnabledProjectsQuery,
  // useUpdateProjectMutation,
} = extendedApiSlice;

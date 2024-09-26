import { API_ENDPOINTS } from "utils/constants";
import { api } from "./api";

export const extendedApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Log Hours of Employees
    logHours: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.LOG_HOURS,
        method: "POST",
        body,
      }),
    }),

    // Get Logging Hours of Employees
    // getLogHours: builder.query({
    //   query: (body) => ({
    //     url: API_ENDPOINTS.GET_LOG_HOURS,
    //     method: "GET",
    //     body,
    //   }),
    // }),

    // REFERENCE
    // query: ({ employeeId, ...body }) => ({
    //   url: `${API_ENDPOINTS.GET_ASSIGNED_PROJECTS}/${employeeId}`,

    // getLogHoursList: builder.query({
    //   query: ({ projectId, employeeId, ...body }) => ({
    //     url: `${API_ENDPOINTS.GET_LOG_HOURS_LIST}/${projectId}/${employeeId}`,
    //     method: "GET",
    //     body,
    //   }),
    // }),
    getLogHoursList: builder.query({
      query: ({ projectId, employeeId,page,limit,sortKeyName,sortOrder, ...body }) => {
        // Construct query parameters based on the presence of projectId and employeeId
        const queryParams = new URLSearchParams();
        // Always append parameters, even if they are empty
        queryParams.append("projectId", projectId == "All" ? "" : projectId);
        queryParams.append("employeeId", employeeId == "All" ? "" : employeeId);
        queryParams.append("page",  page);
        queryParams.append("limit", limit);
        queryParams.append("sortKeyName",  sortKeyName);
        queryParams.append("sortOrder", sortOrder);

        // Return the URL with query parameters
        return {
          url: `${API_ENDPOINTS.GET_LOG_HOURS_LIST}?${queryParams.toString()}`,
          method: "GET",
          body,
        };
      },
      keepUnusedDataFor: 0,
    }),

    getAllProjectList: builder.query({
      query: (body) => ({
        method: "GET",
        url: `${API_ENDPOINTS.GET_ALL_PROJECT_LIST}`,
        // params:{

        // },
        body,
      }),
    }),
  }),
});

export const {
  useLogHoursMutation,
  // useGetLogHoursQuery,
  useGetLogHoursListQuery,
  useGetAllProjectListQuery,
} = extendedApiSlice;

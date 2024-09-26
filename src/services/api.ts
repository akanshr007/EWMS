import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS, ENV } from "utils/constants";
import axiosBaseQuery from "./axios";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: ENV.API_HOST,
  }),
  tagTypes: ["getProjectDetails"],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (creds) => ({
        url: API_ENDPOINTS.LOGIN,
        method: "POST",
        body: creds,
      }),
    }),

    // Set Password
    setPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: API_ENDPOINTS.SET_PASSWORD,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: API_ENDPOINTS.RESET_PASSWORD,
        method: "PATCH",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.FORGOT_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.CHANGE_PASSWORD,
        method: "PATCH",
        body,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: API_ENDPOINTS.VERIFY_OTP,
        method: "POST",
        body,
      }),
    }),

    // Get Profile Data
    getProfile: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.GET_PROFILE}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    // Get Permissions
    getPermissions: builder.query({
      query: () => ({
        url: `${API_ENDPOINTS.PERMISSIONS}`,
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data,
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.LOGOUT,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSetPasswordMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useGetPermissionsQuery,
  useLazyGetPermissionsQuery,
  useLogoutMutation,
} = api;

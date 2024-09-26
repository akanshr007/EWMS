import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import toast from "react-hot-toast";

const handleError = (error: any) => {
  if (error?.status === 401) {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    // persistor?.purge();
  }
  const msg = error?.data?.message || error?.message;
  if (msg) {
    if (Array.isArray(msg)) {
      toast.error(msg[0]);
    } else {
      toast.error(msg);
    }
  }
};

export const axiosRequest = (setLoaderStatus: any) =>
  axios.interceptors.request.use(
    (config) => {
      setLoaderStatus(true);
      return config;
    },
    (error) => {
      setLoaderStatus(false);

      return error;
    }
  );

// Add a response interceptor
export const axiosResponse = (setLoaderStatus: any) =>
  axios.interceptors.response.use(
    (response) => {
      setLoaderStatus(false);
      return response;
    },
    (error) => {
      setLoaderStatus(false);

      throw error;
    }
  );

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, body, params, headers }) => {
    try {
      // Set Default Headers
      const token = localStorage.getItem("token");
      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...headers,
      };

      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: defaultHeaders,
      });

      const finalData = { data: result.data };
      return finalData;
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const finalError = {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      };
      handleError(finalError);
      return finalError;
    }
  };

export default axiosBaseQuery;

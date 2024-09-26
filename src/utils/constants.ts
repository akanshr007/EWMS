export * as Yup from "yup";

type ModuleRoutes = {
  [key: string]: {
    READ: string[];
    WRITE: string[];
  };
};

const API_DATA_LIMIT = 10;
const API_ENDPOINTS = {
  // Auth
  LOGIN: "auth/login",
  SET_PASSWORD: "auth/set-password",
  RESET_PASSWORD: "auth/reset-password",
  FORGOT_PASSWORD: "auth/forgotPassword",
  CHANGE_PASSWORD: "auth/changePassword",
  VERIFY_OTP: "auth/verify-otp",
  GET_PROFILE: "employee/profile",
  PERMISSIONS: "permission/permissions",
  LOGOUT: "auth/logout",
  // Projects
  GET_PROJECTS: "project/project-list",
  ENABLED_PROJECTS: "project/enabled-project",

  GET_ASSIGNED_PROJECTS: "project/logs/details",
  GET_LOG_HOURS_LIST: "employee/daily-report-listing",
  GET_ALL_PROJECT_LIST: "project/all_project_list",
  GET_DETAILED_PROJECTS: "project/project-detailed-list",
  GET_PROJECT_BY_ID: "project/project-detailed-data",
  ENABLE_PROJECT: "project/enable-project",
  UPDATE_PROJECT: "update-project",
  CREATE_PROJECT: "project/create-project",
  SALE_TYPES: "project/sale-types",
  // Users
  ROLE_LIST: "project/role-list",
  ROLE_USERS: "project/role",
  USERS_BY_ROLE: "project/role",
  GET_ALL_USERS: "employee/employee_list",
  // Log Hours
  LOG_HOURS: "project/logs/loghours",
  GET_LEAVES: "project/leaves",
  GET_LOG_HOURS: "daily-report",
  GET_PM_EMPLOYEE: "employee/pm_team_members",
  GET_DAILY_LIST: "employee/all_members",
};
const ROUTES = {
  // AUTH
  ROOT: "/",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CHANGE_PASSWORD: "/change-password",
  SET_PASSWORD: "/set-password",

  // PROJECTS
  PROJECTS: "/projects",
  ENABLE_PROJECT: "/enable-projects", // Just to handle enable button conditionally, this route is not present in the routes
  CREATE_PROJECT: "/create-project",
  EDIT_PROJECT: "/edit-project",

  // TEAM-MEMBERS
  EMPLOYEES: "/team-members",

  // LOG HOURS
  REPORTS: "/time-logs",
  ADD_REPORT: "/log-hours",
};
const ENV = {
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY,
  API_HOST: `${process.env.REACT_APP_API_HOST}admin/api/v1/`,
};

const REGEX = {
  PASSWORD:
    /^(?=.*\d)(?=.*[~!.@#$^&*)(_+:[}="`-])(?=.*[a-z])(?=.*[A-Z])[~!@.#$^&*)(+:[}="`\w-]{8,32}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@antiersolutions\.com$/,
  PPROJECT_NAME: /^[a-zA-Z0-9\- ]{3,50}$/,
  REPORTING_CODE: /^[A-Z0-9\-]+$/,
};

const VALIDATION_MESSAGES = {
  REQUIRED: (fieldName: string) => `Please enter ${fieldName}`,
  SELECT_REQUIRED: "Please select the item",

  WRONG_EMAIL: "Please enter a valid email",
  WRONG_PASSWORD:
    "Please enter a password containing at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.",
  MATCH_PASSWORDS: "Passwords must match",

  WRONG_PROJECT_NAME: "Please enter a valid project name",
  WRONG_REPORTING_CODE:
    "Reporting code must contain only uppercase letters, numbers, and dashes",

  MAXIMUM_5_DIGITS: "Value must be less than or equal to 99999",
  MAXIMUM_10_DIGITS: "Value must be less than or equal to 9999999999",
  GREATER_THAN_ZERO: "Value must be greater than zero",
  MUST_BE_INTEGER: "Please enter a whole number (without decimal points)",
  MUST_BE_NUMBER: "Value must be a number",
  MAXIMUM_8_HOURS: "Value must be less than or equal to 8 hours",
  LOGGED_HOURS: "Logged hours must be between 01:00 to 08:00",
  MAXIMUM_8_HOURS_PER_DAY: "Total hours per day cannot exceed 8",
  TOTAL_HOURS_MUST_BE_8: "Total hours (work + leave) must equal 8.",
};

const MODULE_ROUTES: ModuleRoutes = {
  "EP-100": {
    READ: [ROUTES.PROJECTS],
    WRITE: [ROUTES.ENABLE_PROJECT],
  },
  "CP-100": {
    READ: [ROUTES.PROJECTS],
    WRITE: [ROUTES.CREATE_PROJECT, ROUTES.EDIT_PROJECT],
  },

  "UM-100": {
    READ: [ROUTES.EMPLOYEES],
    WRITE: [],
  },

  "RP-100": {
    READ: [ROUTES.REPORTS],
    WRITE: [ROUTES.ADD_REPORT],
  },
};

const READABLE_ROUTES = [ROUTES.EMPLOYEES, ROUTES.REPORTS, ROUTES.PROJECTS];

const ROLES = [
  { id: "100", role: "ADMIN" },
  { id: "101", role: "TPM" },
  { id: "102", role: "TL" },
  { id: "103", role: "DEVOPS" },
  { id: "104", role: "UI/UX" },
  { id: "105", role: "DEVELOPER" },
  { id: "106", role: "QA" },
  { id: "107", role: "BA" },
  { id: "108", role: "DESIGNER" },
  { id: "109", role: "SM" },
  { id: "110", role: "PC" },
  { id: "111", role: "PM" },
  { id: "112", role: "MARKETING REP" },
  { id: "113", role: "SALES REP" },
  { id: "114", role: "MANAGEMENT" },
  { id: "115", role: "HR REP" },
];

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  // "Sunday",
];

export {
  API_DATA_LIMIT,
  ROUTES,
  ENV,
  REGEX,
  VALIDATION_MESSAGES,
  API_ENDPOINTS,
  MODULE_ROUTES,
  READABLE_ROUTES,
  WEEK_DAYS,
};

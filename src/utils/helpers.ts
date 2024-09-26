// import moment from "moment";
import { API_DATA_LIMIT, ENV, MODULE_ROUTES } from "./constants";
import CryptoJS from "crypto-js";

type StringOrObject = string | { [key: string]: any };

const isLoggedIn = (): boolean => {
  let token = localStorage.getItem("token");
  const isTokenValid =
    token !== "null" && token !== "undefined" && token !== "";
  if (isTokenValid) {
    return !!token;
  } else {
    return false;
  }
};

const getSerialNumbers = (index: number, offset: number) => {
  if (offset) {
    return offset * API_DATA_LIMIT - API_DATA_LIMIT + index + 1;
  }
};

const checkValidData = <Type>(
  value: Type,
  config?: { isNumber: boolean }
): Type | string => {
  if (value) {
    return value;
  } else if (config?.isNumber) {
    return "0";
  }
  return "N/A";
};




const getDropdownOptions = (label: string, value: string | number) => {
  if (label && value) {
    return {
      label,
      value,
    };
  }
};
const transformData = (data: any) => {
  console.log("DATA", data);

  // Initialize the transformed data structure
  let transformedData = {
    employeeId: data.employeeName.value,
    logs: [] as {
      projectId: string;
      details: { logDate: string; logHours?: number; extraHours?: number }[];
    }[],
  };
  data.projectsData.forEach((project: any) => {
    // Initialize an object to store the project's log details
    let projectLog = {
      projectId: project.projectId,
      details: [] as {
        logDate: string;
        logHours?: number;
        extraHours?: number;
      }[],
    };

    // Process each date for the project
    project.dates.forEach((date: any) => {
      // Check if either hours or extraHours is not empty
      if (
        (date.hours !== "" &&
          date.hours !== undefined &&
          date.hours !== null) ||
        (date.extraHours !== "" &&
          date.extraHours !== undefined &&
          date.extraHours !== null)
      ) {
        // Create a log entry for the date
        let logEntry: any = {
          logDate: date.date,
        };

        // Add logHours if present
        if (
          date.hours !== "" &&
          date.hours !== undefined &&
          date.hours !== null
        ) {
          logEntry.logHours = date.hours;
        }

        // Add extraHours if present
        if (
          date.extraHours !== "" &&
          date.extraHours !== undefined &&
          date.extraHours !== null
        ) {
          logEntry.extraHours = date.extraHours;
        }

        // Add log entry to the project's details
        projectLog.details.push(logEntry);
      }
    });

    // Add project log to the transformed data only if details are not empty
    if (projectLog.details.length > 0) {
      transformedData.logs.push(projectLog);
    }
  });

  return transformedData;
};

// Encryption
const key = ENV.ENCRYPTION_KEY;
const encryptData = (data: StringOrObject) => {
  if (key) {
    const stringData = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(stringData, key).toString();
    return ciphertext;
  }
};
const decryptData = (data: string) => {
  if (key) {
    const bytes = CryptoJS.AES.decrypt(data, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  }
};

const isNumber = (evt: any) => {
  evt = evt ? evt : window.event;
  const charCode = evt.which ? evt.which : evt.keyCode;
  const input = evt.target.value;

  // Prevent entry if Shift key is held down, or for specific key codes (minus sign, 'e', etc.)
  if (
    evt?.nativeEvent?.shiftKey === true || // Shift key
    charCode === 189 || // Dash/Hyphen key (-)
    charCode === 109 || // Numpad Dash/Hyphen key (-)
    charCode === 69 // E key (for scientific notation)
  ) {
    return true; // Block these inputs
  }

  // Allow left/right arrow keys, backspace, delete, tab, and ctrl+v/ctrl+c
  if (
    charCode === 37 || // Left arrow
    charCode === 39 || // Right arrow
    charCode === 8 || // Backspace
    charCode === 46 || // Delete
    charCode === 9 || // Tab
    (charCode === 86 && evt?.nativeEvent?.ctrlKey === true) || // Ctrl+V
    (charCode === 67 && evt?.nativeEvent?.ctrlKey === true) || // Ctrl+C
    (95 < charCode && charCode < 106) // Numpad 0-9
  ) {
    return false; // Allow these inputs
  }

  // Allow one decimal point if not already present
  if ((charCode === 190 || charCode === 110) && input.includes(".")) {
    return true; // Block second decimal point input
  }

  // Allow first decimal point
  if (charCode === 190 || charCode === 110) {
    return false; // Allow one decimal point input
  }

  // Allow only number keys
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return true; // Block anything that's not a number
  }

  return false; // Allow number input
};

export {
  isLoggedIn,
  getSerialNumbers,
  encryptData,
  decryptData,
  checkValidData,
  getDropdownOptions,
  transformData,
  isNumber,
};

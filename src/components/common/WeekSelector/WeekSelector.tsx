import React, { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
} from "date-fns";
import { NextArrowIcon2, PrevArrowIcon } from "assets/images/Svgicons";
import "./WeekSelector.scss";

// Define and export getWeekDays function
export const getWeekDays = (currentWeek: Date) => {
  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start week on Monday
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 }); // End week on Sunday

  let days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeekDate, i);
    days.push({
      date,
      formattedDate: format(date, "yyyy-MM-dd"), // Full date (e.g., 2024-07-22)
      formattedDay: format(date, "EEEE").slice(0, 3), // Day of the week (e.g., Mon)
      shortDate: format(date, "d"), // Just date (e.g. 7)
      month: format(date, "MMM"), // Month (e.g. July)
    });
  }
  return days;
};

const WeekSelector = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get the start and end date of the current week
  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start week on Monday
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 }); // End week on Sunday

  // Handler for previous week button
  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  // Handler for next week button
  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  return (
    <div className="week-selector">
      {/* <button onClick={handlePreviousWeek}>
        {" "}
        <PrevArrowIcon />
      </button> */}
      <div>
        {format(startOfWeekDate, "MMM dd")} - {format(endOfWeekDate, "MMM dd")}
      </div>
      {/* <button onClick={handleNextWeek}>
        <NextArrowIcon2 />
      </button> */}
    </div>
  );
};

export default WeekSelector;

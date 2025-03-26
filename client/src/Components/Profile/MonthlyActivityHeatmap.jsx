import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFireAlt, FaChartLine } from "react-icons/fa";

const MonthlyActivityHeatmap = ({
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  avgPerDay,
  maxStreak,
  dailyActivity,
}) => {

  // console.log("avgPerDay", avgPerDay);
  // console.log("maxStreak", maxStreak);
  // console.log("dailyActivity", dailyActivity);
  // Generate dates for the current month
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const [activityData, setActivityData] = useState([]);
  const [stats, setStats] = useState({
    maxSolved: 0,
    totalSolved: 0,
    avgPerDay: avgPerDay,
    streakDays: maxStreak,
  });

  // Define color ranges with labels
  const colorRanges = [
    { range: "0", color: "bg-gray-100", textColor: "text-gray-800" },
    { range: "1-5", color: "bg-emerald-200", textColor: "text-gray-800" },
    { range: "6-10", color: "bg-emerald-400", textColor: "text-gray-800" },
    { range: "11-15", color: "bg-emerald-600", textColor: "text-white" },
    { range: "15+", color: "bg-emerald-800", textColor: "text-white" },
  ];

  // Generate dummy data for the month
  useEffect(() => {
    if (!dailyActivity?.length) return;

    // Populate activity data with dailyActivity or default to 0 solved
    const data = Array.from({ length: getDaysInMonth(month, year) }, (_, index) => {
      const day = index + 1;
      const activity = dailyActivity.find(d => new Date(d.date).getDate() === day);
      return {
      day,
      date: new Date(year, month, day),
      solved: activity ? activity.count : 0
      };
    });

    setActivityData(data);

    // Calculate stats
    const maxSolved = Math.max(...data.map(d => d.solved));
    const totalSolved = data.reduce((sum, d) => sum + d.solved, 0);

    setStats({
      maxSolved,
      totalSolved,
      avgPerDay: Number(avgPerDay).toFixed(2),
      streakDays: maxStreak
    });
  }, [dailyActivity, avgPerDay, maxStreak]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getActivityColor = (solved) => {
    if (solved === 0) return colorRanges[0].color;
    if (solved >= 1 && solved <= 5) return colorRanges[1].color;
    if (solved >= 6 && solved <= 10) return colorRanges[2].color;
    if (solved >= 11 && solved <= 15) return colorRanges[3].color;
    return colorRanges[4].color;
  };

  const getActivityTextColor = (solved) => {
    if (solved === 0) return colorRanges[0].textColor;
    if (solved >= 1 && solved <= 5) return colorRanges[1].textColor;
    if (solved >= 6 && solved <= 10) return colorRanges[2].textColor;
    if (solved >= 11 && solved <= 15) return colorRanges[3].textColor;
    return colorRanges[4].textColor;
  };

  // Calculate empty cells before the first day of the month
  const firstDay = getFirstDayOfMonth(month, year);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-evenly bg-white rounded-2xl px-6 pb-6 shadow-sm h-full"
    >
      <div className="flex justify-between items-center mb-6 pt-3 sm:pt-4">
        <div className="flex items-center space-x-2">
          <h2 className="flex justify-between text-base sm:text-lg font-semibold text-gfgsc-green items-center">
            <span>
              {monthNames[month]} {year} Activity
            </span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {colorRanges.map((range, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded group relative cursor-pointer ${range.color}`}
              >
                <span className="absolute top-6 right-0 whitespace-nowrap text-xs text-gray-700 bg-white text-center px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100">
                  {range.range} problems
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-xs text-center text-gray-500 font-medium"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyCells.map((i) => (
            <div key={`empty-${i}`} className="h-10"></div>
          ))}

          {activityData.map((day) => (
            <motion.div
              key={day.day}
              className={`h-10 group cursor-pointer rounded-lg flex items-center justify-center relative ${getActivityColor(
                day.solved
              )}`}
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex flex-col items-center ">
                <span
                  className={`text-xs font-bold ${getActivityTextColor(
                    day.solved
                  )}`}
                >
                  {day.day}
                </span>
                <span className="absolute top-0 whitespace-nowrap text-xs text-gray-700 bg-white text-center px-1 rounded shadow-md opacity-0 group-hover:opacity-100">
                  {day.solved} solved
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gfgsc-green-200 flex items-center justify-center mb-1">
              <FaChartLine className="text-gfgsc-green" />
            </div>
            <p className="text-xl font-bold text-gfg-black">
              {stats.maxSolved}
            </p>
            <p className="text-xs text-gray-500">Max Solved</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gfgsc-green-200 flex items-center justify-center mb-1">
              <FaFireAlt className="text-gfgsc-green" />
            </div>
            <p className="text-xl font-bold text-gfg-black">
              {stats.streakDays}
            </p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gfgsc-green-200 flex items-center justify-center mb-1">
              <FaChartLine className="text-gfgsc-green" />
            </div>
            <p className="text-xl font-bold text-gfg-black">
              {stats.avgPerDay}
            </p>
            <p className="text-xs text-gray-500">Avg Per Day</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonthlyActivityHeatmap;
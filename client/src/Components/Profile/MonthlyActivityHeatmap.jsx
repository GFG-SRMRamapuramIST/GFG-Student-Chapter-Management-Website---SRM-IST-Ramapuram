import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFireAlt, FaChartLine } from "react-icons/fa";

const MonthlyActivityHeatmap = ({
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}) => {
  // Generate dates for the current month
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const [activityData, setActivityData] = useState([]);
  const [stats, setStats] = useState({
    maxSolved: 0,
    totalSolved: 0,
    avgPerDay: 0,
    streakDays: 0,
  });

  // Generate dummy data for the month
  useEffect(() => {
    const daysInMonth = getDaysInMonth(month, year);
    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const solved = Math.floor(Math.random() * 8); // 0-7 problems solved
      return {
        day: i + 1,
        date: new Date(year, month, i + 1),
        solved: solved,
      };
    });

    setActivityData(data);

    // Calculate stats
    const maxSolved = Math.max(...data.map((d) => d.solved));
    const totalSolved = data.reduce((sum, d) => sum + d.solved, 0);
    const avgPerDay = +(totalSolved / daysInMonth).toFixed(1);

    // Calculate streak
    let currentStreak = 0;
    let maxStreak = 0;
    for (const day of data) {
      if (day.solved > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    setStats({
      maxSolved,
      totalSolved,
      avgPerDay,
      streakDays: maxStreak,
    });

    console.log(data); // CHECK THIS FOR DATA SCHEMA
  }, [month, year]);

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
    if (solved === 0) return "bg-gray-100";
    if (solved === 1) return "bg-emerald-100";
    if (solved === 2) return "bg-emerald-200";
    if (solved === 3) return "bg-emerald-300";
    if (solved === 4) return "bg-emerald-400";
    if (solved === 5) return "bg-emerald-500";
    if (solved === 6) return "bg-emerald-600";
    return "bg-emerald-700";
  };

  const getActivityTextColor = (solved) => {
    if (solved >= 5) return "text-white";
    return "text-gray-800";
  };

  // Calculate empty cells before the first day of the month
  const firstDay = getFirstDayOfMonth(month, year);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl px-6 pb-6 shadow-sm"
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
          <span className="text-xs text-gray-500">Problems Solved</span>
          <div className="flex items-center space-x-1">
            {[0, 2, 4, 6].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getActivityColor(level)}`}
              />
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

'use client';

import { useState, useEffect } from "react";
import { checkIn, checkOut, fetchUserRecordsByDate } from "./action";
import { signOut, useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ProfileTable from "@/components/profileTable";
import TotalEmployees from '@/components/TotalEmployees';
import OnTimeToday from '@/components/OnTimeToday';
import LateToday from '@/components/LateToday';
import OnTimePercentage from '@/components/OnTimePercentage';
import CheckInOutTable from "@/components/CheckInOutTable";
import AbsentToday from '@/components/AbsentToday';
import DeviceCategoryChart from "@/components/DeviceCategoryChart";
import MapOne from "@/components/Maps/MapOne";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Main() {
  const { data: session } = useSession();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkInTimestamp, setCheckInTimestamp] = useState("");
  const [checkOutTimestamp, setCheckOutTimestamp] = useState("");
  const [value, onChange] = useState<Value>(new Date());

  useEffect(() => {
    // Function to call when the calendar value changes
    console.log("Calendar value changed:", value);
    findMatchingDates(value);
  }, [value]);

  const findMatchingDates = async (value: Value) => {
    try {
      const result = await fetchUserRecordsByDate(session, value);
      if (result) {
        console.log("Fetched user records successfully");
      }
    } catch (error) {
      console.error("Error occurred during async operation:", error);
    }
  };

  const handleCheckIn = async () => {
    const result = await checkIn(session);
    if (result && result.success) {
      setIsCheckedIn(true);
      if (result.timestamp) {
        const formattedTimestamp = new Date(result.timestamp).toLocaleString();
        setCheckInTimestamp(formattedTimestamp); 
      }
    } else {
      console.error('Error:', result ? result.message : 'Result is undefined');
    }
  };

  const handleCheckOut = async () => {
    const result = await checkOut(session);
    if (result && result.success) {
      setIsCheckedOut(true);
      if (result.timestamp) {
        const formattedTimestamp = new Date(result.timestamp).toLocaleString();
        setCheckOutTimestamp(formattedTimestamp); 
      }
    } else {
      console.error('Error:', result ? result.message : 'Result is undefined');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-6 bg-gray-50">
      {/* Dashboard Header */}
      <div className="text-3xl font-semibold text-gray-800">Dashboard</div>
      <div className="text-lg text-gray-600 mb-4">Welcome to the Attendance Management System</div>

      {/* Employee Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <TotalEmployees />
        <OnTimeToday />
        <LateToday />
        <OnTimePercentage />
        <AbsentToday />
      </div>

      {/* Calendar Component */}
      <div className="w-full flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 bg-gray-200 p-4">
          <DeviceCategoryChart />
        </div>
        <div className="w-full md:w-1/2 bg-gray-200 p-4">
          <MapOne/>
        </div>
      </div>

      <Calendar selectRange={true} onChange={onChange} value={value} />

      {/* Check-In / Check-Out Section */}
      <div className="border border-gray-300 rounded-lg p-6 w-full max-w-md bg-white shadow-lg">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={handleCheckIn}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Check Out
          </button>
        </div>
        {isCheckedIn && (
          <p className="text-green-500">You have checked in! Timestamp: {checkInTimestamp}</p>
        )}
        {isCheckedOut && (
          <p className="text-red-500">You have checked out! Timestamp: {checkOutTimestamp}</p>
        )}
      </div>

      {/* Attendance Records Table */}
      <div className="w-full max-w-4xl mt-6">
        <CheckInOutTable userRange={value} />
      </div>
    </div>
  );
}

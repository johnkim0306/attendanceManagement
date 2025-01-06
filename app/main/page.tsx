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
        // Your function to call when the calendar value changes
        console.log("Calendar value changed:", value);
		findMatchingDates(value);
    }, [value]);

	const findMatchingDates = async (value: Value) => {
		try {
			// Example asynchronous operation (replace with your actual implementation)
			console.log("I am here in findMathcing Dates: " , value)
			const result = await fetchUserRecordsByDate(session, value);
			if (result) {
				console.log("Success with FethcingRecordByDate")
			}
		} catch (error) {
			console.error("Error occurred during async operation:", error);
		}
	}

	const handleCheckIn = async () => {
        console.log("Check In");
        const result = await checkIn(session);
        if (result && result.success) {
            console.log("Worekd!!!");
			console.log(result);
			setIsCheckedIn(true);
			if (result.timestamp) {
				const formattedTimestamp = new Date(result.timestamp).toLocaleString();
				setCheckInTimestamp(formattedTimestamp); // Update formatted timestamp state
			}
        } else {
            console.error('Error:', result ? result.message: 'Result is undefined');
        }
	};

	const handleCheckOut = async () => {
		console.log("Check Out");
		const result = await checkOut(session);
		if (result && result.success) {
			console.log(result);
			setIsCheckedOut(true);
			if (result.timestamp) {
				const formattedTimestamp = new Date(result.timestamp).toLocaleString();
				setCheckOutTimestamp(formattedTimestamp); // Update formatted timestamp state
			}
		} else {
            console.error('Error:', result ? result.message: 'Result is undefined');
        }
	};

	return (
        <div className="flex justify-center flex-col items-center">
			<div>Dash Board</div>
			<div>Welcome to the Attendance Management System</div>
			<Calendar selectRange={true} onChange={onChange} value={value} />
			<TotalEmployees />
			<OnTimeToday />
			<LateToday />
			<OnTimePercentage />
            <div className="border border-gray rounded-lg p-4">
                <button onClick={handleCheckIn} className="px-4 py-2 m-2 bg-slate-400 rounded">
                    Check In
                </button>
                <button onClick={handleCheckOut} className="px-4 py-2 m-2 bg-slate-400 rounded">
                    Check Out
                </button>
				{isCheckedIn && (
                    <p>You have checked in! Timestamp: {checkInTimestamp}</p>
                )}
				{isCheckedOut && (
                    <p>You have checked Out! Timestamp: {checkOutTimestamp}</p>
                )}
            </div>
			{/* <ProfileTable /> */}
			<CheckInOutTable userRange={value} />
        </div>
	);
}


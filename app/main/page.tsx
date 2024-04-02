'use client';

import { useState } from "react";
import { checkIn, checkOut } from "./action";
import { signOut, useSession } from 'next-auth/react';

export default function Main() {

	const { data: session } = useSession();
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [isCheckedOut, setIsCheckedOut] = useState(false);
	const [checkInTimestamp, setCheckInTimestamp] = useState("");
	const [checkOutTimestamp, setCheckOutTimestamp] = useState("");

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
        <div className="flex justify-center">
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
        </div>
	);
}

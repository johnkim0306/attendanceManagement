'use client';

import { checkIn, checkOut } from "./action";
import { signOut, useSession } from 'next-auth/react';

export default function Main() {

	const { data: session } = useSession();

	const handleCheckIn = async () => {
        console.log("Check In");
        const result = await checkIn(session);
        if (result && result.success) {
            console.log("Worekd!!!")
        } else {
            console.error('Error:', result ? result.message: 'Result is undefined');
        }
	};

	const handleCheckOut = async () => {
		console.log("Check Out");
		const result = await checkOut(session);
	};

	return (
		<div>
			<button onClick={handleCheckIn} className='px-4 py-2 m-2 bg-slate-400 rounded'>
				Check In
			</button>
			<button onClick={handleCheckOut} className='px-4 py-2 m-2 bg-slate-400 rounded'>
				Check Out
			</button>
		</div>
	);
}

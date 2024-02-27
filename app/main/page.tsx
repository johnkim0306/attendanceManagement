'use client';

export default function Main() {
	const handleCheckIn = async () => {
		//Call checkin api
	};

	const handleCheckOut = async () => {
		//Call checkout api
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

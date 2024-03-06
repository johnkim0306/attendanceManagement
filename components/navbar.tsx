'use client';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
	const { data: session } = useSession();

	console.log(session)

	return (
		<nav className='flex justify-between items-center py-4 px-6 bg-white shadow-md'>
			{session && (
				<>
					<ul className='flex space-x-4'>
						<li></li>
					</ul>
					<ul className='flex space-x-4 items-center'>
						<li>Hello, {session.user?.name}!</li>
						<li>
							<button className='px-4 py-2 bg-slate-400 rounded' onClick={() => signOut()}>
								Sign out
							</button>
						</li>
					</ul>
				</>
			)}
		</nav>
	);
}

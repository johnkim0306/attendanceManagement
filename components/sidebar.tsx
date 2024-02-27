import Link from 'next/link';

export default function Sidebar() {
	return (
		<aside className='w-64 h-screen bg-gray-100 shadow-inner'>
			<nav>
				<ul>
					<Link href='/main/attendance' className='w-full text-gray-700 hover:text-gray-50 '>
						<li className='p-4 hover:bg-gray-400'>Attendance</li>
					</Link>
				</ul>
			</nav>
		</aside>
	);
}

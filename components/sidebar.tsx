'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Sidebar() {
  const { data: session } = useSession();

  console.log("Iam inside sidebar: " + session);

  return (
    <aside className='w-64 h-screen bg-gray-100 shadow-inner'>
      <nav>
        <ul>
          <Link href='/main/attendance' className='w-full text-gray-700 hover:text-gray-50 '>
            <li className='p-4 hover:bg-gray-400'>Attendance</li>
          </Link>
        </ul>
        <ul>
          <Link href='/profile-dashboard' className='w-full text-gray-700 hover:text-gray-50 '>
            <li className='p-4 hover:bg-gray-400'>Profile page</li>
          </Link>
        </ul>
        {/* Conditionally render the "Admin dashboard" link based on user role */}
        {session && session.user?.role === 'ADMIN' && (
          <nav>
            <ul>
              <Link href='/admin-dashboard' className='block w-full text-gray-700 hover:text-gray-50 '>
                <div className='block p-4 hover:bg-gray-400'>Admin dashboard</div>
              </Link>
            </ul>
            <ul>
              <Link href='/admin-dashboard2' className='block w-full text-gray-700 hover:text-gray-50 '>
                <div className='block p-4 hover:bg-gray-400'>Admin dashboard2</div>
              </Link>
            </ul>
            </nav>
        )}
      </nav>
    </aside>
  );
}

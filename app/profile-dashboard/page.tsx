'use client';
import ProfileTable from "@/components/profileTable";
import ProfileNavbar from "@/components/ProfileNavbar";
import Link from "next/link";

export default function ProfileDashboard() {
	return (
		<>
			<div>This is the Admin Dashbaord!</div>
			<ProfileNavbar />

			<div className="flex justify-center">
				<Link className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mr-10" href="/employees">
					<span className="sr-only">Signed In Employees button</span>
					All Signed in (17)
				</Link>
				<Link className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" href="/employees">
					<span className="sr-only">Signed In Employees button</span>
					Employees (20)
				</Link>
			</div>
			<ProfileTable />
		</>
		
	);
}

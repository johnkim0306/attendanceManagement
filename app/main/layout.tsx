import AuthProvider from '@/components/authProvider';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/Sidebar/sidebar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	if (!session) {
		redirect('/');
	}

	return (
		<AuthProvider>
			<div className='min-h-screen flex flex-col'>
				<Navbar />
				<div className='flex flex-1'>
					<Sidebar />
					<main className='flex-1 p-6 bg-gray-50'>{children}</main>
				</div>
			</div>
		</AuthProvider>
	);
}

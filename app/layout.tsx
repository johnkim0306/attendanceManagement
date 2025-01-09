import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'reflect-metadata';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { initializeCronJob } from '@/server/scheduler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Vita Commute Control',
	description: 'Manage attendence on Vitashop',
};

initializeCronJob();

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = getServerSession();

	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	);
}


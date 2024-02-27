'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const result = await signIn('credentials', {
			redirect: false,
			email,
			password,
		});
		setLoading(false);

		if (result?.error) {
			// 에러 처리
			console.error('Failed to login:', result.error);
			console.log(result.error);
			setError(result.error);
		} else {
			// 로그인 성공 처리
			window.location.href = '/main';
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<div className='p-6 bg-white shadow-md rounded'>
				<form className='space-y-4' onSubmit={handleLogin}>
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
							E-mail
						</label>
						<input
							type='text'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<div className='text-sm'>
						Don't have account?{' '}
						<Link className=' text-cyan-600 font-semibold underline' href='/signup'>
							Sign up
						</Link>
					</div>

					<button
						type='submit'
						className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
						{loading ? 'loading...' : 'Login'}
					</button>
					{error && <label className='text-sm text-red-500'>{error}</label>}
				</form>
			</div>
		</div>
	);
}

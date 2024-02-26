import { Provider } from "@/server/provider";
import { UserService } from "@/server/service/user.service";
import { redirect } from "next/navigation";

export default function Signup() {


  const signUp = async (formData: FormData) => {
    'use server'
    
    const userService = Provider.getService(UserService);

    const email = formData.get('email');
    const password = formData.get('password');
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
		try {
    	await userService.signUpUser(email as string, password as string, firstname as string, lastname as string);
			//console.log(JSON.stringify(result));
		}catch(error){
			throw new Error('Cannot create user');
			// return { message: };  
		}
		redirect('/login');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <label className='text-xl font-semibold pb-4'>Sign Up</label>
			<div className='p-6 bg-white shadow-md rounded'>
				<form className='space-y-4' action={signUp}>
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
							E-mail
						</label>
						<input
							type='email'
							name='email'
              required
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
          <div>
						<label htmlFor='firstname' className='block text-sm font-medium text-gray-700'>
							First Name
						</label>
						<input
							type='text'
							name='firstname'
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
          <div>
						<label htmlFor='lastname' className='block text-sm font-medium text-gray-700'>
							Last Name
						</label>
						<input
							type='text'
							name='lastname'
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<input
							type='password'
							name='password'
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
          <div>
						<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
							Confirm Password
						</label>
						<input
							type='password'
							name='confirmPassword'
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<button
						type='submit'
						className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
						Sign up
					</button>
				</form>
			</div>
		</div>
  );
}

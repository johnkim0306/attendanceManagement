'use client';

import { useForm } from 'react-hook-form';
import { signUp } from './action'; // Ensure this function processes form data correctly
import { useRouter } from 'next/navigation';

interface ICreateAccountForm {
  email: string;
  password: string;
  confirm_password: string;
  firstName: string;
  lastName: string;
}

export default function Signup() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit = async (data: ICreateAccountForm) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      
      const result = await signUp(formData);
      if (result.message) {
        throw new Error(result.message);
      }
      alert('Sign-up successful!');
      router.push('/main');
    } catch (error) {
      console.error('Failed to sign up. Error:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <label className="text-xl font-semibold pb-4">Sign Up</label>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <label className="block text-sm text-red-500">{errors.email.message}</label>}
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName', { required: 'First Name is required' })}
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.firstName && <label className="block text-sm text-red-500">{errors.firstName.message}</label>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName', { required: 'Last Name is required' })}
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.lastName && <label className="block text-sm text-red-500">{errors.lastName.message}</label>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <label className="block text-sm text-red-500">{errors.password.message}</label>}
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            {...register('confirm_password', {
              required: 'Password confirmation is required',
              validate: (value) =>
                value === getValues().password || 'Passwords do not match',
            })}
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.confirm_password && (
            <label className="block text-sm text-red-500">{errors.confirm_password.message}</label>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

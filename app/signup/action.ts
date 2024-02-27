'use server';
import { Provider } from '@/server/provider';
import { UserService } from '@/server/service/user.service';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
	const userService = Provider.getService(UserService);

	const email = formData.get('email');
	const password = formData.get('password');
	const firstname = formData.get('firstName');
	const lastname = formData.get('lastName');
	try {
		await userService.signUpUser(email as string, password as string, firstname as string, lastname as string);
		//console.log(JSON.stringify(result));
		redirect('/');
	} catch (error) {
		return { message: error };
	}
}

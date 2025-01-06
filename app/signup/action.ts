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
		const newUser = await userService.signUpUser(email as string, password as string, firstname as string, lastname as string);
		// Convert the newUser to a plain object before redirecting
		// const plainUser = {
		// 	id: newUser.id,
		// 	email: newUser.email,
		// 	firstname: newUser.firstname,
		// 	lastname: newUser.lastname,
		// 	role: newUser.role,
		// };
		console.log(JSON.stringify(newUser));
		redirect('/');
	} catch (error) {
		return { message: error };
	}
}

'use server';
import { Provider } from '@/server/provider';
import { UserService } from '@/server/service/user.service';

export async function signUp(formData: FormData) {
	const userService = Provider.getService(UserService);

	const email = formData.get('email') as string | null;
	if (!email) {
		throw new Error('Email is required');
	}
	const password = formData.get('password');
	const firstname = formData.get('firstName');
	const lastname = formData.get('lastName');
	try {
		const newUser = await userService.createUser({
			email: email as string,
			password: password as string,
			firstName: firstname as string,
			lastName: lastname as string
		});
		
		// Convert the newUser to a plain object before returning
		const plainUser = {
			id: newUser.id,
			email: newUser.email,
			firstname: newUser.firstname,
			lastname: newUser.lastname,
			role: newUser.role,
		};
		
		console.log(JSON.stringify(plainUser));
		return { user: plainUser };
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message };
		} else {
			return { message: 'An unknown error occurred' };
		}
	}
}

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from '@/server/provider';
import { UserService } from '@/server/service/user.service';

const handler = NextAuth({
	session: {
		strategy: 'jwt',
		maxAge: 1 * 24 * 60 * 60, // 1 day
	},
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const userService = Provider.getService(UserService);
				const user = await userService.findUserByEmail(credentials?.email);
				if (!user) {
					throw new Error('No user found with the entered email');
				}

				const isValid = await user.checkPassword(credentials?.password);
				if (!isValid) {
					throw new Error('Password is incorrect');
				}

				return { id: user.id, name: `${user.firstname}  ${user.lastname}`, email: user.email, role: user.role };
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.role = user.role;
			}
			return token;
		},
		session: async ({ session, token }) => {
			session.user.id = token.id;
			session.user.name = token.name;
			session.user.email = token.email;
			session.user.role = token.role;
			return session;
		},
	},
	pages: {
		signIn: '/',
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

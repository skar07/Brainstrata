import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { serverValidateUser, serverRegisterUser } from './serverAuth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text', optional: true },
        isSignup: { label: 'Is Signup', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Check if this is a signup request
          if (credentials.isSignup === 'true') {
            if (!credentials.name) {
              throw new Error('Name is required for signup');
            }

            // Register new user using server-side function
            const registerResult = await serverRegisterUser(
              credentials.email,
              credentials.password,
              credentials.name
            );

            if (!registerResult.success) {
              throw new Error(registerResult.message);
            }

            // Return user data for session
            return {
              id: registerResult.user!.id,
              email: registerResult.user!.email,
              name: registerResult.user!.name,
              image: registerResult.user!.image || null,
            };
          } else {
            // Validate existing user (login) using server-side function
            const validationResult = await serverValidateUser(credentials.email, credentials.password);

            if (!validationResult.success) {
              throw new Error(validationResult.message);
            }

            // Return user data for session
            return {
              id: validationResult.user!.id,
              email: validationResult.user!.email,
              name: validationResult.user!.name,
              image: validationResult.user!.image || null,
            };
          }
        } catch (error) {
          // Return null to show error to user
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/auth-error', // Custom error page
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
}; 
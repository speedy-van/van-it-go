import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcryptjs from 'bcryptjs';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query user from database (returning null triggers CredentialsSignin on client)
          const user = await db.query.users.findFirst({
            where: eq(users.email, String(credentials.email)),
          });

          if (!user || !user.passwordHash) {
            console.warn('[auth] Credentials rejected: user not found or no password set');
            return null;
          }

          // Verify password
          const isPasswordValid = await bcryptjs.compare(
            String(credentials.password),
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.warn('[auth] Credentials rejected: invalid password');
            return null;
          }

          // User found and password valid
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error('[auth] Credentials error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? 'user';
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: any) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      const protectedRoutes = [
        '/dashboard',
        '/driver',
        '/admin',
        '/book',
      ];
      const isProtected = protectedRoutes.some((route: string) =>
        request.nextUrl.pathname.startsWith(route)
      );

      if (isProtected && !auth) {
        return false;
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} as const;

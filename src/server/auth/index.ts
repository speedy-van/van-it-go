import NextAuth from 'next-auth';
import { authConfig } from '@/server/auth/config';

// NextAuth v5 beta: default export type can report "not callable" in some TS resolutions
// @ts-expect-error - NextAuth is callable at runtime; types vary by next-auth version
const nextAuth = NextAuth(authConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;

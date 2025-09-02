import NextAuth from 'next-auth'
import MicrosoftEntraID from '@auth/core/providers/microsoft-entra-id'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      allowDangerousEmailAccountLinking: true,
      profile: (p) => ({
        id: p.sub,
        name: p.name ?? p.preferred_username ?? p.email,
        email: p.email,
        image: undefined,
      })
    })
  ],
  session: { strategy: 'database' },
  trustHost: true,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore - custom role field on user
        session.user.role = user.role
      }
      return session
    }
  }
})

export default auth

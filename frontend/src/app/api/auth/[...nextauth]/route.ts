import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        mobile: { label: "Mobile", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            code: credentials.code,
            name: credentials.name,
            role: credentials.role,
            mobile: credentials.mobile
          })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return { id: data.user.userId, ...data.user, accessToken: data.token } as any;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };

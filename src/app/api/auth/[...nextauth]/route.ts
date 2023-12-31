import { http } from "@/server/api/http";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { data } = await http.post(
            "/auth/login",
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const token = data?.body?.access_token;

          if (token) {
            const res = await http.get("/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            return {
              ...res.data.body,
              server_token: token,
            };
          }
          return null;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, user: user };
        // @ts-ignore
        token.accessToken = user.server_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = token.user!!;
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      if (token.user?.password) {
        // @ts-ignore
        session.user.password = undefined;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

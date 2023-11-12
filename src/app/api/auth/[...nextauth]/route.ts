import { axios } from "@/api/axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { data } = await axios.post(
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
            return { id: "1", access_token: token };
          }

          return null;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };

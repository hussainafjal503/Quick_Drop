import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import logger from "./helper_functions/logger";
import dbConnection from "./utils/dbConnection";
import userModel from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

//website auth.js
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, request) {
        await dbConnection();
        const email = credentials.email;
        const password = credentials.password as string;

        const userDetail = await userModel.findOne({ email });

        if (!userDetail) {
          throw new Error("user Doesn't Exists");
        }

        const isMatchedPassword = await bcrypt.compare(
          password,
          userDetail.password
        );

        if (!isMatchedPassword) {
          throw new Error("Incorrect credentials");
        }

        const user = {
          id: userDetail._id.toString(),
          email: userDetail.email,
          name: userDetail.name,
          role: userDetail.role,
        };

        return user;
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await dbConnection();

        let dbUser = await userModel.findOne({ email: user?.email });

        if (!dbUser) {
          dbUser = await userModel.create({
            name: user?.name,
            email: user?.email,
            image: user?.image,
          });
        
        }

        user.id = dbUser?._id.toString();
        user.role = dbUser?.role;
      }
      return true;
    },
    jwt({ token, user }) {
      //token ke ander user ka data add krna ke kaam ye karta hai..

      if (user) {
        token.id = user.id;
        token.role = user?.role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
});


import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@/app/generated/prisma";
import { NextAuthOptions } from "next-auth";

interface CustomUser {
  id: string;
  name: string;
  moodle_id: string;
}

const prisma = new PrismaClient()

export const authOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{label:"Moodle Id",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials: { username: string; password: string } | undefined) {
                if (!credentials?.username || !credentials?.password) {
                   
                    throw new Error("Missing credentials");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { moodle_id: credentials.username },
                    });

                    if(!user){
                        throw new Error("User not found");
                    }

                        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                        if (!passwordMatch) {
                            throw new Error("Invalid password");
                        }  
                        
                            return {
                                id:user.id,
                                name:user.name,
                                moodle_id: user.moodle_id,
    
                            };
                        
                    
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        }),
        
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin", 
        error:'/signin'
    },
    callbacks: {

        async jwt({ token, user }: any) {

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.moodle_id = user.moodle_id;
            }
            return token;
        },

        async session({ session, token }: { session: any; token: any }) {

            if (session && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.moodle_id = token.moodle_id;
            }
            return session;
        }
    },
    session:{
        strategy:"jwt",
        maxAge:1 * 24 * 60 * 60,
    }
};

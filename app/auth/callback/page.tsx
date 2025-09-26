'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./loading";
const  AuthCallbackPage = () =>{
    const {status,data:session} =  useSession();
    const router = useRouter();

    // useEffect(()=>{

        if(status === "authenticated"){
            router.push(`/dashboard/${session.user}`)
        }
        if(status === "unauthenticated"){
            router.push(`/auth/signin`)
        }
    // },[status,session,router])

    return (<div>
       <Loading></Loading>
    </div>)

}


export default AuthCallbackPage;
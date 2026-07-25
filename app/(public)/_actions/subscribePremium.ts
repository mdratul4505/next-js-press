"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const subscribePremium = async () =>{
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    
    if(!accessToken){
        // throw new Error("user not logged in !")
        return{
            success : false,
            message : "user not logged in !"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/subscription/checkout` , {
        method : "POST",
        headers : {
        // Authorization : accessToken as unknown as string
        cookie : `accessToken=${accessToken}`
    },
    })
    const result = await res.json()
    if(result.success && result.data.paymentUrl){
       redirect(result.data.paymentUrl)
    }
    return result;
}
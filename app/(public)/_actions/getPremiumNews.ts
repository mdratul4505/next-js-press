"use server"
import { cookies } from "next/headers";

export const getPremiumNews = async ({query} : {query ? : {[key : string]: string | string[] | undefined}})=>{
// bad approse
// const searchTern = `${search?.searchTerm? `?searchTerm=${search.searchTerm}` : ""}`
// good approse
const params = new URLSearchParams()
if(query && query.searchTerm){
    params.set("searchTerm" , query.searchTerm as string)
}

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    
    if(!accessToken){
        // throw new Error("user not logged in !")
        return{
            success : false,
            message : "user not logged in !"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium${params.toString()}` , {
        headers : {
        // Authorization : accessToken as unknown as string
        cookie : `accessToken=${accessToken}`
    },
        cache: "force-cache",
        next : {
            revalidate : 60 * 60 * 24,
            tags : ["premium-posts"]
        }
    })
    const result = await res.json()
    return result
}
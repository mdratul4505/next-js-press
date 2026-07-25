export const getPremiumNews = async ()=>{
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium` , {
        cache: "force-cache",
        next : {
            revalidate : 60 * 60 * 24,
            tags : ["premium-posts"]
        }
    })
    const result = await res.json()
    return result
}
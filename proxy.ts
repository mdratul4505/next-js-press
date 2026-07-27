import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from './utils/jwt';
import { getNewAccessToken } from './service/refreshToken';
import { getSubscriptionStatus } from './app/(public)/_actions/getSubscriptionStatus';

const AUTH_ROUTE = ["/login", "/register"]
const PUBLIC_ROUTE = ["/", "/news" ,"/login", "/register"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    const cookeStore = await cookies();
    // const accessToken = cookeStore.get("accessToken")

    let accessToken = request.cookies.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null ;

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null ;

    if(!decodedAccessToken?.success &&  decodedRefreshToken?.success){
        const result = await getNewAccessToken()
        if(result.success){
            const newAccessToken = result.data.accessToken;
            cookeStore.set("accessToken", newAccessToken,{
                httpOnly : true,
                maxAge : 60 * 60 * 24,
                sameSite : "lax"
            })
            accessToken = newAccessToken
            decodedAccessToken = accessToken
  ? jwtUtils.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    )
  : null;
        }

    }


    let userRole = null;

    

    if(!decodedAccessToken){
        cookeStore.delete("accessToken");
        // return NextResponse.redirect( new URL("/login", request.url) )
    }

    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole = (decodedAccessToken.data as JwtPayload).role ;
    }
    if(accessToken && AUTH_ROUTE.includes(pathName)){
        if(userRole === "USER"){
            return NextResponse.redirect( new URL('/dashboard' , request.url))
        }else if (userRole === "ADMIN"){
           return NextResponse.redirect( new URL('/admin-dashboard' , request.url)) 
        }else if (userRole === "AUTHOR"){
            return NextResponse.redirect( new URL('/author-dashboard' , request.url))
        }else{
            return NextResponse.redirect( new URL('/' , request.url))
        }
    }
        

    const isPublic = PUBLIC_ROUTE.some((route)=> pathName === route || pathName.startsWith(route + "/")) ;

    if(!accessToken && !isPublic){
    return NextResponse.redirect( new URL('/login' , request.url))
}

    if(pathName.startsWith("/dashboard")&& userRole !== "USER"){
       return NextResponse.redirect( new URL('/not-found' , request.url)) 
    }
    else if(pathName.startsWith("/admin-dashboard")&& userRole !== "ADMIN"){
       return NextResponse.redirect( new URL('/not-found' , request.url)) 
    }
    else if(pathName.startsWith("/author-dashboard")&& userRole !== "AUTHOR"){
       return NextResponse.redirect( new URL('/not-found' , request.url)) 
    }

    

    if(pathName === "/premium"){
        const subscriptionStatus = await getSubscriptionStatus();
     const isActive = Boolean(
    subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
  );
        if(!isActive){
    return NextResponse.redirect(new URL ("/payment", request.url))
  }
}

//     if(pathName === "/payment"){

//   if(isActive){
//     return NextResponse.redirect(new URL ("/premium", request.url))
//   }
//     }

//   return NextResponse.redirect(new URL('/', request.url))
 return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ],
}
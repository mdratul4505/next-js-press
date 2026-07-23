import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from './utils/jwt';

const AUTH_ROUTE = ["/login", "/register"]
const PUBLIC_ROUTE = ["/", "/news" ,"/login", "/register"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    const cookeStore = await cookies();
    // const accessToken = cookeStore.get("accessToken")

    const accessToken = request.cookies.get("accessToken")?.value

    const decodedToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null ;
    let userRole = null;

    if(!decodedToken){
        cookeStore.delete("accessToken");
        return NextResponse.redirect( new URL("/login", request.url) )
    }

    if(decodedToken?.success && decodedToken.data){
        userRole = (decodedToken.data as JwtPayload).role ;
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

    if(!accessToken && isPublic){
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
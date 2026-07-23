import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTE = ["/login", "/register"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    // const cookeStore = await cookies();
    // const accessToken = cookeStore.get("accessToken")

    const accessToken = request.cookies.get("accessToken")?.value


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
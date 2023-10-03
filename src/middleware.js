import { NextResponse } from 'next/server'

function middleware(req) {
  const verify = req.cookies.get("refreshtoken")?.value
  const  pathname = req.nextUrl.pathname;
  // console.log("pathsnameurl",pathname)
  // console.log("verify",verify)

  if(verify == undefined && pathname !='/'){
    console.log("Redirecting to login form")
    return NextResponse.redirect(new URL('/', req.url));
  }
  else  if(verify != undefined && pathname =='/'){
    // console.log("Redirecting to login form")
    return NextResponse.redirect(new URL("/adminpanel", req.url));
  }
}

export default middleware


export const config = {
  matcher: ["/","/adminpanel"],
};

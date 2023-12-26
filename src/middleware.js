import { NextResponse } from "next/server";

function middleware(req) {
  const verify = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  if (verify == undefined && pathname != "/") {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (verify != undefined && pathname == "/"  ) {
    return NextResponse.redirect(new URL("/adminpanel", req.url));
  }
}

export default middleware;

export const config = {
  matcher: [
    "/",
    "/adminpanel",
    "/dashboard/documents",
    "/dashboard/videocontainer",
    "/dashboard/questionnaire",
  ],
};

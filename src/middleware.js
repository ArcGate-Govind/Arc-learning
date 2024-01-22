import { NextResponse } from "next/server";

function middleware(req) {
  const verify = req.cookies.has("accessToken");
  const verifySecretKey = req.cookies.has("SecretKey");
  const verifyURL = req.cookies.has("URL");
  const pathname = req.nextUrl.pathname;

  if (!verify) {
    if (
      !verify &&
      pathname != "/" &&
      pathname != "/twofaregister" &&
      pathname != "/twofaverify"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (!verifySecretKey && !verifyURL && pathname != "/") {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (verifyURL && verifySecretKey && pathname != "/twofaregister") {
      return NextResponse.redirect(new URL("/twofaregister", req.url));
    } else if (!verifyURL && verifySecretKey && pathname != "/twofaverify") {
      return NextResponse.redirect(new URL("/twofaverify", req.url));
    }
  } else {
    if (!verify && pathname != "/") {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (verify && pathname == "/") {
      return NextResponse.redirect(new URL("/adminpanel", req.url));
    } else if (
      verify &&
      (pathname == "/" ||
        pathname == "/twofaregister" ||
        pathname == "/twofaverify")
    ) {
      return NextResponse.redirect(new URL("/adminpanel", req.url));
    }
  }
}

export default middleware;

export const config = {
  matcher: [
    "/",
    "/twofaregister",
    "/twofaverify",
    "/adminpanel",
    "/dashboard/documents",
    "/dashboard/videocontainer",
    "/dashboard/questionnaire",
  ],
};

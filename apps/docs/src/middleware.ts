import { NextResponse, NextRequest } from "next/server";

const devSecret = process.env.DEV_PASS;
const devProtectionEnabled = process.env.ENABLE_DEV_PROTECTION === "1";

export default function middleware(request: NextRequest) {
  if (devProtectionEnabled) {
    const secret = request.cookies.get("dev_secret");
    if (secret?.value !== devSecret)
      return NextResponse.redirect(new URL("/placeholder", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|placeholder|_next/static|_next/image|.*\\.png$).*)"],
};

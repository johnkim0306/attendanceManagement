import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const adminPaths = [
      "/admin-dashboard",
    ];
    const currentPath = req.nextUrl.pathname;

    if (adminPaths.includes(currentPath) && req.nextauth.token?.role !== "ADMIN") {
      return new NextResponse("You are not authorized!");
    }
    
    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN",
    },
  }
);

export const config = { matcher: ["/admin-dashboard",] };

'use client'
import "reflect-metadata";
import { SessionProvider } from "next-auth/react"
import { NavBar } from "@/components/navbar";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
    <div>
      <NavBar />
      {children}
    </div>
    </SessionProvider>
  );
}
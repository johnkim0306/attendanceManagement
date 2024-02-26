'use client'
import { signOut } from "next-auth/react"

export const NavBar = () =>{
  return <>
    <section>
        <button onClick={() => signOut()}>Sign out</button>
    </section>
  </>
}
"use client";
import { useSession, signOut } from "next-auth/react";
import React from "react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={handleSignOut}>Signout</button>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <link href="/register">Register</link>
        </div>
      )}
    </div>
  );
}

export default Header;

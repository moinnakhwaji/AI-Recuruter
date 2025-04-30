import Link from 'next/link';
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const Navbar = () => {
  return (
    <div className="h-[100px] hidden md:flex bg-[#0a0a0a] px-8 text-white justify-between items-center shadow-md">
      {/* Logo on the left */}
      <h2 className="text-3xl font-bold font-poppins text-gray-300">VocalHire</h2>

      {/* Right side: Dashboard button and sign-in/sign-up buttons */}
      <div className="flex gap-6 items-center text-sm font-medium">
        <Link href="/dashboard">
          <button className="px-4 py-1.5 bg-[#f1f1f1] text-black rounded-md hover:bg-[#141414] hover:text-[#f1f1f1] transition-all duration-300">
            Go to Dashboard
          </button>
        </Link>

        <div className="flex gap-4 ml-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-1.5 bg-white text-black rounded-md hover:bg-gray-300 transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-1.5 bg-white border border-black text-black rounded-md hover:text-white transition-all duration-300">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

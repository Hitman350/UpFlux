"use client";

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

export function Appbar() {
    return <div className="flex justify-between items-center p-4">
        <div>UpFlux</div>
        <div className="flex items-center gap-4">
            <SignedOut>
            <SignInButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign In
                </button>
            </SignInButton>
            <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
                </button>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
            <UserButton />
            </SignedIn>
        </div>
    </div>
}
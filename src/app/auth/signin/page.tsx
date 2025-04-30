'use client';

import NaverLoginButton from "@/components/auth/NaverLoginButton";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Link from "next/link";

export default function SignInPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center mb-12">
          <Link href="/">
            <button
              onClick={scrollToTop}
              className="text-2xl md:text-4xl tracking-tight text-gray-900 hover:text-gray-700 transition-all duration-300"
            >
              goggle<span className="text-sky-400">.</span>
            </button>
          </Link>
        </div>
        
        <div className="space-y-4">
          <GoogleLoginButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>
          <NaverLoginButton />
        </div>
      </div>
    </div>
  );
}
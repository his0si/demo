'use client';

import NaverLoginButton from "@/components/auth/NaverLoginButton";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Link from "next/link";

export default function SignInPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center mb-12">
            <Link href="/">
              <button
                onClick={scrollToTop}
                className="text-2xl font-bold tracking-tight text-gray-900"
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
      <div className="text-center py-4">
        <p className="text-xs md:text-sm text-gray-500">© 2025 Goggle. All rights reserved.</p>
      </div>
    </div>
  );
}
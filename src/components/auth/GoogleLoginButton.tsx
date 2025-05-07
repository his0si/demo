"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center">
        <div className="mr-3">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10.01H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.56V20.34H19.28C21.36 18.42 22.56 15.59 22.56 12.25Z" fill="#4285F4" />
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.56C14.73 18.22 13.48 18.59 12 18.59C9.13 18.59 6.73 16.64 5.86 14.01H2.17V16.88C3.98 20.5 7.68 23 12 23Z" fill="#34A853" />
            <path d="M5.86 14.01C5.63 13.34 5.5 12.62 5.5 11.88C5.5 11.14 5.63 10.42 5.86 9.75V6.88H2.17C1.41 8.43 1 10.11 1 11.88C1 13.65 1.41 15.33 2.17 16.88L5.86 14.01Z" fill="#FBBC05" />
            <path d="M12 5.16C13.59 5.16 15.03 5.73 16.12 6.77L19.28 3.61C17.45 1.89 14.97 0.88 12 0.88C7.68 0.88 3.98 3.38 2.17 7L5.86 9.87C6.73 7.24 9.13 5.16 12 5.16Z" fill="#EA4335" />
          </svg>
        </div>
        <span className="text-base font-medium">구글로 로그인</span>
      </div>
    </button>
  );
}
"use client";

import { signIn } from "next-auth/react";

export default function NaverLoginButton() {
  return (
    <button
      onClick={() => signIn("naver", { callbackUrl: "/" })}
      className="flex items-center justify-center w-full px-4 py-3 text-white bg-[#03C75A] rounded-md hover:bg-[#04bd48] transition-colors group"
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center mr-3 font-bold text-white bg-[#03C75A] group-hover:bg-[#04bd48] h-7 w-7 rounded-sm transition-colors">
          <span>N</span>
        </div>
        <span className="text-base">네이버로 로그인</span>
      </div>
    </button>
  );
}
import NaverLoginButton from "@/components/auth/NaverLoginButton";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로그인",
  description: "소셜 계정으로 로그인하세요",
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">빠른 시작</h1>
        </div>
        
        <div className="space-y-4">
          <GoogleLoginButton />
          <NaverLoginButton />
        </div>
        
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const Privacy = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 px-6 py-5 border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-all duration-300"
          >
            goggle<span className="text-sky-400">.</span>
          </Link>
          <div className="flex items-center gap-8">
          </div>
        </div>
      </motion.nav>

      <main className="max-w-4xl mx-auto px-6 py-32">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path 
                d="M19 12H5M5 12L12 19M5 12L12 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            뒤로 가기
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보 처리방침</h1>
        
        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-600 mb-4">
              Goggle은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>바둑 기보 분석 및 저장</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 개인정보의 처리 및 보유 기간</h2>
            <p className="text-gray-600 mb-4">
              Goggle은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 정보주체의 권리·의무 및 그 행사방법</h2>
            <p className="text-gray-600 mb-4">
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy; 
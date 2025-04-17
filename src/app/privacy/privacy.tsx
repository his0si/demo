'use client';

import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
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
            <Link href="/auth/signin" className="px-5 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 hover:text-black transition-all duration-300">
              로그인
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-32">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          뒤로가기
        </Link>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Goggle은 사용자의 개인정보 보호를 매우 중요하게 생각합니다. 본 개인정보처리방침은 Goggle이 수집하는 정보와 그 사용 방법에 대해 설명합니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 수집하는 정보</h2>
          <p className="text-gray-600 mb-6">
            - 계정 정보: 이메일 주소, 사용자 이름<br />
            - 서비스 이용 정보: 대국 기록, 분석 데이터<br />
            - 기기 정보: IP 주소, 브라우저 정보
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 정보 사용 목적</h2>
          <p className="text-gray-600 mb-6">
            - 서비스 제공 및 개선<br />
            - 사용자 지원<br />
            - 보안 및 사기 방지
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 정보 보호</h2>
          <p className="text-gray-600 mb-6">
            Goggle은 사용자의 개인정보를 보호하기 위해 적절한 기술적, 관리적 보호조치를 취하고 있습니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 문의하기</h2>
          <p className="text-gray-600 mb-6">
            개인정보 관련 문의사항이 있으시면 언제든지 연락주시기 바랍니다.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-10 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-xl tracking-tight text-gray-900">
                goggle<span className="text-sky-400">.</span>
              </p>
              <p className="text-gray-500 mt-2">
                바둑 이야기를 담는 AI 기반 복기 서비스
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="https://github.com/Team-Goggle" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">GitHub</a>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">개인정보처리방침</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex justify-center">
            <p className="text-sm text-gray-500">© 2025 Goggle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy; 
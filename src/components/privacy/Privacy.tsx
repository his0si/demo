'use client';

import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";

const Privacy: React.FC = () => {
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

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 개인정보의 수집 항목 및 수집 방법</h2>
          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">수집 항목</h3>
          <div className="text-gray-600 mb-6 pl-4">
            <p className="font-medium mb-2">회원가입 및 서비스 이용 관련 정보:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>기본 정보: 이름, 이메일, 아이디, 비밀번호 등</li>
              <li>서비스 이용 기록: 기보 업로드 및 다운로드 내역, AI 분석 요청 내역</li>
            </ul>
            <p className="font-medium mb-2">서비스 분석 및 통계 정보:</p>
            <ul className="list-disc pl-6">
              <li>기보 파일(SGF 파일) 및 AI 분석 결과</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">수집 방법</h3>
          <p className="text-gray-600 mb-6 pl-4">
            회원 가입, 서비스 이용, 그리고 기보 업로드/분석 과정에서 자동으로 수집됩니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
          <div className="text-gray-600 mb-6 pl-4">
            <p className="font-medium mb-2">회원 관리 및 서비스 제공:</p>
            <ul className="list-disc pl-6">
              <li>회원 가입, 비밀번호 관리</li>
              <li>기보 저장 및 AI 분석 기능 제공</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
          <div className="text-gray-600 mb-6 pl-4">
            <ul className="list-disc pl-6">
              <li>회원의 개인정보는 회원 탈퇴 시까지 보관하며, 관련 법령에서 정한 보존기간 동안 안전하게 보관됩니다.</li>
              <li>AI 분석 기록 및 기보 데이터는 회원 서비스 이용 기간 동안 보존됩니다.</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 개인정보의 제3자 제공 및 위탁</h2>
          <div className="text-gray-600 mb-6 pl-4">
            <p className="font-medium mb-2">제3자 제공:</p>
            <p className="pl-6">
              원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 단, 회원의 동의가 있거나 법령에 의한 경우에 한해 제공됩니다.
            </p>
          </div>
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

export default Privacy; 
'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { motion } from "framer-motion";
import Footer from './Footer';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToContent = useCallback(() => {
    const contentSection = document.getElementById('content-section');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-5">
          <div className="flex justify-between items-center">
            <button
              onClick={scrollToTop}
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              goggle<span className="text-sky-400">.</span>
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#content-section" className="text-gray-600 text-sm font-medium hover:text-black">솔루션</Link>
              <Link href="#tech-section" className="text-gray-600 text-sm font-medium hover:text-black">기술</Link>
              <Link href="#cta-section" className="text-gray-600 text-sm font-medium hover:text-black">시작하기</Link>
              <Link
                href="/auth/signin"
                className="px-5 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 hover:text-black transition-all duration-300"
              >
                로그인
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100"
          >
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-4">
              <Link
                href="#content-section"
                className="text-gray-600 text-sm font-medium hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                솔루션
              </Link>
              <Link
                href="#tech-section"
                className="text-gray-600 text-sm font-medium hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                기술
              </Link>
              <Link
                href="#cta-section"
                className="text-gray-600 text-sm font-medium hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                시작하기
              </Link>
              <Link
                href="/auth/signin"
                className="px-5 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 hover:text-black transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 min-h-screen flex items-center pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-16 w-full">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex-1 text-gray-900"
          >
            <p className="text-sm font-medium tracking-wide mb-4 uppercase">
              당신의 바둑 이야기를 담다
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
              한 수 한 수를 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700">
                더 오래 기억하게
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg leading-relaxed">
              모든 기보는 나만의 &quot;이야기&quot; 입니다.<br />
              Goggle을 통해 나만의 이야기를 간직하고, 분석해보세요!<br />
            </p>
            <div className="flex gap-4 mt-10">
              <Link
                href="/auth/signin"
                className="px-7 py-3 rounded-full bg-black text-white hover:shadow-lg hover:shadow-gray-200/50 hover:translate-y-[-2px] transition-all duration-300 ease-out text-sm font-medium"
              >
                무료로 시작하기
              </Link>
              <button
                onClick={scrollToContent}
                type="button"
                className="px-7 py-3 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 transition-all duration-300 text-sm font-medium"
              >
                서비스 알아보기
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 flex justify-center items-center"
          >
            <div className="relative w-[380px] h-[380px] md:w-[420px] md:h-[420px]">
              <div className="absolute inset-0 bg-white/60"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full"></div>
              <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full"></div>
              <Image
                src={"/images/mockup_desktop.png"}
                alt="Goggle Platform Illustration"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: 'contain', zIndex: 10 }}
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Solutions Section */}
      <div id="content-section" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm text-sky-500 font-medium tracking-wide mb-2 text-center uppercase">솔루션</p>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
              당신의 바둑을 <span className="text-black">더 가치있게</span>
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
              낡은 종이에 기록된 기보부터 온라인 대국까지, 모든 기보는 소중한 이야기입니다.
              Goggle에서 당신의 대국 기록을 영원히 간직하세요.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-sky-100/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    strokeWidth="2" 
                    stroke="currentColor"
                    >
                    <path 
                      strokeLinecap="round"
                      strokeLinejoin="round" 
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">기보 아카이빙</h3>
                <p className="text-gray-600 leading-relaxed">
                  소중한 대국의 기록들을 체계적으로 보관하고 카테고리화하여 언제든지 쉽게 찾아볼 수 있습니다. 
                  당신의 바둑 이야기를 영원히 간직하세요.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-sky-100/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                    >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 분석 제공</h3>
                <p className="text-gray-600 leading-relaxed">
                최신 AI 엔진인 카타고와 analyze-sgf를 활용하여, 각 수마다 승리 확률 변화를 파악하고, 실수 포인트를 한눈에 확인할 수 있습니다.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-sky-100/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">하이라이트 생성</h3>
                <p className="text-gray-600 leading-relaxed">
                전체 대국 중에서 승부가 크게 요동친 구간이나 중요한 전투 장면 등을 자동으로 선별해, &apos;하이라이트&apos; 형태로 정리해 줍니다.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Showcase Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-sm text-sky-500 font-medium tracking-wide mb-2 text-center uppercase">바둑의 의미</p>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              단순한 돌의 배치가 아닌, <span className="text-black">인생의 한 장면</span>
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              각 대국은 당신의 사고방식, 느낌, 그리고 성장 과정을 담고 있습니다. <br />
              Goggle과 함께 바둑의 더 깊은 의미를 발견하세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <span className="text-gray-800 font-semibold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">종이에서 디지털로</h3>
              </div>
              <p className="text-gray-600">
                &quot;그때 그 한 수가 어땠더라...&quot; 이제 더 이상 흐릿한 기억이나 바래진 종이 기보에 의존하지 마세요. 
                소중한 기보들이 언제든 쉽게 찾아볼 수 있는 디지털 자산으로 영원히 보존됩니다.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <span className="text-gray-800 font-semibold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">기억에서 통찰로</h3>
              </div>
              <p className="text-gray-600">
                단순히 기보를 저장하는 것을 넘어, 각 국면의 깊은 의미를 AI가 분석하여 제공합니다.
                당신의 기보가 가진 이야기를 더 풍부하게 이해할 수 있습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div id="tech-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-sm text-sky-500 font-medium tracking-wide mb-2 text-center uppercase">기술</p>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              우리가 사용하는 <span className="text-black">최신 기술</span>
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Goggle은 최신 기술을 활용하여 당신의 소중한 기보를 지켜드립니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-6">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2" 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">LangChain</h3>
              <p className="text-gray-600">
              분석된 기보 데이터(승률 변화, 실수 포인트 등)를 구조화된 형태로 정리해 ChatGPT에 전달할 수 있도록 프롬프트를 자동 생성합니다.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-6">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2" 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SGF 포멧 지원</h3>
              <p className="text-gray-600">
              바둑 기보의 산업 표준인 SGF(Smart Game Format) 를 지원하며, 다양한 바둑 프로그램과의 호환이 가능합니다. 
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">KataGo 엔진</h3>
              <p className="text-gray-600">
              최신 오픈소스 바둑 AI인 KataGo를 활용하여 복잡한 전투나 분기 상황에서도 다양한 변화도를 제시하여, 사용자가 놓친 수나 더 나은 전략을 쉽게 파악할 수 있게 도와줍니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div id="cta-section" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-12 text-center relative overflow-hidden border border-gray-100 shadow-md"
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-sky-100/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-gray-100 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                당신의 바둑 여정을 <span className="text-black">오랫동안 소중히 보존하세요</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              종이 기보와 달리 시간이 지나도 바래지 않는 디지털 기보 라이브러리를 만들어 보세요. <br />
              Goggle과 함께라면 모든 기보가 소중한 기록이 됩니다. 
              </p>
              <Link
                href="/auth/signin"
                className="px-8 py-4 rounded-full bg-black text-white hover:shadow-lg hover:shadow-gray-200/50 hover:translate-y-[-2px] transition-all duration-300 ease-out text-base font-medium inline-block"
              >
                무료로 시작하기
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
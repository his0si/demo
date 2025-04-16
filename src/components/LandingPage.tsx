'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToContent = useCallback(() => {
    const contentSection = document.getElementById('content-section');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
          <button
            onClick={scrollToTop}
            className="text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-all duration-300"
          >
            goggle<span className="text-sky-400">.</span>
          </button>
          <div className="flex items-center gap-8">
            <Link href="#content-section" className="text-gray-600 text-sm font-medium hover:text-black hidden md:block">솔루션</Link>
            <Link href="#tech-section" className="text-gray-600 text-sm font-medium hover:text-black hidden md:block">기술</Link>
            <Link href="#cta-section" className="text-gray-600 text-sm font-medium hover:text-black hidden md:block">시작하기</Link>
            <Link
              href="/auth/signin"
              className="px-5 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 hover:text-black transition-all duration-300"
            >
              로그인
            </Link>
          </div>
        </div>
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
                src={"/images/mockup.png"}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 11H4C2.89543 11 2 11.8954 2 13V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V13C22 11.8954 21.1046 11 20 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI 분석 제공</h3>
                <p className="text-gray-600 leading-relaxed">
                  최신 바둑 AI가 당신의 기보를 분석하여 깊이 있는 통찰력을 제공합니다. 
                  이제 프로급 해설을 언제든지 접할 수 있습니다.
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">하이라이트 생성</h3>
                <p className="text-gray-600 leading-relaxed">
                  중요한 국면들을 자동으로 포착하여 핵심만 모아볼 수 있습니다.
                  복잡한 대국도 명확한 스토리로 정리됩니다.
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
              각 대국은 당신의 사고방식, 느낌, 그리고 성장 과정을 담고 있습니다.
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
              <p className="text-gray-600 mb-6">
                &quot;그때 그 한 수가 어땠더라...&quot; 이제 더 이상 흐릿한 기억이나 바래진 종이 기보에 의존하지 마세요. 
                소중한 기보들이 언제든 쉽게 찾아볼 수 있는 디지털 자산으로 영원히 보존됩니다.
              </p>
              <div className="w-full h-[200px] bg-gray-50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">종이 기보에서 디지털 기보로 변환 이미지</p>
                </div>
              </div>
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
              <p className="text-gray-600 mb-6">
                단순히 기보를 저장하는 것을 넘어, 각 국면의 깊은 의미를 AI가 분석하여 제공합니다.
                당신의 기보가 가진 이야기를 더 풍부하게 이해할 수 있습니다.
              </p>
              <div className="w-full h-[200px] bg-gray-50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">AI 분석을 통한 통찰력 제공 이미지</p>
                </div>
              </div>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50053 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50053 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">GTP 프로토콜</h3>
              <p className="text-gray-600">
                바둑 엔진과 GUI를 효과적으로 연결하는 Go Text Protocol을 통해 안정적인 분석 환경을 제공합니다.
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SGF 표준 지원</h3>
              <p className="text-gray-600">
                바둑 기보의 산업 표준인 SGF(Smart Game Format)를 완벽하게 지원하여 다양한 바둑 프로그램과의 호환성을 보장합니다.
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
                최신 오픈소스 바둑 AI인 KataGo를 활용하여 고품질의 분석과 정확한 변화도 탐색을 가능하게 합니다.
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
                당신의 바둑 여정을 <span className="text-black">영원히 간직하세요</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                종이 기보처럼 시간이 지나도 바래지 않는 디지털 기보 라이브러리를 만들어 보세요.
                Goggle과 함께라면 모든 기보가 소중한 추억이 됩니다.
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

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-xl font-bold tracking-tight text-gray-900">
                goggle<span className="text-sky-400">.</span>
              </p>
              <p className="text-gray-500 mt-2">
                바둑 이야기를 담는 AI 기반 복기 서비스
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">블로그</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">문의하기</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">개인정보처리방침</a>
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

export default LandingPage;
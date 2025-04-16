'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LandingPage from '@/components/LandingPage';
import GameBoard from '@/components/GameBoard';
import useGame from '@/hooks/useGame';

export default function Home() {
  const { isGameStarted, startGame } = useGame();
  const { data: session, status } = useSession();
  
  // 로그인 상태 확인 후 게임 자동 시작
  useEffect(() => {
    if (status === 'authenticated' && session && !isGameStarted) {
      startGame();
    }
  }, [status, session, isGameStarted, startGame]);
  
  return (
    <>
      {isGameStarted ? (
        <div className="min-h-screen flex flex-col">
          
          <main className="flex-grow">
            <GameBoard />
          </main>
          
          <footer className="bg-gray-50 border-t border-gray-100 py-6">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-xl font-bold tracking-tight text-gray-900">
                  goggle<span className="text-sky-400">.</span>
                </p>
                
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">블로그</a>
                  <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">문의하기</a>
                  <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">개인정보처리방침</a>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                <p className="text-sm text-gray-500">© 2025 Goggle. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
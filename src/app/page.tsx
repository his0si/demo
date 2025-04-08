'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
  
  const handleLogoClick = () => {
    signOut({ redirect: true, callbackUrl: '/' });
  };
  
  return (
    <>
      {isGameStarted ? (
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              
              <h1 
                className="text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
                onClick={handleLogoClick}
                title="로그아웃"
              >
                Goggle <sup>BETA</sup>
              </h1>
              
            </div>
          </header>
          
          <main className="flex-grow">
            <GameBoard />
          </main>
          
          <footer className="bg-gray-800 text-white text-center p-4">
            <p>© 2025 Goggle</p>
          </footer>
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
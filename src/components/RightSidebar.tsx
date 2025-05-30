'use client';

import { Game } from '@/lib/game';
import GameTreeManager from '@/components/GameTree/GameTree';
import { GameTree, PatternDescription } from '@/lib/types';
import { 
  DocumentTextIcon, 
  PuzzlePieceIcon, 
  ChatBubbleBottomCenterTextIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';

interface RightSidebarProps {
  comment: string;
  setComment: (comment: string) => void;
  gameRef: React.RefObject<Game | null>;  // null을 허용하도록 수정
  gameTree?: GameTree;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function RightSidebar({ 
  comment, 
  setComment, 
  gameRef, 
  gameTree,
  isCollapsed,
  onToggle
}: RightSidebarProps) {
  const [currentPattern, setCurrentPattern] = useState<PatternDescription | null>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const currentNodeIdRef = useRef<string | undefined>(gameTree?.currentNodeId);
  const userToggleRef = useRef<boolean>(false);
  
  // lastMove를 별도의 변수로 추출
  const lastMove = gameRef.current?.getLastMove();

  // 패턴 인식 관련 효과
  useEffect(() => {
    const updatePattern = async () => {
      if (!gameRef.current) return;
      try {
        const pattern = await gameRef.current.getCurrentPattern();
        setCurrentPattern(pattern);
      } catch (error) {
        console.error('패턴 인식 중 오류 발생:', error);
        setCurrentPattern(null);
      }
    };
    updatePattern();
  }, [gameRef, lastMove]);

  // 토글 버튼 클릭 핸들러
  const handleToggleClick = useCallback(() => {
    userToggleRef.current = true;
    onToggle();
    setTimeout(() => {
      userToggleRef.current = false;
    }, 200);
  }, [onToggle]);

  // 화면 크기 감지 및 자동 접기
  useEffect(() => {
    const checkScreenSize = () => {
      if (userToggleRef.current) return;
      const mobile = window.innerWidth < 1024;
      if (mobile && !isCollapsed) {
        onToggle();
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed, onToggle]);

  // 코멘트 변경 핸들러
  const handleCommentChange = useCallback((value: string) => {
    setComment(value);
    if (gameRef.current) {
      gameRef.current.updateComment(value);
    }
  }, [gameRef, setComment]);

  // 게임 트리 노드 클릭 핸들러
  const handleNodeClick = useCallback((nodeId: string) => {
    if (gameRef.current) {
      gameRef.current.navigateToNode(nodeId);
    }
  }, [gameRef]);

  // 현재 노드 스크롤 효과 - gameTree 의존성 추가
  useEffect(() => {
    if (!gameTree || !treeContainerRef.current) return;
    if (currentNodeIdRef.current !== gameTree.currentNodeId) {
      currentNodeIdRef.current = gameTree.currentNodeId;
      setTimeout(() => {
        const selectedNode = treeContainerRef.current?.querySelector(
          `[data-node-id="${gameTree.currentNodeId}"]`
        );
        selectedNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [gameTree]);

  return (
    <motion.aside 
      className={`${isCollapsed ? 'w-16' : 'w-72'} border-l border-gray-200 bg-gray-50 h-[calc(100vh-64px)] flex flex-col overflow-hidden transition-all duration-300`}
      initial={false}
    >
      {isCollapsed ? (
        <div className="flex flex-col items-center justify-between h-full py-4">
          <button
            onClick={handleToggleClick}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center mb-4"
            aria-label="펼치기"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex flex-col items-center gap-8">
            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
            <PuzzlePieceIcon className="w-6 h-6 text-green-500" />
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-amber-500" />
          </div>
          
          <div></div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-y-auto">
          {/* 헤더 영역 */}
          <div className="flex justify-between items-center p-4 pb-2 flex-shrink-0">
            <div className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-md font-semibold text-gray-700">게임 트리</h3>
            </div>
            
            <button
              onClick={handleToggleClick}
              className="hover:bg-gray-200 rounded-full transition-colors p-1.5"
              aria-label="사이드바 접기"
            >
              <ChevronDoubleRightIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 게임 트리 영역 */}
          <div className="border-b border-gray-200 overflow-hidden px-4 pt-0 pb-4 flex-shrink-0" style={{ height: '50%', minHeight: '250px' }}>
            <div className="bg-white rounded-lg p-2 h-full overflow-hidden">
              {gameTree ? (
                <div ref={treeContainerRef} className="h-full overflow-auto custom-scrollbar bg-white">
                  <div className="relative min-w-[180px]">
                    <GameTreeManager
                      gameTree={gameTree}
                      onNodeClick={handleNodeClick}
                      gridSize={30}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 text-sm">아직 게임이 시작되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 바둑 개념 학습 영역 */}
          <div className="border-b border-gray-200 overflow-hidden flex-shrink-0" style={{ height: '15%', minHeight: '120px' }}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center mb-2">
                <PuzzlePieceIcon className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-md font-semibold text-gray-700">바둑 개념 학습</h3>
              </div>
              
              <div className="bg-white rounded-lg p-2 flex-1">
                {currentPattern ? (
                  <div className="flex flex-col h-full">
                    <p className="text-gray-900 font-medium mb-1">{currentPattern.description}</p>
                    {currentPattern.url && (
                      <a 
                        href={currentPattern.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:text-sky-600 text-sm mt-auto"
                      >
                        자세히 보기 →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">연관된 개념이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메모 영역 - 최소 높이 설정 */}
          <div className="p-4 flex flex-col overflow-hidden flex-shrink-0" style={{ height: '35%', minHeight: '150px' }}>
            <div className="flex items-center mb-3">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="text-md font-semibold text-gray-700">메모</h3>
            </div>
            
            <div className="bg-white rounded-lg p-1 flex-1 flex flex-col">
              <textarea
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                className="w-full flex-1 p-3 rounded text-gray-700 resize-none border-none focus:ring-0 focus:outline-none custom-scrollbar"
                placeholder="현재 수에 대한 메모를 입력하세요..."
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .connections path {
          shape-rendering: geometricPrecision;
          pointer-events: none;
        }
        .nodes {
          isolation: isolate;
        }
      `}</style>
    </motion.aside>
  );
}
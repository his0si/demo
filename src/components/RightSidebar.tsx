'use client';

import { Game } from '@/lib/game';
import GameTreeManager from '@/components/GameTree/GameTree';
import { GameTree } from '@/lib/types';
import { 
  DocumentTextIcon, 
  PuzzlePieceIcon, 
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

export interface GameState {
  comment: string;
  [key: string]: unknown;
}

export interface GameRef {
  getGameState: () => GameState;
  updateComment: (comment: string) => void;
}

interface RightSidebarProps {
  comment: string;
  setComment: (comment: string) => void;
  gameRef: React.RefObject<Game | null>;
  gameTree?: GameTree;
}

export default function RightSidebar({ comment, setComment, gameRef, gameTree }: RightSidebarProps) {
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

  return (
    <motion.aside 
      className="w-72 border-l border-gray-200 bg-gray-50 h-[calc(100vh-64px)] flex flex-col overflow-hidden"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
    

      {/* 게임 트리 영역 */}
      <div className="h-[55%] border-b border-gray-200 overflow-hidden">
        <div className="h-full p-4 flex flex-col">
          <div className="flex items-center mb-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-md font-semibold text-gray-700">게임 트리</h3>
          </div>
          
          <div className="bg-white rounded-lg p-2 flex-1 overflow-hidden">
            {gameTree ? (
              <div className="h-full overflow-auto custom-scrollbar bg-white">
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
                <p className="text-gray-500 text-sm">
                  아직 게임이 시작되지 않았습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boardmatcher 영역 - 높이 줄임 */}
      <div className="h-[10%] border-b border-gray-200 overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center mb-2">
            <PuzzlePieceIcon className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-md font-semibold text-gray-700">바둑 개념 학습</h3>
          </div>
          
          <div className="bg-white rounded-lg p-1 flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">연관된 개념이 없습니다.</p>
          </div>
        </div>
      </div>

      {/* Comment 영역 */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
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
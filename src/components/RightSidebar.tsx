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
  const handleCommentChange = (value: string) => {
    setComment(value);
    if (gameRef.current) {
      gameRef.current.updateComment(value);
    }
  };

  return (
    <motion.aside 
      className="w-64 border-l border-gray-200 bg-gray-50 min-h-screen flex flex-col"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 게임 트리 영역 */}
      <div className="h-[44%] border-b border-gray-200">
        <div className="h-full p-4">
          <div className="flex items-center mb-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-md font-semibold text-gray-700">게임 트리</h3>
          </div>
          
          <div className="h-[calc(100%-2rem)] bg-white rounded-lg p-3 overflow-hidden">
            {gameTree ? (
              <div className="h-full overflow-auto custom-scrollbar">
                <div className="h-full min-w-[150px] overflow-x-auto">
                  <GameTreeManager
                    gameTree={gameTree}
                    onNodeClick={(nodeId) => {
                      if (gameRef.current) {
                        gameRef.current.navigateToNode(nodeId);
                      }
                    }}
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

      {/* Boardmatcher 영역 */}
      <div className="h-[12%] border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <PuzzlePieceIcon className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-md font-semibold text-gray-700">바둑 개념 학습</h3>
          </div>
          
          <div className="bg-white rounded-lg p-3 h-[calc(100%-2rem)]">
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-gray-500 text-sm">연관된 개념이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comment 영역 */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-center mb-2">
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-amber-500 mr-2" />
          <h3 className="text-md font-semibold text-gray-700">메모</h3>
        </div>
        
        <div className="bg-white rounded-lg p-1 flex-1 flex flex-col">
          <textarea
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            className="w-full flex-1 p-2 rounded text-gray-700 resize-none border-none focus:ring-0 focus:outline-none custom-scrollbar"
            placeholder="현재 수에 대한 메모를 입력하세요..."
            style={{ minHeight: '100px' }}
          />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </motion.aside>
  );
}
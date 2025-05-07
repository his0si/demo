import { Game } from '@/lib/game';
import GameTreeManager from '@/components/GameTree/GameTree';
import { GameTree, PatternDescription } from '@/lib/types';
import { useState, useEffect } from 'react';

export interface GameState {
  comment: string;
  [key: string]: unknown; // More type-safe than 'any' while still allowing dynamic properties
}

export interface GameRef {
  getGameState: () => GameState;
  updateComment: (comment: string) => void;
}

interface RightSidebarProps {
  comment: string;
  setComment: (comment: string) => void;
  gameRef: React.RefObject<Game>;
  gameTree?: GameTree;
}

export default function RightSidebar({ comment, setComment, gameRef, gameTree }: RightSidebarProps) {
  const [currentPattern, setCurrentPattern] = useState<PatternDescription | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    setGame(gameRef.current);
  }, [gameRef]);

  useEffect(() => {
    const updatePattern = async () => {
      if (!game) return;
      try {
        const pattern = await game.getCurrentPattern();
        setCurrentPattern(pattern);
      } catch (error) {
        console.error('패턴 인식 중 오류 발생:', error);
        setCurrentPattern(null);
      }
    };
    updatePattern();
  }, [game]);

  // 게임 상태가 변경될 때마다 패턴 업데이트
  useEffect(() => {
    if (!game) return;
    const updatePattern = async () => {
      try {
        const pattern = await game.getCurrentPattern();
        setCurrentPattern(pattern);
      } catch (error) {
        console.error('패턴 인식 중 오류 발생:', error);
        setCurrentPattern(null);
      }
    };
    updatePattern();
  }, [game?.getLastMove()]);

  // 코멘트 변경 핸들러
  const handleCommentChange = (value: string) => {
    setComment(value);
    if (gameRef.current) {
      gameRef.current.updateComment(value);
    }
  };

  return (
    <div className="w-64 border-l border-gray-200 bg-gray-100 h-screen flex flex-col">
      {/* 게임 트리 영역 */}
      <div className="h-[44%] border-b border-gray-200">
        <div className="h-full p-4">
          <h3 className="text-md font-semibold mb-2">Gametree</h3>
          <div className="h-[calc(100%-2rem)] bg-white rounded p-2">  {/* bg-white를 bg-transparent로 변경 */}
            {gameTree ? (
              <div className="h-full overflow-auto">
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
              <div className="text-gray-500 text-sm">
                게임이 시작되지 않았습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boardmatcher 영역 */}
      <div className="h-[12%] border-b border-gray-200">
        <div className="p-4">
          <h3 className="text-md font-semibold mb-1">Boardmatcher</h3>
          <div className="bg-white rounded p-2 shadow-inner overflow-auto">
            {currentPattern ? (
              <div className="text-sm">
                <div className="font-medium text-gray-800">{currentPattern.description}</div>
                <a
                  href={currentPattern.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-xs mt-1 block"
                >
                  자세히 보기
                </a>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                패턴이 인식되지 않았습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment 영역 */}
      <div className="flex-1 p-4">
        <h3 className="text-md font-semibold mb-1">Memo</h3>
        <textarea
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          className="w-full h-64 p-2 rounded bg-white resize-none"
          placeholder="메모를 입력하세요"
        />
      </div>
    </div>
  );
}
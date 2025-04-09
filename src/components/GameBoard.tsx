'use client';
import * as FileSaver from 'file-saver';
import { useCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import GameControls from './GameControls';
import useGame from '@/hooks/useGame';
import RightSidebar, { GameRef } from './RightSidebar'; // GameRef import 추가

// Game 타입의 확장 인터페이스 정의
interface ExtendedGameRef extends GameRef {
  markers: Array<{x: number; y: number; type: string; label?: string; moveNum?: number}>;
  saveSGF: () => string;
  addMarker: (x: number, y: number, type: string, label?: string) => void;
  notifyStateChange: () => void;
}

export default function GameBoard() {
  const [currentTool, setCurrentTool] = useState<string>('move');
  
  const {
    isGameEnded,
    boardState,
    blackScore,
    whiteScore,
    blackTerritory,
    whiteTerritory,
    currentPlayer,
    lastMove,
    makeMove,
    pass,
    undo,
    redo,
    importSGF,
    claimTerritory,
    startGame,
    game,
    comment,
    setComment,
  } = useGame();

  // ExtendedGameRef 타입으로 변경
  const gameRef = useRef<ExtendedGameRef | null>(null);
  
  // 컴포넌트가 마운트되면 자동으로 게임을 시작합니다
  useEffect(() => {
    if (!boardState) {
      startGame();
    }
  }, [boardState, startGame]);
  
  useEffect(() => {
    if (game) {
      // Game 타입을 ExtendedGameRef 타입으로 캐스팅
      gameRef.current = game as unknown as ExtendedGameRef;
    }
  }, [game]);

  useEffect(() => {
    if (gameRef.current && game) {
      gameRef.current.markers = game.getGameState()?.markers ?? [];
    }
  }, [game]);

  const handleIntersectionClick = useCallback((x: number, y: number) => {
    if (isGameEnded) {
      claimTerritory(x, y);
    } else {
      if (currentTool === 'move') {
        makeMove(x, y);
      } else {
        const existing = game?.getGameState()?.markers?.find(m => m.x === x && m.y === y);
        if (existing?.type === currentTool) {
          if (!game) return;
          game.markers = game.markers.filter(m => !(m.x === x && m.y === y && m.type === currentTool));
          const state = game.getGameState();
          if (state) {
            state.markers = [...game.markers];
          }
          game.notifyStateChange();
        } else {
          if (!game) return;
          let label: string | undefined = undefined;
          if (currentTool === 'letter') {
            const allLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
            const usedLabels = game.markers.filter(m => m.type === 'letter').map(m => m.label);
            label = allLetters.find(ch => !usedLabels.includes(ch)) ?? '?';
          }
          if (currentTool === 'number') {
            const usedNumbers = game.markers
              .filter(m => m.type === 'number')
              .map(m => parseInt(m.label || '0'));
            const nextNumber = 1 + Math.max(0, ...usedNumbers);
            label = nextNumber.toString();
          }
          game.addMarker(x, y, currentTool, label);
        }
      }
    }
  }, [isGameEnded, makeMove, claimTerritory, currentTool, game]);
  
  if (!boardState) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl mb-4">게임 로딩 중...</h2>
      </div>
    );
  }

  const handleSaveGame = () => {
    if (gameRef.current?.saveSGF) {
      const sgf = gameRef.current.saveSGF();
      if (sgf) {
        const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
        FileSaver.saveAs(blob, 'game.sgf');
      }
    }
  };
  
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="container mx-auto p-4 flex flex-col">
          <GameControls
            currentPlayer={currentPlayer}
            blackScore={blackScore}
            whiteScore={whiteScore}
            blackTerritory={blackTerritory}
            whiteTerritory={whiteTerritory}
            isGameEnded={isGameEnded}
            onPass={pass}
            onUndo={undo}
            onRedo={redo}
            onSave={handleSaveGame}
            onLoad={importSGF}
            showToolButtons={false}
          />

          <Board
            size={19}
            boardState={boardState}
            lastMove={lastMove}
            isGameEnded={isGameEnded}
            onIntersectionClick={handleIntersectionClick}
            markers={game?.getGameState()?.markers ?? []}
          />  

          <GameControls
            currentPlayer={currentPlayer}
            blackScore={blackScore}
            whiteScore={whiteScore}
            blackTerritory={blackTerritory}
            whiteTerritory={whiteTerritory}
            isGameEnded={isGameEnded}
            onPass={pass}
            onUndo={undo}
            onRedo={redo}
            onSave={handleSaveGame}
            onLoad={importSGF}
            onSelectTool={setCurrentTool}
            selectedTool={currentTool}
            showOnlyToolButtons={true}
          />
        </div>
      </div>
      <RightSidebar 
        comment={comment} 
        setComment={setComment} 
        gameRef={gameRef as React.RefObject<GameRef>} 
      />
    </div>
  );
}
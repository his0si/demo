'use client';
import { Game } from '@/lib/game';
import * as FileSaver from 'file-saver';
import { useCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import GameControls from './GameControls';
import useGame from '@/hooks/useGame';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import NavBar from './NavBar';

export default function GameBoard() {
  const [currentTool, setCurrentTool] = useState<string>('move');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    isGameEnded,
    boardState,
    blackScore,
    whiteScore,
    blackTerritory,
    whiteTerritory,
    currentPlayer,
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

  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!boardState) {
      startGame();
    }
  }, [boardState, startGame]);

  useEffect(() => {
    if (game) {
      gameRef.current = game;
    }
  }, [game]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.markers = game?.getGameState()?.markers ?? [];
    }
  }, [game]);

  const handleIntersectionClick = useCallback(
    (x: number, y: number) => {
      if (isGameEnded) {
        claimTerritory(x, y);
      } else {
        if (currentTool === 'move') {
          makeMove(x, y);
        } else {
          const existing = game?.getGameState()?.markers?.find(
            (m) => m.x === x && m.y === y
          );
          if (existing?.type === currentTool) {
            if (!game) return;
            game.removeMarker(x, y, currentTool); // 새로운 removeMarker 메서드 사용
          } else {
            if (!game) return;
            let label: string | undefined = undefined;
            if (currentTool === 'letter') {
              const allLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
              const usedLabels = game.markers
                .filter((m) => m.type === 'letter')
                .map((m) => m.label);
              label = allLetters.find((ch) => !usedLabels.includes(ch)) ?? '?';
            }
            if (currentTool === 'number') {
              const usedNumbers = game.markers
                .filter((m) => m.type === 'number')
                .map((m) => parseInt(m.label || '0'));
              const nextNumber = 1 + Math.max(0, ...usedNumbers);
              label = nextNumber.toString();
            }
            game.addMarker(x, y, currentTool, label);
          }
        }
      }
    },
    [isGameEnded, makeMove, claimTerritory, currentTool, game]
  );

  if (!boardState) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl mb-4">게임 로딩 중...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex gap-4">
        <LeftSidebar
          recentFiles={[]} // TODO: Replace with actual recent SGF file data
          onFileClick={(file) => {
            // TODO: Add actual SGF file loading logic here
            console.log('Load file:', file);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />
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
              onSave={() => {
                const sgf = gameRef.current?.saveSGF();
                if (sgf) {
                  const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
                  FileSaver.saveAs(blob, 'game.sgf');
                }
              }}
              onLoad={importSGF}
              showOnlyControlButtons={true}
            />

            <Board
              size={19}
              boardState={boardState}
              lastMoveMarkers={game?.getCurrentAndNextMove()}
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
              onSave={() => {
                const sgf = gameRef.current?.saveSGF();
                if (sgf) {
                  const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
                  FileSaver.saveAs(blob, 'game.sgf');
                }
              }}
              onLoad={importSGF}
              onSelectTool={setCurrentTool}
              selectedTool={currentTool}
              showOnlyToolButtons={true}
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
              onSave={() => {
                const sgf = gameRef.current?.saveSGF();
                if (sgf) {
                  const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
                  FileSaver.saveAs(blob, 'game.sgf');
                }
              }}
              onLoad={importSGF}
              showOnlyScoreBoxes={true}
            />
          </div>
        </div>
        <RightSidebar 
          comment={comment}
          setComment={setComment}
          gameRef={gameRef}
          gameTree={gameRef.current?.getGameTree()}
        />
      </div>
    </div>
  );
}
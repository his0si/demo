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
import { sgfStorage } from '@/lib/sgfStorage';
import { SGFFile } from './LeftSidebar';

export default function GameBoard() {
  const [currentTool, setCurrentTool] = useState<string>('move');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sgfFiles, setSgfFiles] = useState<SGFFile[]>([]);
  const [currentSGFFile, setCurrentSGFFile] = useState<SGFFile | null>(null);

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
    goToStart,
    goToEnd,
    game,
    comment,
    setComment,
    handleDeleteClick,
    loadSGF
  } = useGame();

  const gameRef = useRef<Game | null>(null);

  // SGF 파일 목록 로드 - 명시적으로 즉시 로드 후 상태 업데이트
  const loadSgfFileList = useCallback(() => {
    console.log('로컬 스토리지에서 SGF 파일 목록 로드 중...');
    const files = sgfStorage.getAll();
    console.log('로드된 SGF 파일:', files.length, '개');
    setSgfFiles(files);
  }, []);

  // 컴포넌트 마운트 시 및 필요할 때 SGF 파일 목록 로드
  useEffect(() => {
    // 초기 로드
    loadSgfFileList();
    
    // 로컬 스토리지 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goggle-sgf-files') {
        console.log('로컬 스토리지 변경 감지됨');
        loadSgfFileList();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadSgfFileList]);

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
          const currentMarkers = game?.getGameState()?.markers ?? [];
          const existing = currentMarkers.find(
            (m) => m.x === x && m.y === y
          );
          
          if (existing?.type === currentTool) {
            if (!game) return;
            game.removeMarker(x, y, currentTool);
          } else {
            if (!game) return;
            let label: string | undefined = undefined;
            
            if (currentTool === 'letter') {
              const allLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
              const usedLabels = currentMarkers
                .filter((m) => m.type === 'letter')
                .map((m) => m.label);
              label = allLetters.find((ch) => !usedLabels.includes(ch)) ?? '?';
            }
            
            if (currentTool === 'number') {
              const usedNumbers = currentMarkers
                .filter((m) => m.type === 'number')
                .map((m) => parseInt(m.label || '0'));
              const nextNumber = usedNumbers.length > 0 
                ? Math.max(...usedNumbers) + 1 
                : 1;
              label = nextNumber.toString();
            }
            
            game.addMarker(x, y, currentTool, label);
          }
        }
      }
    },
    [isGameEnded, makeMove, claimTerritory, currentTool, game]
  );

  const handleMarkerClick = useCallback(
    (x: number, y: number) => {
      if (currentTool !== 'move') {
        handleIntersectionClick(x, y);
      }
    },
    [currentTool, handleIntersectionClick]
  );

  // SGF 파일 저장 함수
  const handleSaveSGF = useCallback(() => {
    if (!gameRef.current) return;

    const sgf = gameRef.current.saveSGF();
    if (sgf) {
      try {
        // 파일 이름 생성 (현재 날짜/시간 기반)
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const fileName = `Goggle-${year}${month}${day}-${hours}${minutes}.sgf`;
        
        // 파일 저장 (브라우저 다운로드)
        const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
        FileSaver.saveAs(blob, fileName);
        
        // 로컬 저장소에도 저장
        const savedFile = sgfStorage.saveSGF(fileName, sgf);
        console.log('SGF 파일 저장됨:', fileName);
        
        // 파일 목록 상태 갱신 - 바로 갱신하는 방식 사용
        loadSgfFileList();
        setCurrentSGFFile(savedFile);
        
        alert(`SGF 파일이 저장되었습니다: ${fileName}`);
      } catch (error) {
        console.error('SGF 저장 중 오류 발생:', error);
        alert('SGF 파일 저장 중 오류가 발생했습니다.');
      }
    }
  }, [loadSgfFileList]);

  // SGF 파일 불러오기 함수
  const handleLoadSGF = useCallback((file: SGFFile) => {
    try {
      console.log(`SGF 파일 로드 시작: ${file.name} (ID: ${file.id})`);
      // 파일 내용 가져오기
      const sgfContent = sgfStorage.getSGFContent(file.id);
      if (!sgfContent) {
        alert('SGF 파일 내용을 불러올 수 없습니다.');
        return;
      }
      
      // 게임에 SGF 적용
      loadSGF(sgfContent);
      
      // 열어본 시간 업데이트
      sgfStorage.updateOpenedTime(file.id);
      
      // 현재 선택된 파일 설정
      setCurrentSGFFile(file);
      
      // 사이드바 파일 목록 갱신 - 데이터 새로 불러오기
      loadSgfFileList();
      
      console.log(`SGF 파일을 불러왔습니다: ${file.name}`);
    } catch (error) {
      console.error('SGF 로드 중 오류 발생:', error);
      alert('SGF 파일을 불러오는 중 오류가 발생했습니다.');
    }
  }, [loadSGF, loadSgfFileList]);

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = useCallback((file: SGFFile) => {
    sgfStorage.toggleFavorite(file.id);
    // 상태 즉시 갱신
    loadSgfFileList();
  }, [loadSgfFileList]);

  // 파일 삭제 핸들러 추가
  const handleDeleteFile = useCallback((file: SGFFile) => {
    try {
      console.log(`SGF 파일 삭제 시작: ${file.name} (ID: ${file.id})`);
      
      // 현재 선택된 파일을 삭제하는 경우
      if (currentSGFFile && currentSGFFile.id === file.id) {
        // 새 게임 시작
        startGame();
        setCurrentSGFFile(null);
      }
      
      // 스토리지에서 파일 삭제
      sgfStorage.deleteSGF(file.id);
      
      // 파일 목록 갱신
      loadSgfFileList();
      
      console.log(`SGF 파일 삭제 완료: ${file.name}`);
    } catch (error) {
      console.error('SGF 파일 삭제 중 오류 발생:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  }, [currentSGFFile, loadSgfFileList, startGame]);

  if (!boardState) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl mb-4">게임 로딩 중...</h2>
      </div>
    );
  }

return (
  <div className="flex flex-col h-screen overflow-hidden">
    <NavBar />
    <div className="flex flex-1 overflow-hidden">
      <LeftSidebar
        recentFiles={sgfFiles}
        onFileClick={handleLoadSGF}
        onToggleFavorite={handleToggleFavorite}
        onDeleteFile={handleDeleteFile}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        currentFileId={currentSGFFile?.id}
      />
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="max-w-3xl w-full flex flex-col items-center px-4">
          {/* 점수 표시 (상단) */}
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
            onSave={handleSaveSGF}
            onLoad={importSGF}
            type="score"
          />

          {/* 바둑판 */}
          <div className="my-4 flex justify-center">
            <Board
              size={19}
              boardState={boardState}
              lastMoveMarkers={game?.getCurrentAndNextMove()}
              isGameEnded={isGameEnded}
              onIntersectionClick={handleIntersectionClick}
              markers={game?.getGameState()?.markers ?? []}
              showDeleteConfirm={false}
              deletePosition={null}
              onDeleteClick={handleDeleteClick}
              onConfirmDelete={() => {}}
              onCancelDelete={() => {}}
              isMarkerMode={currentTool !== 'move'}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          {/* 컨트롤 바 (하단) */}
          <div className="mt-2 w-full">
            <GameControls
              currentPlayer={currentPlayer}
              blackScore={blackScore}
              whiteScore={whiteScore}
              blackTerritory={blackTerritory}
              whiteTerritory={whiteTerritory}
              isGameEnded={isGameEnded}
              onGoToStart={goToStart}
              onGoToEnd={goToEnd}
              onPass={pass}
              onUndo={undo}
              onRedo={redo}
              onSave={handleSaveSGF}
              onLoad={importSGF}
              onSelectTool={setCurrentTool}
              selectedTool={currentTool}
              type="controls"
            />
          </div>

          {/* 게임 종료 메시지 (최하단) */}
          <div className="w-full">
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
              onSave={handleSaveSGF}
              onLoad={importSGF}
              type="game-end"
            />
          </div>
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
);}
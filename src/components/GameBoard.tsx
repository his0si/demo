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
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  // 반응형 디자인을 위한 상태
  const [boardSize, setBoardSize] = useState(0);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const userToggleRef = useRef(false);

  // 반응형 상태 감지 (모바일, 태블릿, 데스크탑)
  const [viewportSize, setViewportSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1280;
      const isDesktop = width >= 1280;
      
      setViewportSize({ isMobile, isTablet, isDesktop });
      
      // 사이드바 자동 조정 (사용자 토글이 아닌 경우)
      if (!userToggleRef.current) {
        if (isMobile) {
          setIsSidebarCollapsed(true);
          setIsRightSidebarCollapsed(true);
        } else if (isTablet) {
          setIsSidebarCollapsed(true);
          setIsRightSidebarCollapsed(false);
        } else {
          setIsSidebarCollapsed(false);
          setIsRightSidebarCollapsed(false);
        }
      }
      
      // 바둑판 크기 계산
      calculateBoardSize();
    };
    
    // 바둑판 크기를 동적으로 계산하는 함수
    const calculateBoardSize = () => {
      if (!boardContainerRef.current) return;
      
      const containerWidth = boardContainerRef.current.clientWidth;
      const containerHeight = window.innerHeight - 140; // 네비게이션 바와 여백 고려
      
      // 정사각형 크기로 설정 (컨테이너 내부에서 최대한 크게)
      const maxSize = Math.min(containerWidth * 0.95, containerHeight * 0.75);
      setBoardSize(Math.floor(maxSize));
    };
    
    // 초기 실행 및 이벤트 리스너 등록
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 사이드바 토글 핸들러
  const handleSidebarToggle = useCallback(() => {
    userToggleRef.current = true;
    setIsSidebarCollapsed(prev => !prev);
    // 토글 후 타이머로 사용자 액션 플래그 초기화
    setTimeout(() => {
      userToggleRef.current = false;
    }, 200);
  }, []);

  const handleRightSidebarToggle = useCallback(() => {
    userToggleRef.current = true;
    setIsRightSidebarCollapsed(prev => !prev);
    setTimeout(() => {
      userToggleRef.current = false;
    }, 200);
  }, []);

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

  // SGF 파일 목록 로드
  const loadSgfFileList = useCallback(() => {
    const files = sgfStorage.getAll();
    setSgfFiles(files);
  }, []);

  useEffect(() => {
    loadSgfFileList();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goggle-sgf-files') {
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
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const fileName = `Goggle-${year}${month}${day}-${hours}${minutes}.sgf`;

        const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
        FileSaver.saveAs(blob, fileName);

        const savedFile = sgfStorage.saveSGF(fileName, sgf);
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
      const sgfContent = sgfStorage.getSGFContent(file.id);
      if (!sgfContent) {
        alert('SGF 파일 내용을 불러올 수 없습니다.');
        return;
      }

      loadSGF(sgfContent);
      sgfStorage.updateOpenedTime(file.id);
      setCurrentSGFFile(file);
      loadSgfFileList();
    } catch (error) {
      console.error('SGF 로드 중 오류 발생:', error);
      alert('SGF 파일을 불러오는 중 오류가 발생했습니다.');
    }
  }, [loadSGF, loadSgfFileList]);

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = useCallback((file: SGFFile) => {
    sgfStorage.toggleFavorite(file.id);
    loadSgfFileList();
  }, [loadSgfFileList]);

  // 파일 삭제 핸들러
  const handleDeleteFile = useCallback((file: SGFFile) => {
    try {
      if (currentSGFFile && currentSGFFile.id === file.id) {
        startGame();
        setCurrentSGFFile(null);
      }

      sgfStorage.deleteSGF(file.id);
      loadSgfFileList();
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
        {/* 왼쪽 사이드바 */}
        <LeftSidebar
          recentFiles={sgfFiles}
          onFileClick={handleLoadSGF}
          onToggleFavorite={handleToggleFavorite}
          onDeleteFile={handleDeleteFile}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
          currentFileId={currentSGFFile?.id}
        />
        
        {/* 게임 보드 섹션 - 메인 컨텐츠 */}
        <div 
          ref={boardContainerRef}
          className="flex-1 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* 게임 컨트롤과 바둑판을 하나의 단위로 통합 */}
          <div className={`
            w-full h-full flex flex-col justify-center items-center 
            ${viewportSize.isMobile ? 'px-1' : viewportSize.isTablet ? 'px-2' : 'px-4'}
          `}>
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* 상단 점수 표시 영역 */}
              <div className="w-full mb-1">
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
              </div>
              
              {/* 바둑판 영역 - 적절한 크기로 조정 */}
              <div className="w-full flex justify-center mb-1">
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
                  boardSize={boardSize} // Pass boardSize to Board component
                />
              </div>
              
              {/* 하단 컨트롤 영역 */}
              <div className="w-full">
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
              
              {/* 게임 종료 메시지 (조건부 렌더링) */}
              {isGameEnded && (
                <div className="w-full mt-1">
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
              )}
            </div>
          </div>
        </div>
        
        {/* 오른쪽 사이드바 */}
        <RightSidebar 
          comment={comment}
          setComment={setComment}
          gameRef={gameRef}
          gameTree={gameRef.current?.getGameTree()}
          isCollapsed={isRightSidebarCollapsed}
          onToggle={handleRightSidebarToggle}
        />
      </div>
    </div>
  );
}
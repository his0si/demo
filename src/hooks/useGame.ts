// src/hooks/useGame.ts
import { useState, useCallback, useRef } from 'react';
import { Game } from '@/lib/game';
import { Stone, Intersection } from '@/lib/types';

export default function useGame() {
  const [comment, setComment] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [boardState, setBoardState] = useState<Intersection[][] | null>(null);
  const [blackScore, setBlackScore] = useState(0);
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackTerritory, setBlackTerritory] = useState(0);
  const [whiteTerritory, setWhiteTerritory] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<Stone>(Stone.Black);
  const [lastMove, setLastMove] = useState<{x: number, y: number} | null>(null);
  const [markers, setMarkers] = useState<{ x: number; y: number; type: string; label?: string; moveNum?: number }[]>([]);
  const gameRef = useRef<Game | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePosition, setDeletePosition] = useState<{x: number, y: number} | null>(null);
  
  // 게임 상태 변화 시 UI 업데이트
  const updateGameState = useCallback(() => {
    if (!gameRef.current) return;
    
    const game = gameRef.current;
    setBoardState([...game.intersections]);
    setBlackScore(game.getBlackScore());
    setWhiteScore(game.getWhiteScore());
    setCurrentPlayer(game.getTurn());
    
    const lastMove = game.getLastMove();
    setLastMove(lastMove ? {x: lastMove.xPos, y: lastMove.yPos} : null);
    
    const currentComment = game.getGameState()?.comment ?? '';
    console.log("🗒️ Updating comment from GameState:", currentComment);
    setComment(currentComment);
    
    // 영역 점수 계산
    const { territory: blackTerr } = game.getScoreWithTerritory(Stone.Black);
    const { territory: whiteTerr } = game.getScoreWithTerritory(Stone.White);
    setBlackTerritory(blackTerr);
    setWhiteTerritory(whiteTerr);
    
    // 게임이 끝났는지 확인
    setIsGameEnded(game.getTurn() === Stone.None);
  }, []);
  
  // 새 게임 시작
  const startGame = useCallback(() => {
    const newGame = new Game(19, 19, updateGameState);
    gameRef.current = newGame;
    setGame(newGame);
    setIsGameStarted(true);
    setIsGameEnded(false);
    setCurrentPlayer(Stone.Black);
    setBoardState([...newGame.intersections]);
    setBlackScore(0);
    setWhiteScore(0);
    setBlackTerritory(0);
    setWhiteTerritory(0);
    setLastMove(null);
  }, [updateGameState]);
  
  // SGF 로드
  const loadSGF = useCallback((sgfContent: string) => {
    if (!gameRef.current) {
      gameRef.current = new Game(19, 19, updateGameState);
    }
    const success = gameRef.current.loadSGF(sgfContent);
    if (success) {
      setGame(gameRef.current);
      setIsGameStarted(true);
      setBoardState([...gameRef.current.intersections]);
      setBlackScore(gameRef.current.getBlackScore());
      setWhiteScore(gameRef.current.getWhiteScore());
      setCurrentPlayer(gameRef.current.getTurn());
      const lastMove = gameRef.current.getLastMove();
      setLastMove(lastMove ? {x: lastMove.xPos, y: lastMove.yPos} : null);
      setMarkers(gameRef.current.markers ?? []);
      setComment(gameRef.current.getGameState()?.comment ?? '');
    }
  }, [updateGameState]);
  
  // 돌 놓기
  const makeMove = useCallback((x: number, y: number) => {
    if (!gameRef.current || isGameEnded) return false;
    
    const success = gameRef.current.makeMove(x, y);
    if (success) {
      updateGameState();
    }
    return success;
  }, [isGameEnded, updateGameState]);
  
  // 패스
  const pass = useCallback(() => {
    if (!gameRef.current || isGameEnded) return;
    
    gameRef.current.pass();
    updateGameState();
  }, [isGameEnded, updateGameState]);
  
  // 무르기
  const undo = useCallback(() => {
    if (!gameRef.current) return;
    
    gameRef.current.undo();
    updateGameState();
  }, [updateGameState]);
  
  // 앞으로 가기
  const redo = useCallback(() => {
    if (!gameRef.current) return;
    
    gameRef.current.redo();
    updateGameState();
  }, [updateGameState]);
  
  // SGF 저장
  const saveSGF = useCallback(() => {
    if (!gameRef.current) return;
    
    gameRef.current.saveSGF();
  }, []);

  // SGF 불러오기
  const importSGF = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sgf';
    
    // DOM 이벤트 핸들러 타입으로 수정
    input.onchange = function(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        const sgfContent = reader.result as string;
        loadSGF(sgfContent);
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, [loadSGF]);

  // 영역 점령
  const claimTerritory = useCallback((x: number, y: number) => {
    if (!gameRef.current || !isGameEnded) return false;
    
    const success = gameRef.current.claimTerritory(x, y);
    if (success) {
      updateGameState();
    }
    return success;
  }, [isGameEnded, updateGameState]);

  const addMarker = useCallback((x: number, y: number, type: string, label?: string) => {
    if (!gameRef.current) return;

    gameRef.current.addMarker(x, y, type, label);
    updateGameState();
  }, [updateGameState]);

  // 돌 삭제 처리
  const handleDeleteClick = useCallback((x: number, y: number) => {
    console.log('handleDeleteClick called with:', { x, y });
    if (!gameRef.current) {
      console.error('gameRef.current is null');
      return;
    }
    
    // 돌이 있는지 확인
    if (!boardState || !boardState[x] || !boardState[y] || boardState[x][y].stone === Stone.None) {
      console.error('No stone at position:', { x, y });
      return;
    }
    
    // 바로 삭제 실행
    const success = gameRef.current.deleteStone(x, y);
    if (success) {
      console.log('Stone deleted successfully');
      // 게임 상태 업데이트
      setBoardState([...gameRef.current.intersections]);
      updateGameState();
    } else {
      console.log('Failed to delete stone');
    }
  }, [boardState, updateGameState]);

  // 삭제 확인
  const confirmDelete = useCallback(() => {
    if (!deletePosition || !gameRef.current) {
      console.error('Cannot delete: deletePosition or gameRef.current is null');
      return;
    }
    
    console.log('Confirming delete at:', deletePosition);
    const success = gameRef.current.deleteStone(deletePosition.x, deletePosition.y);
    if (success) {
      console.log('Stone deleted successfully');
      setShowDeleteConfirm(false);
      setDeletePosition(null);
      updateGameState();
    } else {
      console.error('Failed to delete stone');
    }
  }, [deletePosition, updateGameState]);

  // 삭제 취소
  const cancelDelete = useCallback(() => {
    console.log('Canceling delete');
    setShowDeleteConfirm(false);
    setDeletePosition(null);
  }, []);

  return {
    game,
    isGameStarted,
    isGameEnded,
    boardState,
    blackScore,
    whiteScore,
    blackTerritory,
    whiteTerritory,
    currentPlayer,
    lastMove,
    markers,
    comment,
    makeMove,
    pass,
    undo,
    redo,
    saveSGF,
    importSGF,
    claimTerritory,
    addMarker,
    showDeleteConfirm,
    deletePosition,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    startGame,
    loadSGF
  };
}
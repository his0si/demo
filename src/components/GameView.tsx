import React from 'react';
import Board from './Board';
import useGame from '../hooks/useGame';

const GameView: React.FC = () => {
  const {
    boardState,
    makeMove,
    isGameEnded,
    showDeleteConfirm,
    deletePosition,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
  } = useGame();

  console.log('handleDeleteClick:', handleDeleteClick); // 디버깅을 위한 로그 추가

  return (
    <div>
      <Board
        size={19}
        boardState={boardState || []}
        isGameEnded={isGameEnded}
        onIntersectionClick={makeMove}
        showDeleteConfirm={showDeleteConfirm}
        deletePosition={deletePosition}
        onDeleteClick={handleDeleteClick}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
      />
    </div>
  );
};

export default GameView; 
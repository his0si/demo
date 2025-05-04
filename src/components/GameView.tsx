import React from 'react';
import Board from './Board';
import useGame from '../hooks/useGame';

const GameView: React.FC = () => {
  const {
    boardState,
    lastMoveMarkers,
    makeMove,
    handleLastMoveClick,
    isGameEnded,
  } = useGame();

  return (
    <div>
      <Board
        size={19}
        boardState={boardState || []}
        lastMoveMarkers={lastMoveMarkers}
        isGameEnded={isGameEnded}
        onIntersectionClick={makeMove}
        onLastMoveClick={handleLastMoveClick}
      />
    </div>
  );
};

export default GameView; 
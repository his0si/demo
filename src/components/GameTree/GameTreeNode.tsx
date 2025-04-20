import React from 'react';
import { Stone, GameTreeNodeProps } from '@/lib/types';

interface ExtendedGameTreeNodeProps extends GameTreeNodeProps {
  x: number;
  y: number;
}

export default function GameTreeNode({ 
  node, 
  isMainPath,
  isSelected,
  onClick,
  x,
  y
}: ExtendedGameTreeNodeProps) {
  const isBlack = node.data.move?.color === Stone.Black;
  const isRoot = node.id === 'root';
  const radius = isRoot ? 3 : 4;  // 루트 노드는 더 작게
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 루트 노드는 마름모꼴로 표시 */}
      {isRoot ? (
        <path
          d={`M 0 -${radius+1} L ${radius+1} 0 L 0 ${radius+1} L -${radius+1} 0 Z`}
          fill="#ffbf00"  // 어두운 노란색
          stroke="#00bcff" // 회색 테두리
          strokeWidth={1}
          className="transition-colors cursor-pointer"
          onClick={() => onClick(node.id)}
        />
      ) : (
        <>
          {/* 일반 노드 원 */}
          <circle
            r={radius}
            fill={isBlack ? '#000' : '#fff'}
            stroke={isMainPath ? '#00bcff' : '#9CA3AF'}
            strokeWidth={1}
            className="transition-colors cursor-pointer"
            onClick={() => onClick(node.id)}
          />
          
          {/* 선택 표시 */}
          {isSelected && (
            <circle
              r={radius + 0.5}
              fill="none"
              stroke="#00bcff"
              strokeWidth={2}
              className="pointer-events-none"
            />
          )}
          
          {/* 변화도 표시 */}
          {node.children.length > 1 && (
            <circle
                r={radius}
                fill="none"
                stroke="red"
                strokeWidth={1}
                className="pointer-events-none"
          />
          )}
        </>
      )}
    </g>
  );
}
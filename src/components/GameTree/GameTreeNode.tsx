import React from 'react';
import { GameNode, Stone } from '@/lib/types';

interface GameTreeNodeProps {
  key: string;
  node: GameNode;
  isMainPath: boolean;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
  style: {
    position: 'absolute' | 'relative' | 'fixed';
    left: number;
    top: number;
  };
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
}: GameTreeNodeProps) {
  const isBlack = node.data.move?.color === Stone.Black;
  const isRoot = node.id === 'root';  // 루트 노드 여부 확인
  const radius = 4; // 노드 크기
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 노드 원 */}
      <circle
        r={radius}
        fill={isBlack ? '#000' : '#fff'}
        stroke={isMainPath ? 'gray' : 'lightgray'}
        strokeWidth={1}
        className="transition-colors cursor-pointer"
        onClick={() => onClick(node.id)}
      />
      
      {/* 선택 표시 */}
      {isSelected && (
        <circle
          r={radius}
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

    {/* 루트 노드 표시 */} 
    {isRoot && (
        <circle
        r={radius}
        fill="yellow"
        stroke="gray"
        strokeWidth={1}
        className="transition-colors cursor-pointer"
        onClick={() => onClick(node.id)}
      />
    )}
    </g>
  );
}
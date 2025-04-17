import React from 'react';

interface GameTreeEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isMainLine: boolean;
}

export default function GameTreeEdge({ 
  x1, 
  y1, 
  x2, 
  y2, 
  isMainLine 
}: GameTreeEdgeProps) {
  const controlPointOffset = Math.abs(x2 - x1) * 0.5; // 곡선의 휘어짐 정도 조절
  
  // SVG path 문자열 생성
  const path = isMainLine
    ? `M ${x1} ${y1} L ${x2} ${y2}`  // 메인 수순은 직선
    : `M ${x1} ${y1}                  // 변화도는 베지어 곡선
       C ${x1} ${y1 + controlPointOffset},
         ${x2} ${y2 - controlPointOffset},
         ${x2} ${y2}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={isMainLine ? '#4B5563' : '#9CA3AF'}
      strokeWidth={isMainLine ? 1 : 0.5}
      className="transition-colors duration-200"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
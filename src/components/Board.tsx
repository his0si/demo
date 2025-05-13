'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Stone as StoneEnum, STONE_CLASSES } from '@/lib/types';

interface BoardProps {
  size: number;
  boardState: { xPos: number; yPos: number; stone: number }[][];
  lastMoveMarkers?: { current?: { xPos: number; yPos: number; stone: number }; next?: { xPos: number; yPos: number; stone: number } };
  isGameEnded: boolean;
  onIntersectionClick: (x: number, y: number) => void;
  markers?: { x: number; y: number; type: string; label?: string }[];
  showDeleteConfirm: boolean;
  deletePosition: { x: number; y: number } | null;
  onDeleteClick?: (x: number, y: number) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isMarkerMode?: boolean;
  onMarkerClick?: (x: number, y: number) => void;
}

export default function Board({ 
  size, 
  boardState, 
  lastMoveMarkers, 
  isGameEnded,
  onIntersectionClick,
  markers = [],
  showDeleteConfirm,
  deletePosition,
  onDeleteClick = () => {},
  onConfirmDelete,
  onCancelDelete,
  isMarkerMode = false,
  onMarkerClick = () => {}
}: BoardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 650, height: 650 });
  
  // 화면 크기에 따라 바둑판 크기 조정
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // 최대 크기 제한
        const maxSize = Math.min(
          containerRef.current.clientWidth,
          // 컨테이너 높이에서 컨트롤 버튼 등을 고려해 여유 공간 확보
          window.innerHeight - 240
        );
        
        // 최소 크기 보장
        const boardSize = Math.max(400, Math.min(maxSize, 650));
        
        setDimensions({ width: boardSize, height: boardSize });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  const stoneRadius = Math.min(dimensions.width / size, dimensions.height / size) / 2;
  
  useEffect(() => {
    if (!svgRef.current || !boardState) return;
    
    console.log('🔍 Markers received by Board:', markers);
    if (markers && markers.length > 0) {
      markers.forEach(m => {
        console.log(`🟢 Marker → x: ${m.x}, y: ${m.y}, type: ${m.type}, label: ${m.label}`);
      });
    }

    const normalizeType = (type: string): string => {
      switch (type.toLowerCase()) {
        case 'tr': return 'triangle';
        case 'sq': return 'square';
        case 'cr': return 'circle';
        case 'ma': return 'cross';
        case 'lb':
        case 'label': return 'letter';
        default: return type.toLowerCase();
      }
    };

    const svg = d3.select(svgRef.current);
    svg.attr('width', dimensions.width)
       .attr('height', dimensions.height)
       .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    
    // 기존 요소 제거
    svg.selectAll('*').remove();
    
    // 배경 추가
    svg.append('defs')
      .append('pattern')
      .attr('id', 'wood')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('image')
      .attr('xlink:href', '/images/board.png')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
      
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('fill', 'url(#wood)');
    
    // 눈금선 그리기
    const lines = svg.append('g').attr('class', 'lines');
    
    // 가로선
    for (let i = 0; i < size; i++) {
      lines.append('line')
        .attr('x1', stoneRadius)
        .attr('y1', stoneRadius + i * (dimensions.height / size))
        .attr('x2', dimensions.width - stoneRadius)
        .attr('y2', stoneRadius + i * (dimensions.height / size))
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }
    
    // 세로선
    for (let i = 0; i < size; i++) {
      lines.append('line')
        .attr('x1', stoneRadius + i * (dimensions.width / size))
        .attr('y1', stoneRadius)
        .attr('x2', stoneRadius + i * (dimensions.width / size))
        .attr('y2', dimensions.height - stoneRadius)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }
    
    // 화점(星) 그리기
    if (size === 19) {
      const dots = svg.append('g').attr('class', 'dots');
      const handicapPoints = [
        [3, 3], [9, 3], [15, 3],
        [3, 9], [9, 9], [15, 9],
        [3, 15], [9, 15], [15, 15]
      ];
      
      handicapPoints.forEach(([x, y]) => {
        dots.append('circle')
          .attr('cx', stoneRadius + x * (dimensions.width / size))
          .attr('cy', stoneRadius + y * (dimensions.height / size))
          .attr('r', stoneRadius / 6)
          .attr('fill', 'black');
      });
    }
    
    // 돌 그리기
    const stones = svg.append('g').attr('class', 'stones');
    const allIntersections = [];
    
    // 교차점 데이터 평탄화
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (boardState[x] && boardState[x][y]) {
          allIntersections.push(boardState[x][y]);
        }
      }
    }
    
    // 돌 그리기 (빈 칸이 아닌 경우)
    stones.selectAll('.stone')
      .data(allIntersections.filter(stone => stone.stone !== StoneEnum.None))
      .enter()
      .append('image')
      .attr('xlink:href', d => d.stone === StoneEnum.Black ? '/images/black_stone.svg' : '/images/white_stone.svg')
      .attr('x', d => stoneRadius + d.xPos * (dimensions.width / size) - stoneRadius)
      .attr('y', d => stoneRadius + d.yPos * (dimensions.height / size) - stoneRadius)
      .attr('width', stoneRadius * 2)
      .attr('height', stoneRadius * 2)
      .attr('class', d => `stone ${STONE_CLASSES[d.stone]}`);
    
    // 마커 그리기
    if (markers && markers.length > 0) {
      const normalizedMarkers = markers.map(m => ({ ...m, type: normalizeType(m.type) }));
      const markerGroup = svg.append('g').attr('class', 'markers');

      normalizedMarkers.forEach(marker => {
        const cx = stoneRadius + marker.x * (dimensions.width / size);
        const cy = stoneRadius + marker.y * (dimensions.height / size);

        if (marker.type === 'circle') {
          markerGroup.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', stoneRadius / 2.2)
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        } else if (marker.type === 'square') {
          markerGroup.append('rect')
            .attr('x', cx - stoneRadius / 2.2)
            .attr('y', cy - stoneRadius / 2.2)
            .attr('width', stoneRadius / 1.1)
            .attr('height', stoneRadius / 1.1)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        } else if (marker.type === 'triangle') {
          const path = d3.path();
          const r = stoneRadius / 1.6;
          path.moveTo(cx, cy - r);
          path.lineTo(cx - r * Math.sin(Math.PI / 3), cy + r / 2);
          path.lineTo(cx + r * Math.sin(Math.PI / 3), cy + r / 2);
          path.closePath();
          markerGroup.append('path')
            .attr('d', path.toString())
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        } else if (marker.type === 'cross') {
          markerGroup.append('line')
            .attr('x1', cx - stoneRadius / 2)
            .attr('y1', cy - stoneRadius / 2)
            .attr('x2', cx + stoneRadius / 2)
            .attr('y2', cy + stoneRadius / 2)
            .attr('stroke', 'yellow')
            .attr('stroke-width', 2);
          markerGroup.append('line')
            .attr('x1', cx - stoneRadius / 2)
            .attr('y1', cy + stoneRadius / 2)
            .attr('x2', cx + stoneRadius / 2)
            .attr('y2', cy - stoneRadius / 2)
            .attr('stroke', 'yellow')
            .attr('stroke-width', 2);
        } else if (marker.type === 'letter') {
          markerGroup.append('text')
            .attr('x', cx)
            .attr('y', cy + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', 18)
            .attr('fill', 'purple')
            .text(marker.label || 'A');
        } else if (marker.type === 'number') {
          markerGroup.append('text')
            .attr('x', cx)
            .attr('y', cy + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', 18)
            .attr('fill', 'purple')
            .text(marker.label || '1');
        }
      });
    }

    // 클릭 영역
    const overlay = svg.append('g').attr('class', 'overlay');
    
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        overlay.append('rect')
          .attr('x', x * (dimensions.width / size))
          .attr('y', y * (dimensions.height / size))
          .attr('width', dimensions.width / size)
          .attr('height', dimensions.height / size)
          .attr('fill', 'transparent')
          .attr('data-x', x)
          .attr('data-y', y)
          .on('click', () => {
            console.log('[Board] Overlay clicked at:', { x, y });
            if (showDeleteConfirm && deletePosition && deletePosition.x === x && deletePosition.y === y) {
              onConfirmDelete();
            } else if (isMarkerMode) {
              onMarkerClick(x, y);
            } else if (boardState[x] && boardState[x][y] && boardState[x][y].stone !== StoneEnum.None) {
              console.log('Calling onDeleteClick with:', { x, y });
              onDeleteClick(x, y);
            } else {
            onIntersectionClick(x, y);
            }
          });
      }
    }
    
    // 삭제 확인 UI
    if (showDeleteConfirm && deletePosition) {
      const { x, y } = deletePosition;
      const cx = stoneRadius + x * (dimensions.width / size);
      const cy = stoneRadius + y * (dimensions.height / size);

      // 삭제 확인 배경
      svg.append('rect')
        .attr('x', cx - stoneRadius * 2)
        .attr('y', cy - stoneRadius * 2)
        .attr('width', stoneRadius * 4)
        .attr('height', stoneRadius * 4)
        .attr('fill', 'rgba(255, 0, 0, 0.2)')
        .attr('rx', 5)
        .attr('ry', 5);

      // 삭제 확인 텍스트
      svg.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'red')
        .attr('font-weight', 'bold')
        .text('삭제?');

      // 취소 버튼
      svg.append('rect')
        .attr('x', cx - stoneRadius * 1.5)
        .attr('y', cy + stoneRadius)
        .attr('width', stoneRadius * 3)
        .attr('height', stoneRadius)
        .attr('fill', 'white')
        .attr('stroke', 'red')
        .attr('rx', 3)
        .attr('ry', 3)
        .on('click', onCancelDelete);

      svg.append('text')
        .attr('x', cx)
        .attr('y', cy + stoneRadius * 1.5)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'red')
        .text('취소')
        .on('click', onCancelDelete);
    }
    
    // 마지막 수 표시
    if (lastMoveMarkers?.current) {
      const { xPos, yPos, stone } = lastMoveMarkers.current;
      const strokeColor = stone === StoneEnum.Black ? 'white' : 'black';

      svg.append('circle')
        .attr('cx', stoneRadius + xPos * (dimensions.width / size))
        .attr('cy', stoneRadius + yPos * (dimensions.height / size))
        .attr('r', stoneRadius / 2.5)
        .attr('class', 'last-move-current')
        .attr('fill', strokeColor)
        .attr('fill-opacity', 0.5)
        .attr('pointer-events', 'none');
    }

    if (lastMoveMarkers?.next) {
      const { xPos, yPos, stone } = lastMoveMarkers.next;
      const strokeColor = stone === StoneEnum.Black ? 'white' : 'black';

      svg.append('circle')
        .attr('cx', stoneRadius + xPos * (dimensions.width / size))
        .attr('cy', stoneRadius + yPos * (dimensions.height / size))
        .attr('r', stoneRadius / 2.5)
        .attr('class', 'last-move-next')
        .attr('fill', strokeColor)
        .attr('fill-opacity', 0.9)
        .attr('pointer-events', 'none');
    }
    
    // 게임이 끝났을 때 영역 표시
    if (isGameEnded) {
      // (간소화 버전에서는 생략)
    }
    
  }, [boardState, size, lastMoveMarkers, isGameEnded, stoneRadius, dimensions, onIntersectionClick, markers, showDeleteConfirm, deletePosition, onDeleteClick, onConfirmDelete, onCancelDelete, isMarkerMode, onMarkerClick]);
  
  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="mx-auto border rounded shadow-md"
      />
    </div>
  );
}
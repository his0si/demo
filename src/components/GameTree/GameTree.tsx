import React, { type ReactElement } from 'react';
import { GameNode, type GameTree } from '@/lib/types';
import GameTreeNode from './GameTreeNode';
import { calculateTreeLayout } from '@/lib/treeLayout';

interface GameTreeProps {
  gameTree: GameTree;
  onNodeClick: (nodeId: string) => void;
}

export default function GameTree({ gameTree, onNodeClick }: GameTreeProps) {
  const GRID_SIZE = 20; // 노드 간 간격
  const layout = calculateTreeLayout(gameTree);

  // 노드 찾기 함수 추가
  const findNodeById = (nodeId: string): GameNode | null => {
    const traverse = (node: GameNode): GameNode | null => {
      if (node.id === nodeId) return node;
      for (const child of node.children) {
        const found = traverse(child);
        if (found) return found;
      }
      return null;
    };
    return traverse(gameTree.root);
  };

  const renderEdges = () => {
    const edges: ReactElement[] = [];
    
    function addEdge(from: GameNode, to: GameNode) {
      const fromPos = layout.positions.get(from.id)!;
      const toPos = layout.positions.get(to.id)!;
      
      // 시작점과 끝점
      const x1 = fromPos.x * GRID_SIZE;
      const y1 = fromPos.y * GRID_SIZE;
      const x2 = toPos.x * GRID_SIZE;
      const y2 = toPos.y * GRID_SIZE;
      
      // 제어점 계산 (곡선의 모양을 결정)
      const midY = (y1 + y2) / 2;
      const isMainLine = x1 === x2; // 메인 수순인지 확인
      
      let path;
      if (isMainLine) {
        // 메인 수순은 직선으로
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else {
        // 변화도는 부드러운 곡선으로
        path = `M ${x1} ${y1} 
                C ${x1} ${midY},
                  ${x2} ${midY},
                  ${x2} ${y2}`;
      }
      
      edges.push(
        <path
          key={`${from.id}-${to.id}`}
          d={path}
          fill="none"
          stroke={gameTree.mainPath.has(to.id) ? '#4B5563' : '#9CA3AF'}
          strokeWidth="1"
        />
      );
    }

    // 모든 노드에 대해 자식 노드로의 연결선 추가
    function traverse(node: GameNode) {
      node.children.forEach(child => {
        addEdge(node, child);
        traverse(child);
      });
    }

    traverse(gameTree.root);
    return edges;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2 min-w-[150px]">
        <svg 
          width={layout.width * GRID_SIZE} 
          height={layout.height * GRID_SIZE}
          className="overflow-visible"
        >
          {/* 연결선 먼저 렌더링 */}
          <g className="connections">
            {renderEdges()}
          </g>
          
          {/* 노드 렌더링 */}
          <g className="nodes">
            {Array.from(layout.positions.entries()).map(([id, pos]) => {
              const node = findNodeById(id);
              if (!node) return null;
              
                return (
                <GameTreeNode
                  key={id}
                  node={node}
                  isMainPath={gameTree.mainPath.has(id)}
                  isSelected={id === gameTree.currentNodeId}
                  onClick={onNodeClick}
                  x={pos.x * GRID_SIZE}
                  y={pos.y * GRID_SIZE}
                  style={{
                  position: 'absolute',
                  left: pos.x * GRID_SIZE,
                  top: pos.y * GRID_SIZE
                  }}
                />
                );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
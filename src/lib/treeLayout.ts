import { GameNode, GameTree } from './types';

export interface NodePosition {
  x: number;
  y: number;
}

export interface TreeLayout {
  positions: Map<string, NodePosition>;
  width: number;
  height: number;
}

export interface LayoutOptions {
  maxDepth?: number;      // 최대 깊이 제한
  nodePadding?: number;   // 노드 간 여백
}

export function calculateTreeLayout(
  tree: GameTree, 
  options: LayoutOptions = {}
): TreeLayout {
  // 빈 트리 체크
  if (!tree || !tree.root) {
    return {
      positions: new Map(),
      width: 0,
      height: 0
    };
  }

  const {
    maxDepth = 100,        // 기본 최대 깊이
    nodePadding = 1        // 기본 여백
  } = options;

  const positions = new Map<string, NodePosition>();
  const levelWidths = new Map<number, number>();  // 각 레벨의 너비 추적
  const levelCurrentX = new Map<number, number>(); // 각 레벨의 현재 x 위치
  let maxX = 0;
  let maxY = 0;

  function traverseTree(node: GameNode, x: number, y: number): void {
    // 최대 깊이 제한 확인
    if (y > maxDepth) return;

    // 현재 레벨의 너비 업데이트
    const currentWidth = levelWidths.get(y) || 0;
    levelWidths.set(y, Math.max(currentWidth, x + 1));

    // 노드 위치 저장
    positions.set(node.id, { x, y });
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    if (node.children.length > 0) {
      // 메인 수순 처리 (첫 번째 자식)
      traverseTree(node.children[0], x, y + 1);

      // 변화도 처리 (나머지 자식들)
      if (node.children.length > 1) {
        let currentLevelX = levelCurrentX.get(y + 1) || maxX + 1;

        // 변화도 노드들을 간격을 두고 배치
        for (let i = 1; i < node.children.length; i++) {
          currentLevelX += nodePadding;
          traverseTree(node.children[i], currentLevelX, y + 1);
        }

        levelCurrentX.set(y + 1, currentLevelX);
      }
    }
  }

  traverseTree(tree.root, 0, 0);

  return {
    positions,
    width: maxX + 1,
    height: Math.min(maxY + 1, maxDepth)
  };
}
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

export function calculateTreeLayout(tree: GameTree): TreeLayout {
  const positions = new Map<string, NodePosition>();
  const levelWidths = new Map<number, number>();  // 각 레벨의 너비를 추적
  let maxX = 0;
  let maxY = 0;

  // 각 레벨의 현재 x 위치를 추적
  const levelCurrentX = new Map<number, number>();

  function traverseTree(node: GameNode, x: number, y: number): void {
    // 현재 레벨의 너비 업데이트
    const currentWidth = levelWidths.get(y) || 0;
    levelWidths.set(y, Math.max(currentWidth, x + 1));

    // 노드 위치 저장
    positions.set(node.id, { x, y });
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    if (node.children.length > 0) {
      // 메인 수순 처리 (첫 번째 자식)
      const firstChild = node.children[0];
      traverseTree(firstChild, x, y + 1);

      // 변화도 처리 (나머지 자식들)
      if (node.children.length > 1) {
        // 현재 레벨의 x 위치 가져오기
        let currentLevelX = levelCurrentX.get(y + 1) || maxX + 1;

        // 변화도들을 오른쪽에 배치
        for (let i = 1; i < node.children.length; i++) {
          currentLevelX += 1; // 간격 추가
          traverseTree(node.children[i], currentLevelX, y + 1);
        }

        // 현재 레벨의 x 위치 업데이트
        levelCurrentX.set(y + 1, currentLevelX);
      }
    }
  }

  // 루트부터 시작
  traverseTree(tree.root, 0, 0);

  return {
    positions,
    width: maxX + 1,
    height: maxY + 1
  };
}
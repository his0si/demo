import { Stone, PatternDescription } from './types';

// 패턴 인식 함수들
function isPass(signMap: number[][], sign: number, x: number, y: number): boolean {
  return x === -1 && y === -1;
}

function isCapture(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const tempMap = signMap.map(row => [...row]);
  tempMap[x][y] = sign;
  const capturedGroups = getCapturedGroups(tempMap, sign === 1 ? 2 : 1);
  return capturedGroups.length > 0;
}

function isAtari(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const tempMap = signMap.map(row => [...row]);
  tempMap[x][y] = sign;
  const otherSign = sign === 1 ? 2 : 1;
  const groups = findGroups(tempMap, otherSign);
  return groups.some(group => countLiberties(tempMap, group) === 1);
}

function isSuicide(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const tempMap = signMap.map(row => [...row]);
  tempMap[x][y] = sign;
  const group = findGroup(tempMap, x, y);
  return group !== null && !hasLiberty(tempMap, group);
}

function isFill(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const tempMap = signMap.map(row => [...row]);
  tempMap[x][y] = sign;
  const group = findGroup(tempMap, x, y);
  return group !== null && countLiberties(tempMap, group) === 1;
}

function isConnect(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const tempMap = signMap.map(row => [...row]);
  tempMap[x][y] = sign;
  const group = findGroup(tempMap, x, y);
  return group !== null && group.length > 1;
}

function isTengen(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  return x === Math.floor(size / 2) && y === Math.floor(size / 2);
}

function isStar(signMap: number[][], sign: number, x: number, y: number): boolean {
  const size = signMap.length;
  const starPoints = [
    [3, 3], [3, size - 4], [size - 4, 3], [size - 4, size - 4],
    [Math.floor(size / 2), Math.floor(size / 2)]
  ];
  return starPoints.some(([sx, sy]) => sx === x && sy === y);
}

// 유틸리티 함수들
function findGroup(signMap: number[][], x: number, y: number): { x: number; y: number }[] | null {
  const size = signMap.length;
  if (x < 0 || x >= size || y < 0 || y >= size) return null;
  
  const sign = signMap[x][y];
  if (sign === 0) return null;
  
  const visited = new Set<string>();
  const group: { x: number; y: number }[] = [];
  
  function dfs(i: number, j: number) {
    const key = `${i},${j}`;
    if (visited.has(key)) return;
    if (i < 0 || i >= size || j < 0 || j >= size) return;
    if (signMap[i][j] !== sign) return;
    
    visited.add(key);
    group.push({ x: i, y: j });
    
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }
  
  dfs(x, y);
  return group;
}

function hasLiberty(signMap: number[][], group: { x: number; y: number }[]): boolean {
  const size = signMap.length;
  const visited = new Set<string>();
  
  for (const stone of group) {
    const { x, y } = stone;
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      if (signMap[nx][ny] === 0) return true;
    }
  }
  
  return false;
}

function countLiberties(signMap: number[][], group: { x: number; y: number }[]): number {
  const size = signMap.length;
  const liberties = new Set<string>();
  
  for (const stone of group) {
    const { x, y } = stone;
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      if (signMap[nx][ny] === 0) {
        liberties.add(`${nx},${ny}`);
      }
    }
  }
  
  return liberties.size;
}

function findGroups(signMap: number[][], sign: number): { x: number; y: number }[][] {
  const size = signMap.length;
  const visited = new Set<string>();
  const groups: { x: number; y: number }[][] = [];
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (signMap[i][j] === sign && !visited.has(`${i},${j}`)) {
        const group = findGroup(signMap, i, j);
        if (group) {
          groups.push(group);
          group.forEach(stone => visited.add(`${stone.x},${stone.y}`));
        }
      }
    }
  }
  
  return groups;
}

function getCapturedGroups(signMap: number[][], sign: number): { x: number; y: number }[][] {
  const groups = findGroups(signMap, sign);
  return groups.filter(group => !hasLiberty(signMap, group));
}

// 패턴 인식 함수
export function recognizePattern(signMap: number[][], sign: number, x: number, y: number): PatternDescription | null {
  if (isPass(signMap, sign, x, y)) {
    return {
      description: "패스",
      url: "https://senseis.xmp.net/?Pass"
    };
  }
  
  if (isCapture(signMap, sign, x, y)) {
    return {
      description: "따내기",
      url: "https://senseis.xmp.net/?Capture"
    };
  }
  
  if (isAtari(signMap, sign, x, y)) {
    return {
      description: "아타리",
      url: "https://senseis.xmp.net/?Atari"
    };
  }
  
  if (isSuicide(signMap, sign, x, y)) {
    return {
      description: "자살",
      url: "https://senseis.xmp.net/?Suicide"
    };
  }
  
  if (isFill(signMap, sign, x, y)) {
    return {
      description: "메우기",
      url: "https://senseis.xmp.net/?Fill"
    };
  }
  
  if (isConnect(signMap, sign, x, y)) {
    return {
      description: "연결",
      url: "https://senseis.xmp.net/?Connection"
    };
  }
  
  if (isTengen(signMap, sign, x, y)) {
    return {
      description: "천원",
      url: "https://senseis.xmp.net/?Tengen"
    };
  }
  
  if (isStar(signMap, sign, x, y)) {
    return {
      description: "성",
      url: "https://senseis.xmp.net/?StarPoint"
    };
  }
  
  return null;
} 
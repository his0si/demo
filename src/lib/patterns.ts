import { Stone, PatternDescription } from './types';
import boardmatcher from '@sabaki/boardmatcher';

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
export async function recognizePattern(signMap: number[][], sign: number, x: number, y: number): Promise<PatternDescription | null> {
  try {
    console.log('패턴 인식 시작:', { x, y, sign });
    console.log('입력된 바둑판 상태:', signMap);

    // 1이 흑, -1이 백을 의미하므로 변환
    const board = signMap.map(row => 
      row.map(cell => {
        switch (cell) {
          case 1: return 1;  // 흑
          case 2: return -1; // 백
          default: return 0; // 빈 곳
        }
      })
    );

    console.log('변환된 바둑판 상태:', board);

    // 현재 수의 색상 변환
    const color = sign === 1 ? 1 : -1;
    console.log('현재 수의 색상:', color);

    // 패턴 찾기
    const patternMatch = boardmatcher.findPatternInMove(
      board,
      color,
      [x, y]
    );

    console.log('패턴 매칭 결과:', patternMatch);

    if (!patternMatch) {
      console.log('패턴이 인식되지 않음');
      return null;
    }

    const { pattern, match } = patternMatch;
    console.log('인식된 패턴:', pattern);
    console.log('매칭된 위치:', match);

    // 패턴 설명 생성
    const description = getPatternDescription(pattern.name);
    // boardmatcher가 제공하는 URL 사용
    const url = pattern.url;

    console.log('최종 패턴 정보:', { description, url });

    return {
      description,
      url
    };
  } catch (error) {
    console.error('패턴 인식 중 오류 발생:', error);
    return null;
  }
}

// 패턴 설명 가져오기
function getPatternDescription(patternName: string): string {
  const descriptions: { [key: string]: string } = {
    'hane': '한수',
    'cut': '끊기',
    'connect': '연결',
    'tiger-mouth': '호랑이입',
    'empty-triangle': '빈삼각',
    'bamboo-joint': '대마목',
    'knight-move': '날일자',
    'large-knight-move': '큰날일자',
    'diagonal': '대각선',
    'one-point-jump': '한칸뛰기',
    'two-point-jump': '두칸뛰기',
    'shoulder-hit': '어깨짚기',
    'attachment': '붙임',
    'block': '막기',
    'extend': '늘리기',
    'push': '밀기',
    'peep': '엿보기',
    'wedge': '쐐기',
    'cross-cut': '십자끊기',
    'cross-connect': '십자연결',
    'cross': '십자',
    'star-point': '성',
    'tengen': '천원',
    'pass': '패스'
  };

  return descriptions[patternName] || patternName;
}

// 패턴 URL 가져오기
function getPatternUrl(patternName: string): string {
  const baseUrl = 'https://senseis.xmp.net/?';
  const urlMap: { [key: string]: string } = {
    'hane': 'Hane',
    'cut': 'Cut',
    'connect': 'Connection',
    'tiger-mouth': 'TigerMouth',
    'empty-triangle': 'EmptyTriangle',
    'bamboo-joint': 'BambooJoint',
    'knight-move': 'KnightMove',
    'large-knight-move': 'LargeKnightMove',
    'diagonal': 'Diagonal',
    'one-point-jump': 'OnePointJump',
    'two-point-jump': 'TwoPointJump',
    'shoulder-hit': 'ShoulderHit',
    'attachment': 'Attachment',
    'block': 'Block',
    'extend': 'Extend',
    'push': 'Push',
    'peep': 'Peep',
    'wedge': 'Wedge',
    'cross-cut': 'CrossCut',
    'cross-connect': 'CrossConnect',
    'cross': 'Cross',
    'star-point': 'StarPoint',
    'tengen': 'Tengen',
    'pass': 'Pass'
  };

  return baseUrl + (urlMap[patternName] || patternName);
} 
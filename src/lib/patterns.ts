import { PatternDescription } from './types';
import boardmatcher from '@sabaki/boardmatcher';

// 패턴 인식 함수
export async function recognizePattern(signMap: number[][], sign: number, x: number, y: number): Promise<PatternDescription | null> {
  try {
    console.log('패턴 인식 시작:', { x, y, sign });
    
    const moveCoord: [number, number] = [y, x];
    
    const transposedBoard = signMap[0].map((_, colIndex) =>
      signMap.map(row => row[colIndex])
    );
    
    const board = transposedBoard.map(row => 
      row.map(cell => {
        switch (cell) {
          case 1: return 1;   // 흑
          case 2: return -1;  // 백
          default: return 0;  // 빈 곳
        }
      })
    );

    const color = sign === 1 ? 1 : -1;

    const patternMatch = boardmatcher.findPatternInMove(
      board,
      color,
      moveCoord
    );

    if (!patternMatch) {
      console.log('패턴이 인식되지 않음');
      return null;
    }

    const { pattern, match } = patternMatch;
    console.log('인식된 패턴:', pattern);
    console.log('매칭된 위치:', match);

    const description = getPatternDescription(pattern.name);
    
    return {
      description,
      url: pattern.url 
    };
  } catch (error) {
    console.error('패턴 인식 중 오류 발생:', error);
    return null;
  }
}

// 패턴 설명 가져오기
function getPatternDescription(patternName: string): string {
  const descriptions: { [key: string]: string } = {
    "Tiger’s Mouth": '호구',
    'Hane': '젖힘',
    'Double hane': '이단젖힘',
    'Atari': '단수',
    'Cut': '끊음',
    'Connect': '연결',
    'Empty Triangle': '빈삼각',
    'Bamboo Joint': '대마목',
    'Small Knight': '날일자',
    "Knight's Move": '날일자',
    'Large knight' : '눈목자',
    "Large knight's move" : '눈목자',
    'Diagonal': '마늘모',
    'One-Point Jump': '한칸뛰기',
    'Two-Point Jump': '두칸뛰기',
    'Shoulder Hit': '어깨짚기',
    'Attachment': '붙임',
    'Block': '막음',
    'Extension': '벌림',
    'Push': '밀기',
    'Crawl': '기다',
    'Peep': '들여다봄',
    'Wedge': '갈라치기',
    'Reduction': '삭감',
    'Cross-Cut': '십자끊기',
    'Cross': '십자',
    'Star Point': '화점',
    'Tengen': '천원',
    'Pass': '패스',
    'Descend': '내려섬',
    'Stretch' : '뻗음',
    'Extend' : '뻗음',
    'Diagonal jump' : '밭전자',
    'Hoshi' : '화점',
    'Corner openings' : '귀의 착점',
    'Standard local play' : '정석',
    'Compensation' : '덤',
    'Repetitive capture' : '패',
    'Ladder' : '축',
    'Net' : '장문',
    'Capturing race' : '수상전',
    'Diamond' : '빵때림',
    'Enclosure' : '굳힘',
    'Approach' : '걸침',
    'Pincer' : '협공',
    'Bamboo joint' : '쌍립',
    'Bridge under' : '넘기',
    'Push through' : '가르기',
    'Splitting' : '끼움',
  };

  // 패턴 이름 매칭 전에 공백 제거 및 소문자로 변환하여 비교
  const normalizedName = patternName.toLowerCase().replace(/[\s'-]/g, '');
  const normalizedDescriptions = Object.entries(descriptions).reduce((acc, [key, value]) => {
    acc[key.toLowerCase().replace(/[\s'-]/g, '')] = value;
    return acc;
  }, {} as { [key: string]: string });

  return normalizedDescriptions[normalizedName] || patternName;
}
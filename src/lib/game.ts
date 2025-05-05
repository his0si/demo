// src/lib/game.ts
import { 
  Stone, 
  Intersection, 
  GameState, 
  Territory, 
  Hashable,
  Pointer,
  GameTree,
  GameNode
} from './types';

/**
 * HashSet 클래스 구현
 * 같은 위치의 교차점을 중복 없이 저장하기 위해 사용
 */
export class HashSet<T extends Hashable> {
  private hashSet: Map<string, T> = new Map();

  constructor(...items: T[]) {
    for(const item of items) {
      this.insert(item);
    }
  }

  public includes(item: T | null): boolean {
    return item ? this.hashSet.has(item.hashKey()) : false;
  }

  public insert(item: T | null) {
    if(item) {
      this.hashSet.set(item.hashKey(), item);
    }
  }

  public values(): T[] {
    return Array.from(this.hashSet.values());
  }
}

/**
 * 바둑판의 교차점 구현
 */
export class IntersectionImpl implements Intersection, Hashable {
  xPos: number;
  yPos: number;
  stone: Stone;
  
  constructor(x: number, y: number, s: Stone = Stone.None) {
    this.xPos = x;
    this.yPos = y;
    this.stone = s;
  }
  
  public hashKey(): string {
    return `(${this.xPos},${this.yPos})`;
  }

  public copy(): Intersection {
    return new IntersectionImpl(this.xPos, this.yPos, this.stone);
  }
}

/**
 * 영역 클래스 구현
 */
export class TerritoryImpl implements Territory {
  region: Intersection[];
  owner: Stone;
  score: number = 0;

  constructor(owner: Stone, region?: Intersection[]) {
    this.owner = owner;
    this.region = region || [];

    if (region) {
      this.score = region.reduce((total, int) => 
        total + (int.stone === Stone.None ? 1 : 2), 0
      );
    }
  }

  public merge(territory: Territory): Territory {
    const merged = new TerritoryImpl(Stone.None);

    if(this.owner === Stone.None) {
      merged.owner = territory.owner;
    }
    else if(territory.owner === Stone.None) {
      merged.owner = this.owner;
    }
    else if(this.owner !== territory.owner) {
      merged.owner = Stone.Unknown;
    }
    else {
      merged.owner = this.owner;
    }

    merged.region = [...this.region, ...territory.region];
    merged.score = this.score + territory.score;

    return merged;
  }
}

/**
 * 게임 상태 클래스 구현
 */
export class GameStateImpl implements GameState {
  intersections: Intersection[][];
  turn: Stone;
  moveNum: number = 0;
  prevGameState: GameState | null;
  nextGameState: GameState | null = null;
  blackScore: number = 0;
  whiteScore: number = 0;
  isPass: boolean = false;
  move: Intersection | null = null;
  public comment: string = '';

  constructor(
    ints: Intersection[][], 
    t: Stone, 
    bScore: number = 0, 
    wScore: number = 0, 
    prev: GameState | null = null,
    public markers: { x: number; y: number; type: string; label?: string; moveNum?: number }[] = [],
    comment: string = ''
  ) {
    this.turn = t;
    this.prevGameState = prev;
    this.intersections = ints;
    this.blackScore = bScore;
    this.whiteScore = wScore;
    this.comment = comment;

    if(prev === null) {
      this.moveNum = 0;
    }
    else {
      this.moveNum = prev.moveNum + 1;
      prev.nextGameState = this;
    }
  }

  public toString(): string {
    const transpose = (array: Intersection[][]): Intersection[][] =>
      array[0].map((_, i) => array.map(row => row[i]));

    const transposed = transpose(this.intersections);
    
    return transposed.map(col => {
      return col.map(i => {
        if(i.stone === Stone.Black) {
          return 'b';
        }
        else if(i.stone === Stone.White) {
          return 'w';
        }
        else {
          return '-'
        }
      }).join(' ');
    }).join('\n');
  }

  public getState(moveNum: number): GameState | null {
    let state = this as GameState;
    
    while(state.moveNum > moveNum) {
      if (!state?.prevGameState) return null;
      state = state.prevGameState;
    }

    return state;
  }
}

/**
 * 게임 클래스 구현
 * 핵심 바둑 게임 로직을 포함
 */
export class Game {
  public intersections: Intersection[][];
  public markers: { x: number; y: number; type: string; label?: string; moveNum?: number }[] = [];
  private gameState: GameState | null = null;
  private lastMove: Intersection | null = null;
  private xLines: number = 19;
  private yLines: number = 19;
  private turn: Stone = Stone.Black;
  private blackScore: number = 0;
  private whiteScore: number = 0;
  private claimedTerritories: Territory[] = [];
  private claimedTerritoryLookup: HashSet<Intersection> = new HashSet();
  private stateChangeCallback: (() => void) | null = null;
  private gameTree: GameTree;
  private nodeMap: Map<string, GameNode> = new Map();
  private currentNode: GameNode;
  constructor(
    xLines: number = 19, 
    yLines: number = 19,
    onStateChange: (() => void) | null = null
  ) {
    this.xLines = xLines;
    this.yLines = yLines;
    this.stateChangeCallback = onStateChange;
    
    this.intersections = Game.initIntersections(xLines, yLines);
    this.gameState = this.newGameState();
    const rootNode: GameNode = {
      id: 'root',
      parentId: null,
      children: [],
      data: {
        move: { x: -1, y: -1, color: Stone.Black }
      }
    };

    // 루트 노드를 Map에 추가
    this.nodeMap.set(rootNode.id, rootNode);

    this.gameTree = {
      root: rootNode,
      currentNodeId: 'root',
      mainPath: new Set(['root']),
      get: (id: string): GameNode => {
        const node = this.nodeMap.get(id);
        if (node) return node;

        const traverse = (node: GameNode): GameNode | null => {
          if (node.id === id) return node;
          for (const child of node.children) {
            const found = traverse(child);
            if (found) return found;
          }
          return null;
        };

        const result = traverse(this.gameTree.root);
        if (!result) {
          throw new Error(`Node with id ${id} not found`);
        }

        this.nodeMap.set(id, result);
        return result;
      }
    };

    this.currentNode = rootNode;
  }

  /**
   * 바둑판 초기화
   */
  static initIntersections(xLines: number = 19, yLines: number = 19): Intersection[][] {
    const ints = new Array(xLines);
    for(let x = 0; x < xLines; x++) {
      ints[x] = new Array(yLines);

      for(let y = 0; y < yLines; y++) {
        ints[x][y] = new IntersectionImpl(x, y);
      }
    }

    return ints;
  }

  /**
   * SGF 파일 로드
   */
  public loadSGF(sgfContent: string): boolean {
    sgfContent = sgfContent.trim();
    
    // 헤더 정보 파싱
    const headerMatch = sgfContent.match(/\(;(.*?)(;|$)/);
    if (headerMatch) {
      const header = headerMatch[1];
      // 보드 크기 파싱
      const sizeMatch = header.match(/SZ\[(\d+)\]/);
    if (sizeMatch) {
      const size = parseInt(sizeMatch[1]);
        this.xLines = size;
        this.yLines = size;
        this.intersections = Game.initIntersections(size, size);
      }
    }

    // 게임 상태 초기화
    this.gameState = null;
    this.lastMove = null;
    this.turn = Stone.Black;
    this.blackScore = 0;
    this.whiteScore = 0;
    this.markers = [];
    this.claimedTerritories = [];
    this.claimedTerritoryLookup = new HashSet();

    // 루트 노드 초기화
    const rootNode: GameNode = {
      id: 'root',
      parentId: null,
      children: [],
      data: {
        move: { x: -1, y: -1, color: Stone.Black },
        markers: [],
        comment: ''
      }
    };
    this.nodeMap.clear(); // 기존 노드 맵 초기화
    this.nodeMap.set(rootNode.id, rootNode);
    this.gameTree = {
      root: rootNode,
      currentNodeId: 'root',
      mainPath: new Set(['root']),
      get: (id: string) => this.findNodeById(id) || rootNode
    };

    // 노드 데이터 파싱 함수
    const parseNodeContent = (content: string): {
      move?: { x: number; y: number; color: Stone };
      markers: { x: number; y: number; type: string; label?: string }[];
      comment: string;
    } => {
      const moveMatch = content.match(/(B|W)\[([a-z]{2})\]/);
      
      // 코멘트 파싱 개선
      let comment = '';
      const commentRegex = /C\[((?:[^[\]]|\\\])*?)\]/;
      const commentMatch = content.match(commentRegex);
      if (commentMatch) {
        comment = commentMatch[1].replace(/\\]/g, ']');
        console.log('Parsed comment:', comment); // 디버깅용 로그 추가
      }

      const markers: { x: number; y: number; type: string; label?: string }[] = [];

      // 일반 마커 파싱 (LB 제외)
      const markerRegex = /(TR|SQ|CR|MA)\[([a-z]{2})\]/g;
      let markerMatch;
      while ((markerMatch = markerRegex.exec(content)) !== null) {
        const [, type, pos] = markerMatch;
        const x = pos.charCodeAt(0) - 97;
        const y = pos.charCodeAt(1) - 97;
        
        const markerType = {
          TR: 'triangle',
          SQ: 'square',
          CR: 'circle',
          MA: 'cross'
        }[type] || type.toLowerCase();

        markers.push({ x, y, type: markerType });
      }

      // LB 마커 파싱 (라벨 포함)
      const lbRegex = /LB(?:\[([a-z]{2}):([^\]]+)\])+/g;
      let lbMatch;
      while ((lbMatch = lbRegex.exec(content)) !== null) {
        const fullMatch = lbMatch[0];
        const lbMarkers = fullMatch.match(/\[([a-z]{2}):([^\]]+)\]/g);
        if (lbMarkers) {
          for (const marker of lbMarkers) {
            const [, pos, label] = marker.match(/\[([a-z]{2}):([^\]]+)\]/) || [];
            if (pos) {
              const x = pos.charCodeAt(0) - 97;
              const y = pos.charCodeAt(1) - 97;
              markers.push({ x, y, type: 'letter', label });
            }
          }
        }
      }

      // 다중 마커 파싱 (LB 제외)
      const multiMarkerRegex = /(TR|SQ|CR|MA)\[([a-z]{2})\](?:\[([a-z]{2})\])*/g;
      let multiMatch;
      while ((multiMatch = multiMarkerRegex.exec(content)) !== null) {
        const type = multiMatch[1];
        const markerType = {
          TR: 'triangle',
          SQ: 'square',
          CR: 'circle',
          MA: 'cross'
        }[type] || type.toLowerCase();

        // 첫 번째 마커는 이미 처리되었으므로 건너뜀
        for (let i = 3; i < multiMatch.length; i++) {
          if (multiMatch[i]) {
            const pos = multiMatch[i];
            const x = pos.charCodeAt(0) - 97;
            const y = pos.charCodeAt(1) - 97;
            markers.push({ x, y, type: markerType });
          }
        }
      }

      return {
        move: moveMatch ? {
          x: moveMatch[2].charCodeAt(0) - 97,
          y: moveMatch[2].charCodeAt(1) - 97,
          color: moveMatch[1] === 'B' ? Stone.Black : Stone.White
        } : undefined,
        markers,
        comment
      };
    };

    // SGF 문자열 파싱을 위한 재귀 함수
    const parseSGF = (content: string, parentNode: GameNode): void => {
      let currentNode = parentNode;
      let buffer = '';
      let i = 0;

      while (i < content.length) {
        const char = content[i];

        if (char === '(') {
          // 새로운 분기 시작
          if (buffer.trim()) {
            // 버퍼에 있는 내용으로 노드 생성
            const nodeData = parseNodeContent(buffer);
            if (nodeData.move || nodeData.markers.length > 0 || nodeData.comment) {
              const newNode: GameNode = {
                id: Math.random().toString(36).slice(2),
                parentId: currentNode.id,
                children: [],
                data: {
                  move: nodeData.move || { x: -1, y: -1, color: Stone.Black },
                  markers: nodeData.markers,
                  comment: nodeData.comment
                }
              };
              currentNode.children.push(newNode);
              this.nodeMap.set(newNode.id, newNode);
              currentNode = newNode;
            }
            buffer = '';
          }

          // 분기 내용 파싱
          const branchEnd = findMatchingParenthesis(content, i);
          if (branchEnd === -1) break;

          const branchContent = content.slice(i + 1, branchEnd);
          parseSGF(branchContent, currentNode);
          i = branchEnd + 1;
        } else if (char === ';') {
          // 이전 노드 처리
          if (buffer.trim()) {
            const nodeData = parseNodeContent(buffer);
            if (nodeData.move || nodeData.markers.length > 0 || nodeData.comment) {
              const newNode: GameNode = {
                id: Math.random().toString(36).slice(2),
                parentId: currentNode.id,
                children: [],
                data: {
                  move: nodeData.move || { x: -1, y: -1, color: Stone.Black },
                  markers: nodeData.markers,
                  comment: nodeData.comment
                }
              };
              currentNode.children.push(newNode);
              this.nodeMap.set(newNode.id, newNode);
              currentNode = newNode;
            }
            buffer = '';
          }
          i++;
        } else {
          buffer += char;
          i++;
        }
      }

      // 마지막 버퍼 처리
      if (buffer.trim()) {
        const nodeData = parseNodeContent(buffer);
        if (nodeData.move || nodeData.markers.length > 0 || nodeData.comment) {
          const newNode: GameNode = {
            id: Math.random().toString(36).slice(2),
            parentId: currentNode.id,
            children: [],
            data: {
              move: nodeData.move || { x: -1, y: -1, color: Stone.Black },
              markers: nodeData.markers,
              comment: nodeData.comment
            }
          };
          currentNode.children.push(newNode);
          this.nodeMap.set(newNode.id, newNode);
        }
      }
    };

    // 괄호 매칭을 찾는 헬퍼 함수
    const findMatchingParenthesis = (str: string, start: number): number => {
      let count = 1;
      for (let i = start + 1; i < str.length; i++) {
        if (str[i] === '(') count++;
        if (str[i] === ')') count--;
        if (count === 0) return i;
      }
      return -1;
    };

    // SGF 파싱 시작
    const mainContent = sgfContent.slice(sgfContent.indexOf(';'));
    parseSGF(mainContent, rootNode);

    // 메인 패스 설정
    this.updateMainPath();
    
    // 현재 노드를 마지막 노드로 설정
    let lastNode = rootNode;
    while (lastNode.children.length > 0) {
      lastNode = lastNode.children[0];
    }
    this.currentNode = lastNode;
    this.gameTree.currentNodeId = lastNode.id;
    
    // navigateToNode를 사용하여 게임트리 상태 즉시 업데이트
    this.navigateToNode(lastNode.id);
    
    return true;
  }

  /**
   * 새 노드 생성
   */
  private createNode(
    parentNode: GameNode,
    color: Stone,
    x: number,
    y: number,
    markers: { x: number; y: number; type: string; label?: string }[],
    comment: string
  ): GameNode {
    const newNode: GameNode = {
      id: Math.random().toString(36).slice(2),
      parentId: parentNode.id,
      children: [],
      data: {
        move: { x, y, color },
        markers: [...markers],
        comment
      }
    };
    
    parentNode.children.push(newNode);
    this.nodeMap.set(newNode.id, newNode);
    
    return newNode;
  }

  /**
   * 메인 패스 업데이트
   */
  private updateMainPath(): void {
    const mainPath = new Set(['root']);
    let current = this.currentNode;
    
    while (current) {
      mainPath.add(current.id);
      if (current.parentId) {
        const parent = this.findNodeById(current.parentId);
        if (!parent) break;
        current = parent;
      } else {
        break;
      }
    }
    
    this.gameTree.mainPath = mainPath;
  }

  /**
   * 노드를 바둑판에 적용
   */
  private applyNodeToBoard(node: GameNode): void {
    // 바둑판 초기화
    this.intersections = Game.initIntersections(this.xLines, this.yLines);
    
    // 루트부터 현재 노드까지의 경로 찾기
    const path: GameNode[] = [];
    let current: GameNode | null = node;
    
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        const parent = this.findNodeById(current.parentId);
        if (!parent) break;
        current = parent;
      } else {
        break;
      }
    }
    
    // 경로상의 모든 수를 순서대로 적용
    for (const node of path) {
      const { move, markers } = node.data;
      if (move && move.x >= 0 && move.y >= 0) {
        this.intersections[move.x][move.y].stone = move.color;
      }
      // 마커 적용
      if (markers) {
        this.markers = markers.slice();
      }
    }
    
    // 턴 설정
    const { move } = node.data;
    if (move) {
      this.turn = move.color === Stone.Black ? Stone.White : Stone.Black;
    } else {
      this.turn = Stone.Black;
    }
  }

  /**
   * SGF 파일로 저장
   */
  public saveSGF(): string {
    const header = `(;GM[1]FF[4]CA[UTF-8]AP[Goggle:1.0]KM[6.5]SZ[${this.xLines}]DT[${new Date().toISOString().split('T')[0]}]`;

    const serializeNode = (node: GameNode): string => {
      let sgf = '';
      
      if (node.id !== 'root') {
        const move = node.data.move!;
        sgf += `;${move.color === Stone.Black ? 'B' : 'W'}[${this.convertToSGFCoord(move.x, move.y)}]`;
        
        if (node.data.comment) {
          sgf += `C[${node.data.comment}]`;
        }

        // 마커 추가
        if (node.data.markers && node.data.markers.length > 0) {
          const markerGroups = {
            TR: [] as string[], // triangle
            SQ: [] as string[], // square
            CR: [] as string[], // circle
            MA: [] as string[], // cross
            LB: [] as string[], // label and number
          };

          node.data.markers.forEach(marker => {
            const coord = `${String.fromCharCode(97 + marker.x)}${String.fromCharCode(97 + marker.y)}`;
            switch (marker.type) {
              case 'triangle': markerGroups.TR.push(`[${coord}]`); break;
              case 'square': markerGroups.SQ.push(`[${coord}]`); break;
              case 'circle': markerGroups.CR.push(`[${coord}]`); break;
              case 'cross': markerGroups.MA.push(`[${coord}]`); break;
              case 'letter':
              case 'number':
                if (marker.label) {
                  markerGroups.LB.push(`[${coord}:${marker.label}]`);
                }
                break;
            }
          });

          // SGF 문자열에 마커 추가
          Object.entries(markerGroups).forEach(([type, coords]) => {
            if (coords.length > 0) {
              sgf += `${type}${coords.join('')}`;
            }
          });
        }
      }

      if (node.children.length > 0) {
        const variations = node.children.map(child => serializeNode(child));
        
        if (variations.length === 1) {
          sgf += variations[0];
        } else {
          sgf += variations.map(v => `(${v})`).join('');
        }
      }

      return sgf;
    };

    return header + serializeNode(this.gameTree.root) + ')';
  }

  private convertToSGFCoord(x: number, y: number): string {
    return String.fromCharCode(97 + x) + String.fromCharCode(97 + y);
  }

  /**
   * SGF 형식으로 변환
   */
  public getSGF(): string {
    const sgfNodes = [
      ";GM[1]FF[4]CA[UTF-8]AP[Goggle]SZ[19]"
    ];
 
    if (!this.gameState) return `(${sgfNodes.join('')})`;
 
    let prevMove: Stone | null = null; // Track the previous move color
 
    for (let state = this.gameState.getState(1); state != null; state = state.nextGameState) {
      const turn = state.turn === Stone.Black ? "B" : "W";
      const move = state.move;
 
      let node = "";
 
      // Include move if it exists
      if (move) {
        const xChar = String.fromCharCode(97 + move.xPos);
        const yChar = String.fromCharCode(97 + move.yPos);
        node += `;${turn}[${xChar}${yChar}]`;
 
        // Add markers
        const coord = (x: number, y: number) =>
          `[${String.fromCharCode(97 + x)}${String.fromCharCode(97 + y)}]`;
 
        const grouped = {
          TR: [] as string[], // triangle
          SQ: [] as string[], // square
          CR: [] as string[], // circle
          MA: [] as string[], // cross
          LB: [] as string[], // label
        };
 
        const markerMap = new Map<string, { x: number; y: number; type: string; label?: string; moveNum?: number }>();
        for (const marker of (state.markers ?? [])) {
          const key = `${marker.x}-${marker.y}-${marker.type}-${marker.label || ''}-${marker.moveNum || ''}`;
          if (!markerMap.has(key)) {
            markerMap.set(key, marker);
          }
        }
        const allMarkers = Array.from(markerMap.values());
        for (const marker of allMarkers) {
          const c = coord(marker.x, marker.y);
          if (marker.moveNum === state.moveNum || (marker.moveNum == null && move && marker.x === move.xPos && marker.y === move.yPos)) {
            if (marker.type === 'triangle') grouped.TR.push(c);
            else if (marker.type === 'square') grouped.SQ.push(c);
            else if (marker.type === 'circle') grouped.CR.push(c);
            else if (marker.type === 'cross') grouped.MA.push(c);
            else if (marker.type === 'letter' || marker.type === 'number') {
              grouped.LB.push(`${String.fromCharCode(97 + marker.x)}${String.fromCharCode(97 + marker.y)}:${marker.label}`);
            }
          }
        }
 
        // Add markers to the node
        for (const [tag, entries] of Object.entries(grouped)) {
          if (entries.length > 0) {
            if (tag === 'LB') {
              node += `LB${entries.map(e => `[${e}]`).join('')}`;
            } else {
              node += `${tag}${entries.join('')}`;
            }
          }
        }
      }
 
      // Preserve comments if available
      if (state.comment) {
        node += `C[${state.comment}]`;
      }
 
      // Add empty move for passes
      if (!move && prevMove === Stone.Black) {
        node += `;W[]`;
      }
 
      sgfNodes.push(node);
      prevMove = state.turn; // Update previous move to current turn
    }
 
    return `(${sgfNodes.join('')})`;
  }

  /**
   * 바둑판 상태 복사
   */
  public copyIntersections(): Intersection[][] {
    const { xLines, yLines, intersections } = this;

    const ints = new Array(xLines);
    for(let x = 0; x < xLines; x++) {
      ints[x] = new Array(yLines);

      for(let y = 0; y < yLines; y++) {
        ints[x][y] = new IntersectionImpl(x, y);
        ints[x][y].stone = intersections[x][y].stone;
      }
    }

    return ints;
  }

  /**
   * 돌 놓기
   */
  public makeMove(xPos: number, yPos: number): boolean {
    // 이미 돌이 있는 위치인지 확인
    if (this.intersections[xPos][yPos].stone !== Stone.None) {
      return false;
    }
    
    // 임시로 돌 놓기
    this.intersections[xPos][yPos].stone = this.turn;

    // 상대방 돌 잡기
    const capturedNeighbors = this.getCapturedNeighbors(xPos, yPos);
    let legalMove = capturedNeighbors.length > 0;
    
    // 잡힌 돌이 없다면, 방금 놓은 돌이 잡히는지 확인
    if (!legalMove) {
      const selfCaptured = this.getCapturedGroup(this.intersections[xPos][yPos]);
      legalMove = selfCaptured.length === 0;
    }
    
    // 유효한 수가 아니면 돌을 제거하고 종료
    if (!legalMove) {
      this.intersections[xPos][yPos].stone = Stone.None;
      return false;
    }
    
    // 상대방 돌 제거 및 점수 계산
    let numCaptured = 0;
    for (const group of capturedNeighbors) {
      for (const stone of group) {
        // 명시적으로 돌을 제거
        this.intersections[stone.xPos][stone.yPos].stone = Stone.None;
        numCaptured++;
      }
    }
    
    // 점수 업데이트
    if (numCaptured > 0) {
      if (this.turn === Stone.Black) {
        this.blackScore += numCaptured;
      } else {
        this.whiteScore += numCaptured;
      }
    }
    
    // 고 규칙 확인 - 제거 후에 확인해야 함
    if (this.checkForKo()) {
      // Ko 규칙 위반이면 원래 상태로 복원
      if (this.gameState) {
        this.loadGameState(this.gameState);
      }
      return false;
    }
    
    // 이동을 기록하고 턴 변경
    this.lastMove = this.intersections[xPos][yPos];

    // 현재 노드의 자식들 중에서 동일한 수가 있는지 확인
    const existingNode = this.currentNode.children.find(child => 
      child.data.move && 
      child.data.move.x === xPos && 
      child.data.move.y === yPos
    );

    if (existingNode) {
      // 동일한 수가 있는 경우 해당 분기로 이동
      this.navigateToNode(existingNode.id);
      this.notifyStateChange();
      return true;
    }

    // 새로운 분기 생성
    const newNode: GameNode = {
      id: Math.random().toString(36).slice(2),
      parentId: this.currentNode.id,
      children: [],
      data: {
        move: { x: xPos, y: yPos, color: this.turn },
        comment: '',
        markers: []
      }
    };

    // 새로운 메인 패스 생성
    const newMainPath = new Set(['root']);
    
    // 새 노드부터 루트까지의 경로를 메인 패스로 설정
    let current: GameNode | null = newNode;
    while (current) {
      newMainPath.add(current.id);
      if (current.parentId) {
        current = this.findNodeById(current.parentId);
      } else {
        break;
      }
    }

    // 게임 트리 업데이트
    this.currentNode.children.push(newNode);
    this.nodeMap.set(newNode.id, newNode);
    this.currentNode = newNode;
    this.gameTree.currentNodeId = newNode.id;
    this.gameTree.mainPath = newMainPath;

    this.notifyStateChange();
    this.nextTurn();
    return true;
  }

  /**
   * 패스
   */
  public pass(): void {
    if (this.gameState?.prevGameState?.isPass) {
      this.endGame();
    } else {
      if (this.gameState) {
        this.gameState.isPass = true;
      }
      this.nextTurn();
    }
  }

  public undo(): void {
    if (!this.currentNode || this.currentNode.id === 'root') return;

    const parentNode = this.findNodeById(this.currentNode.parentId!);
    if (parentNode) {
      // 상위 노드로 이동
      this.navigateToNode(parentNode.id);
    }
  }

  public redo(): void {
    if (!this.currentNode) return;

    // 현재 노드의 자식들 중에서 가장 먼저 만들어진 자식 노드를 선택
    const nextNode = this.currentNode.children[0];
    if (nextNode) {
      this.navigateToNode(nextNode.id);
    }
  }

  public navigateToNode(nodeId: string): void {
    const targetNode = this.findNodeById(nodeId);
    if (!targetNode) {
      console.error('Target node not found:', nodeId);
      return;
    }

    // 현재 노드의 코멘트와 마커 정보 저장
    if (this.currentNode) {
      // gameState가 존재하는 경우에만 코멘트 저장
      if (this.gameState) {
        this.currentNode.data.comment = this.gameState.comment;
      }
      if (this.markers.length > 0) {
        this.currentNode.data.markers = [...this.markers];
      }
    }

    // 게임 상태 복원
    this.restoreGameState(targetNode);

    // 현재 노드 업데이트
    this.currentNode = targetNode;
    this.gameTree.currentNodeId = nodeId;

    // 메인 경로 업데이트
    this.updateMainPath();

    // 상태 변경 알림
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }

  private restoreGameState(targetNode: GameNode): void {
    // 1. 보드 초기화
    this.intersections = Game.initIntersections(this.xLines, this.yLines);
    this.turn = Stone.Black;
    this.blackScore = 0;
    this.whiteScore = 0;
    this.lastMove = null;
    this.markers = [];
    
    // 2. 루트부터 타겟 노드까지의 경로 찾기
    const path = this.getPathToNode(targetNode);

    // 3. 경로를 따라가며 수를 놓기
    for (const node of path) {
      const move = node.data.move;
      if (move && move.x >= 0 && move.y >= 0) {
        this.intersections[move.x][move.y].stone = move.color;
        this.lastMove = this.intersections[move.x][move.y];
        this.turn = this.getOtherPlayer(move.color);
      }

      // 마커 복원
      if (node.data.markers) {
        this.markers = [...node.data.markers];
      }

      // 코멘트 복원
      if (!this.gameState) {
        this.gameState = this.newGameState(node.data.comment || '');
      } else {
        this.gameState.comment = node.data.comment || '';
      }
    }

    // 4. 게임 상태 업데이트
    if (!this.gameState) {
      this.gameState = this.newGameState();
    }
    this.gameState.markers = this.markers;
  }

  /**
   * 게임 종료
   */
  private endGame(): void {
    this.setTurn(Stone.None);
    
    // 영역 계산
    // const territories = this.getAllTerritories();
    this.notifyStateChange();
  }

  /**
   * 턴 변경
   */
  public setTurn(turn: Stone): void {
    this.turn = turn;
  }

  /**
   * 다음 턴으로 넘어가기
   */
  private nextTurn(): void {
    // 먼저 현재 상태 저장
    this.gameState = this.newGameState();
    if (this.lastMove) {
      this.gameState.move = this.lastMove.copy();
    }
    
    // 그 다음 턴 변경
    if (this.turn === Stone.Black) {
      this.setTurn(Stone.White);
    } else {
      this.setTurn(Stone.Black);
    }
    
    this.notifyStateChange();
  }

  /**
   * 새 게임 상태 생성
   */
  private newGameState(comment: string = ''): GameState {
    return new GameStateImpl(
      this.copyIntersections(), 
      this.turn, 
      this.blackScore, 
      this.whiteScore, 
      this.gameState,
      [],
      comment
    );
  }

  /**
   * 게임 상태 불러오기
   */
  private loadGameState(state: GameState): void {
    if (!state) return;
    
    const { xLines, yLines } = this;

    this.setTurn(state.turn);

    for (let x = 0; x < xLines; x++) {
      for (let y = 0; y < yLines; y++) {
        this.intersections[x][y].stone = state.intersections[x][y].stone;
      }
    }

    this.blackScore = state.blackScore;
    this.whiteScore = state.whiteScore;
    this.gameState = state;
    this.markers = state.markers ?? [];

    // 턴을 해당 수순에 맞게 설정
    if (state.move && state.move.stone === Stone.Black) {
      this.setTurn(Stone.White); // 마지막 수가 흑이면 백의 턴
    } else if (state.move && state.move.stone === Stone.White) {
      this.setTurn(Stone.Black); // 마지막 수가 백이면 흑의 턴
    }

    this.notifyStateChange();
  }

  /**
   * 고 규칙 체크 (같은 위치에 돌을 놓는 패턴 방지)
   */
  private checkForKo(): boolean {
    if (!this.gameState?.prevGameState) return false;
    
    const { xLines, yLines, intersections } = this;
    const prevState = this.gameState.prevGameState;

    for (let x = 0; x < xLines; x++) {
      for (let y = 0; y < yLines; y++) {
        if (intersections[x][y].stone !== prevState.intersections[x][y].stone) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 주변에 잡히는 돌 그룹 찾기
   */
  private getCapturedNeighbors(xPos: number, yPos: number): Intersection[][] {
    const otherPlayer = this.getOtherPlayer();
    const intersection = this.intersections[xPos][yPos];
    const neighbors = this.getAdjacentNeighbors(intersection);
    const capturedGroups: Intersection[][] = [];

    // 이미 처리된 돌을 추적하는 HashSet
    const processedStones: HashSet<Intersection> = new HashSet();
    
    for (const neighbor of neighbors) {
      if (neighbor && neighbor.stone === otherPlayer) {
        // 이미 처리된 돌은 건너뛰기
        if (processedStones.includes(neighbor)) continue;
        
        const captured = this.getCapturedGroup(neighbor);
        
        if (captured.length > 0) {
          // 새로 포획된 그룹의 모든 돌을 processedStones에 추가
          captured.forEach(stone => processedStones.insert(stone));
          capturedGroups.push(captured);
        }
      }
    }

    return capturedGroups;
  }

  /**
   * 돌이 잡히는지 확인
   */
  private getCapturedGroup(intersection: Intersection, visited: HashSet<Intersection> = new HashSet()): Intersection[] {
    const neighbors = this.getAdjacentNeighbors(intersection).filter(int => !visited.includes(int));
    
    // visited 해시셋에 현재 돌과 방문하지 않은 이웃들 추가
    [intersection, ...neighbors].forEach(int => visited.insert(int));

    let captured = true;
    let group = [intersection];
    
    for (const neighbor of neighbors) {
      if (neighbor === null) {
        // 가장자리인 경우는 항상 잡힘
        captured = true;
      } else if (neighbor.stone === Stone.None) {
        // 빈 공간이 있으면 잡히지 않음
        captured = false;
      } else if (neighbor.stone === intersection.stone) {
        // 같은 색상의 돌이면 연결된 그룹 확인
        const subGroup = this.getCapturedGroup(neighbor, visited);
        captured = captured && subGroup.length > 0;

        if (captured) {
          group = [...group, ...subGroup];
        }
      }

      if (!captured) {
        return [];
      }
    }

    return group;
  }

  /**
   * 다른 플레이어 (색상) 가져오기
   */
  private getOtherPlayer(turn?: Stone): Stone {
    const currentTurn = turn !== undefined ? turn : this.turn;
    return currentTurn === Stone.Black ? Stone.White : Stone.Black;
  }

  /**
   * 인접한 교차점들 가져오기
   */
  private getAdjacentNeighbors(intersection: Intersection): (Intersection | null)[] {
    const { xPos, yPos } = intersection;
    
    // 중복 제거하여 이웃 교차점들 가져오기
    const adjacentPositions = [
      this.getValidIntersection(xPos, yPos - 1),
      this.getValidIntersection(xPos, yPos + 1),
      this.getValidIntersection(xPos - 1, yPos),
      this.getValidIntersection(xPos + 1, yPos)
    ];
    
    // Create HashSet only with non-null intersections
    // const validNeighbors = adjacentPositions.filter((int): int is Intersection => int !== null);
    // const neighbors = new HashSet<Intersection>(...validNeighbors);
    
    return adjacentPositions;
  }

  /**
   * 유효한 교차점 가져오기 (바둑판 범위 체크)
   */
  private getValidIntersection(xPos: number, yPos: number): Intersection | null {
    if (0 <= xPos && xPos < this.xLines && 0 <= yPos && yPos < this.yLines) {
      return this.intersections[xPos][yPos];
    }
    return null;
  }

  /**
   * 영역 점령
   */
  public claimTerritory(xPos: number, yPos: number): boolean {
    const intersection = this.intersections[xPos][yPos];

    if (intersection.stone === Stone.None || this.claimedTerritoryLookup.includes(intersection)) {
      return false;
    }

    const owner = this.getOtherPlayer(intersection.stone);
    const territory = this.getTerritory(intersection, owner);

    this.claimedTerritories.push(territory);

    for (const int of territory.region) {
      this.claimedTerritoryLookup.insert(int);
    }

    this.notifyStateChange();
    return true;
  }

  /**
   * 모든 영역 가져오기
   */
  public getAllTerritories(): Territory[] {
    const apparentTerritories = this.getAllApparentTerritories(this.claimedTerritoryLookup);
    return [...this.claimedTerritories, ...apparentTerritories];
  }

  /**
   * 명확한 영역 계산하기
   */
  private getAllApparentTerritories(exclude: HashSet<Intersection> = new HashSet()): Territory[] {
    const { xLines, yLines } = this;
    const visited = new HashSet<Intersection>();
    const territories: Territory[] = [];

    for (let x = 0; x < xLines; x++) {
      for (let y = 0; y < yLines; y++) {
        const int = this.intersections[x][y];

        if (int.stone === Stone.None && !visited.includes(int) && !exclude.includes(int)) {
          const territory = this.getApparentTerritory(int, visited, true);

          if (territory.owner !== Stone.Unknown) {
            territories.push(territory);
          }
        }
      }
    }

    return territories;
  }

  /**
   * 명확한 영역 가져오기
   */
  private getApparentTerritory(
    intersection: Intersection, 
    visited: HashSet<Intersection> = new HashSet(), 
    greedy: boolean = false, 
    mode: Pointer<Stone> = { value: Stone.None }
  ): Territory {
    if (intersection.stone !== Stone.None) {
      return new TerritoryImpl(Stone.None, []);
    }

    const neighbors = this.getAdjacentNeighbors(intersection).filter(int => 
      int !== null && !visited.includes(int)
    );

    // visited 해시셋에 현재 돌과 빈 교차점인 이웃들 추가
    [intersection, ...neighbors].forEach(int => {
      if (int !== null && int.stone === Stone.None) {
        visited.insert(int);
      }
    });

    let territory = new TerritoryImpl(Stone.None, [intersection]);
    
    for (const neighbor of neighbors) {
      if (neighbor === null) {
        // 가장자리
        continue;
      }

      if (mode.value === Stone.None) {
        // 모드가 아직 설정되지 않았으면 이웃의 색상으로 설정
        mode.value = neighbor.stone;
      }
      
      if (neighbor.stone === Stone.None) {
        // 빈 교차점이면 재귀적으로 탐색
        const subTerritory = this.getApparentTerritory(neighbor, visited, greedy, mode);

        if (subTerritory.owner !== Stone.Unknown) {
          territory = territory.merge(subTerritory);
        }
      } else if (neighbor.stone === mode.value) {
        // 현재 모드와 같은 색상
        continue;
      } else if (neighbor.stone !== mode.value) {
        // 다른 색상이 발견되면 영역이 아님
        mode.value = Stone.Unknown;
      }

      if (!greedy && mode.value === Stone.Unknown) {
        break;
      }
    }

    if (mode.value === Stone.Unknown) {
      return new TerritoryImpl(Stone.Unknown, []);
    }

    return new TerritoryImpl(mode.value, territory.region);
  }

  /**
   * 영역 가져오기
   */
  private getTerritory(
    intersection: Intersection, 
    mode: Stone, 
    visited: HashSet<Intersection> = new HashSet()
  ): Territory {
    if (intersection.stone === mode) {
      return new TerritoryImpl(Stone.None, []);
    }

    const neighbors = this.getAdjacentNeighbors(intersection).filter(int => 
      int !== null && !visited.includes(int)
    );

    // visited 해시셋에 현재 위치와 이웃들 추가
    [intersection, ...neighbors].forEach(int => visited.insert(int));

    let territory = new TerritoryImpl(mode, [intersection]);
    
    for (const neighbor of neighbors) {
      if (neighbor === null) {
        // 가장자리
        continue;
      }

      if (neighbor.stone !== mode) {
        // 모드와 다른 색이면 재귀적으로 탐색
        const subTerritory = this.getTerritory(neighbor, mode, visited);
        territory = territory.merge(subTerritory);
      }
    }

    return territory;
  }
  
  /**
   * 상태 변화 알림
   */
  public notifyStateChange(): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }

  // 게터 메서드들
  public getXLines(): number { return this.xLines; }
  public getYLines(): number { return this.yLines; }
  public getTurn(): Stone { return this.turn; }
  public getBlackScore(): number { return this.blackScore; }
  public getWhiteScore(): number { return this.whiteScore; }
  public getLastMove(): Intersection | null { return this.lastMove; }
  public getGameState(): GameState | null { return this.gameState; }
  public getCurrentAndNextMove(): { current?: Intersection; next?: Intersection } {
    if (!this.currentNode) return {};

    // 현재 노드의 수
    const currentMove = this.currentNode.data.move;
    const current = currentMove && currentMove.x >= 0 && currentMove.y >= 0
      ? this.intersections[currentMove.x][currentMove.y]
      : undefined;

    // 다음 노드의 수 찾기
    if (this.currentNode.children.length > 0) {
      const nextNode = this.currentNode.children[0];
      const nextMove = nextNode.data.move;
      if (nextMove && nextMove.x >= 0 && nextMove.y >= 0) {
    return {
          current,
          next: this.intersections[nextMove.x][nextMove.y]
    };
      }
    }

    return { current };
  }

  public getScoreWithTerritory(color: Stone): { score: number, territory: number } {
    const baseScore = color === Stone.Black ? this.blackScore : this.whiteScore;
    let territoryScore = 0;
    
    const territories = this.getAllTerritories();
    for (const territory of territories) {
      if (territory.owner === color) {
        territoryScore += territory.score;
      }
    }
    
    return { score: baseScore, territory: territoryScore };
  }

  public addMarker(x: number, y: number, type: string, label?: string): void {
    if (!this.currentNode) return;
    
    // 현재 노드의 마커 배열 초기화
    if (!this.currentNode.data.markers) {
      this.currentNode.data.markers = [];
    }
    
    // 기존 마커 제거
    const existingIndex = this.currentNode.data.markers.findIndex(
      m => m.x === x && m.y === y
    );
    if (existingIndex !== -1) {
      this.currentNode.data.markers.splice(existingIndex, 1);
    }
    
    // 새 마커 추가
    const marker = {
      x,
      y,
      type,
      label,
      moveNum: this.gameState?.moveNum ?? 0
    };
    
    // GameNode에 마커 추가
    this.currentNode.data.markers.push(marker);
    
    // GameState와 동기화
    if (this.gameState) {
      this.gameState.markers = [...this.currentNode.data.markers];
    }
    
    this.notifyStateChange();
  }

  public removeMarker(x: number, y: number, type: string): void {
    this.markers = this.markers.filter(
      (m) => !(m.x === x && m.y === y && m.type === type)
    );
    
    // SGF 노드에도 마커 제거 정보 추가
    const currentNode = this.getCurrentNode();
    if (currentNode) {
      if (!currentNode.data) currentNode.data = {};
      // 제거된 마커 정보를 SGF 노드에 기록
      currentNode.data[`RE_${type.toUpperCase()}`] = `${x},${y}`;

      // 현재 노드의 마커 배열도 업데이트
      if (!currentNode.data.markers) {
        currentNode.data.markers = [];
      }
      currentNode.data.markers = currentNode.data.markers.filter(
        (m) => !(m.x === x && m.y === y && m.type === type)
      );

      // GameState와 동기화
      if (this.gameState) {
        this.gameState.markers = [...currentNode.data.markers];
      }
    }
    
    this.notifyStateChange();
  }

  public setStateChangeCallback(cb: () => void): void {
    this.stateChangeCallback = cb;
  }

  public getGameTree(): GameTree {
    return this.gameTree;
  }

  /**
   * 변화도 전환
   * @param targetNodeId 전환하고자 하는 변화도의 노드 ID
   */
  public switchVariation(targetNodeId: string): void {
    const targetNode = this.findNodeById(targetNodeId);
    if (!targetNode || !targetNode.parentId) return;

    // 1. 새로운 메인 패스 생성
    const newMainPath = new Set(['root']);
    
    // 2. 타겟 노드부터 루트까지 거슬러 올라가며 메인 패스 설정
    let current: GameNode | null = targetNode;
    while (current) {
      newMainPath.add(current.id);
      if (current.parentId) {
        current = this.findNodeById(current.parentId);
      } else {
        break;
      }
    }

    // 3. 타겟 노드의 첫 번째 자식들도 메인 패스에 추가
    const addFirstChildrenToMainPath = (node: GameNode) => {
      if (node.children.length > 0) {
        const firstChild = node.children[0];
        newMainPath.add(firstChild.id);
        addFirstChildrenToMainPath(firstChild);
      }
    };
    addFirstChildrenToMainPath(targetNode);

    // 4. 메인 패스 업데이트
    this.gameTree.mainPath = newMainPath;

    // 5. 현재 노드 업데이트 및 UI 갱신
    this.navigateToNode(targetNodeId);
    this.notifyStateChange();
  }

  private findNodeById(nodeId: string): GameNode | null {
    // Map에서 먼저 조회 (O(1) 시간 복잡도)
    if (this.nodeMap.has(nodeId)) {
      return this.nodeMap.get(nodeId)!;
    }

    // Map에 없는 경우 트리 순회로 fallback
    const traverse = (node: GameNode): GameNode | null => {
      if (node.id === nodeId) {
        // 찾은 노드를 Map에 캐시
        this.nodeMap.set(nodeId, node);
        return node;
      }
      for (const child of node.children) {
        const found = traverse(child);
        if (found) return found;
      }
      return null;
    };

    return traverse(this.gameTree.root);
  }

  private getPathToNode(node: GameNode): GameNode[] {
    const path: GameNode[] = [];
    let current: GameNode | null = node;

    while (current) {
      path.unshift(current);
      current = current.parentId ? this.findNodeById(current.parentId) : null;
    }

    return path;
  }

  // 코멘트 업데이트 메서드 추가
  public updateComment(comment: string): void {
    if (!this.currentNode) return;
    
    // GameNode의 코멘트 업데이트
    this.currentNode.data.comment = comment;
    
    // GameState의 코멘트도 동기화
    if (this.gameState) {
      this.gameState.comment = comment;
    }

    this.notifyStateChange();
  }

  public getCurrentNode(): GameNode | null {
    return this.currentNode;
  }

  /**
   * 현재 노드 삭제
   * 현재 노드와 그 자식들을 모두 삭제하고, 이전 노드로 이동
   */
  public deleteCurrentNode(): boolean {
    if (!this.currentNode || this.currentNode.id === 'root') return false;

    const parentNode = this.findNodeById(this.currentNode.parentId!);
    if (!parentNode) return false;

    // 1. 현재 노드의 모든 자식 노드들을 Map에서 제거
    const removeNodeAndChildren = (node: GameNode) => {
      this.nodeMap.delete(node.id);
      for (const child of node.children) {
        removeNodeAndChildren(child);
      }
    };
    removeNodeAndChildren(this.currentNode);

    // 2. 부모 노드의 자식 목록에서 현재 노드 제거
    const childIndex = parentNode.children.findIndex(child => child.id === this.currentNode.id);
    if (childIndex !== -1) {
      parentNode.children.splice(childIndex, 1);
    }

    // 3. 부모 노드로 이동
    this.navigateToNode(parentNode.id);

    // 4. 게임 상태 업데이트
    this.notifyStateChange();
    return true;
  }

  /**
   * 특정 위치의 돌 삭제
   * 해당 위치의 돌이 현재 노드의 수인 경우에만 삭제 가능
   */
  public deleteStone(x: number, y: number): boolean {
    console.log('Deleting stone at:', { x, y });
    if (!this.intersections[x] || !this.intersections[x][y]) {
      console.log('Invalid position:', { x, y });
      return false;
    }

    if (this.intersections[x][y].stone === Stone.None) {
      console.log('No stone at position:', { x, y });
      return false;
    }

    // 현재 노드의 수인지 확인
    if (!this.currentNode || this.currentNode.id === 'root') {
      console.log('Cannot delete: No current node or root node');
      return false;
    }

    const currentMove = this.currentNode.data.move;
    if (!currentMove || currentMove.x !== x || currentMove.y !== y) {
      console.log('Cannot delete: Not the current move');
      return false;
    }

    // 현재 노드의 코멘트와 마커 정보 저장
    const parentNode = this.findNodeById(this.currentNode.parentId!);
    if (!parentNode) {
      console.log('Cannot delete: No parent node found');
      return false;
    }

    // 1. 현재 노드의 모든 자식 노드들을 Map에서 제거
    const removeNodeAndChildren = (node: GameNode) => {
      this.nodeMap.delete(node.id);
      for (const child of node.children) {
        removeNodeAndChildren(child);
      }
    };
    removeNodeAndChildren(this.currentNode);

    // 2. 부모 노드의 자식 목록에서 현재 노드 제거
    const childIndex = parentNode.children.findIndex(child => child.id === this.currentNode.id);
    if (childIndex !== -1) {
      parentNode.children.splice(childIndex, 1);
    }

    // 3. 부모 노드로 이동
    this.navigateToNode(parentNode.id);

    // 4. 게임 상태 업데이트
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }

    return true;
  }
}
// src/lib/types.ts
import { MutableRefObject } from 'react';
import * as d3 from 'd3';

// d3 Selection 타입 수정 - 빈 객체({}) 대신 object 사용, any 대신 unknown 사용
export type SVGSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>;
export type Selection = d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;

export enum Stone {
  Unknown = -1,
  None = 0,
  Black,
  White
}

export const STONE_CLASSES = ["empty", "black", "white"];

export interface Intersection {
  xPos: number;
  yPos: number;
  stone: Stone;
  hashKey: () => string;
  copy: () => Intersection;
}

export interface GameState {
  intersections: Intersection[][];
  turn: Stone;
  moveNum: number;
  prevGameState: GameState | null;
  nextGameState: GameState | null;
  blackScore: number;
  whiteScore: number;
  isPass: boolean;
  move: Intersection | null;
  comment?: string;
  toString: () => string;
  getState: (moveNum: number) => GameState | null;
  markers?: { x: number; y: number; type: string; label?: string; moveNum?: number }[];
}

export interface Territory {
  region: Intersection[];
  owner: Stone;
  score: number;
  merge: (territory: Territory) => Territory;
}

export interface Hashable {
  hashKey: () => string;
}

export interface Pointer<T> {
  value: T;
}

export interface BoardLayout {
  boardX: number;
  boardY: number;
  hFlip: boolean;
  vFlip: boolean;
  main: boolean;
}

export interface GameBoardConfig {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  width: number;
  height: number;
  xLines: number;
  yLines: number;
  showCoordinates?: boolean;
}

// NodeData의 인덱스 시그니처를 더 구체적인 타입으로 변경
export interface NodeData {
  move?: {
    x: number;
    y: number;
    color: Stone;
  };
  comment?: string;
  markers?: {
    x: number;
    y: number;
    type: string;
    label?: string;
    moveNum?: number;
  }[];
  [key: string]: unknown; // any를 unknown으로 변경
}

export interface GameNode {
  id: string;
  parentId: string | null;
  children: GameNode[];
  data: NodeData;
}

export interface GameTree {
  root: GameNode;
  currentNodeId: string;
  mainPath: Set<string>;
  get(id: string): GameNode | undefined;
}

// 게임보드 관련 타입
export interface Vertex {
  x: number;
  y: number;
}

export interface BoardLine {
  v1: Vertex;
  v2: Vertex;
  type: 'arrow' | 'line';
}

export interface BoardMarker {
  type: 'circle' | 'cross' | 'square' | 'triangle' | 'label' | 'point';
  label?: string;
}

// 보드 정보 인터페이스 추가
export interface BoardInfo {
  vertex: Vertex;
  type: 'variation' | 'sibling';
  moveNumber?: number;
}

export interface BoardState {
  signMap: number[][];
  markers: (BoardMarker | null)[][];
  lines: BoardLine[];
  childrenInfo: BoardInfo[];  // any를 BoardInfo로 변경
  siblingsInfo: BoardInfo[];  // any를 BoardInfo로 변경
  currentVertex?: [number, number];
}

export interface GameTreeNodeProps {
  node: GameNode;
  isMainPath: boolean;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
  style?: React.CSSProperties;
}

export interface Move {
  x: number;
  y: number;
  color: Stone;
}

export interface GameTreeInteractions {
  navigateToNode: (nodeId: string) => void;
  createVariation: (parentId: string, move: Move) => void;
  deleteVariation: (nodeId: string) => void;
  promoteVariation: (nodeId: string) => void;
}

export interface MatrixDictParams {
  nodes: GameNode[];
  currentNodeId: string;
  onNodeClick: (nodeId: string) => void;  // nodeId 매개변수 추가
}

export interface PatternDescription {
  description: string;
  url: string;
}
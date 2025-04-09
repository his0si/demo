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
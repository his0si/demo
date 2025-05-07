declare module '@sabaki/boardmatcher' {
  interface Pattern {
    name: string;
    priority: number;
    url: string;
  }

  interface PatternMatch {
    pattern: Pattern;
    match: {
      anchors: [number, number][];
      vertices: [number, number][];
    };
  }

  interface BoardMatcher {
    findPatternInMove(
      board: number[][],
      color: number,
      vertex: [number, number]
    ): PatternMatch | null;
  }

  const boardmatcher: BoardMatcher;
  export default boardmatcher;
} 
import { GameTree } from './types'

interface GameInfo {
  playerNames: [string | null, string | null]
  playerRanks: [string | null, string | null]
  blackName: string | null
  blackRank: string | null
  whiteName: string | null
  whiteRank: string | null
  gameName: string | null
  eventName: string | null
  gameComment: string | null
  date: string | null
  result: string | null
  komi: number | null
  handicap: number
  size: [number, number]
}

interface BoardMarker {
  type: 'circle' | 'cross' | 'square' | 'triangle' | 'point' | 'label'
  label?: string
}

interface Line {
  v1: [number, number]
  v2: [number, number]
  type: 'arrow' | 'line'
}

interface Board {
  signMap: number[][]
  markers: (BoardMarker | null)[][]
  lines: Line[]
  childrenInfo: any[]
  siblingsInfo: any[]
  currentVertex?: [number, number]
  clone(): Board
  makeMove(sign: number, vertex: [number, number]): Board
  has(vertex: [number, number]): boolean
  set(vertex: [number, number], sign: number): void
  getHandicapPlacement(count: number): [number, number][]
}

class GameTreeManager {
  private boardCache: { [key: string]: Board } = {}
  
  // 새로운 게임 트리 생성
  static createGameTree(options: any = {}): GameTree {
    return {
      root: {
        id: Math.random().toString(36).slice(2),
        parentId: null,
        children: [],
        data: {}
      },
      ...options
    }
  }

  // 루트 속성 가져오기
  getRootProperty(tree: GameTree, property: string, fallback: any = null): any {
    if (!tree.root.data || !(property in tree.root.data)) {
      return fallback
    }
    return tree.root.data[property][0] || fallback
  }

  // 게임 정보 가져오기
  getGameInfo(tree: GameTree): GameInfo {
    const komi = this.parseKomi(this.getRootProperty(tree, 'KM'))
    const size = this.parseBoardSize(this.getRootProperty(tree, 'SZ'))
    const handicap = this.parseHandicap(this.getRootProperty(tree, 'HA', 0))
    
    const playerNames: [string | null, string | null] = [
      this.getRootProperty(tree, 'PB'),
      this.getRootProperty(tree, 'PW')
    ]
    
    const playerRanks: [string | null, string | null] = [
      this.getRootProperty(tree, 'BR'),
      this.getRootProperty(tree, 'WR')
    ]

    return {
      playerNames,
      playerRanks,
      blackName: playerNames[0],
      blackRank: playerRanks[0],
      whiteName: playerNames[1],
      whiteRank: playerRanks[1],
      gameName: this.getRootProperty(tree, 'GN'),
      eventName: this.getRootProperty(tree, 'EV'),
      gameComment: this.getRootProperty(tree, 'GC'),
      date: this.getRootProperty(tree, 'DT'),
      result: this.getRootProperty(tree, 'RE'),
      komi,
      handicap,
      size
    }
  }

  // 트리 매트릭스 표현 얻기
  getMatrixDict(tree: GameTree): [string[][], {[key: string]: [number, number]}] {
    const matrix: string[][] = Array(this.getTreeHeight(tree) + 1).fill([]).map(() => [])
    const dict: {[key: string]: [number, number]} = {}

    const buildMatrix = (node: any, x = 0, y = 0): void => {
      const sequence = this.getSequence(tree, node.id)
      
      sequence.forEach((node, index) => {
        matrix[y + index][x] = node.id
        dict[node.id] = [x, y + index]
      })

      const lastNode = sequence[sequence.length - 1]
      lastNode.children.forEach((child: any, index: number) => {
        buildMatrix(child, x + index + 1, y + sequence.length)
      })
    }

    buildMatrix(tree.root)
    return [matrix, dict]
  }

  private parseKomi(komi: string | null): number | null {
    if (komi === null || isNaN(Number(komi))) return null
    return Number(komi)
  }

  private parseBoardSize(size: string | null): [number, number] {
    if (size === null) return [19, 19]
    const [width, height] = size.split(':').map(Number)
    return [width, height || width]
  }

  private parseHandicap(handicap: number): number {
    return Math.max(0, Math.min(9, Math.round(handicap)))
  }

  private getTreeHeight(tree: GameTree): number {
    let height = 0
    const traverse = (node: any, depth: number): void => {
      height = Math.max(height, depth)
      node.children.forEach((child: any) => traverse(child, depth + 1))
    }
    traverse(tree.root, 0)
    return height
  }

  private getSequence(tree: GameTree, nodeId: string): any[] {
    const sequence = []
    let node = tree.root
    while (node) {
      sequence.push(node)
      node = node.children[0]
    }
    return sequence
  }

  clearBoardCache(): void {
    this.boardCache = {}
  }
}

export default GameTreeManager
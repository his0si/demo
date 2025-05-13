'use client';

import { Stone } from '@/lib/types';
import { 
  ArrowUturnLeftIcon, 
  ArrowUturnRightIcon, 
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  PencilSquareIcon,
  StopIcon
} from '@heroicons/react/24/solid';

interface GameControlsProps {
  currentPlayer: Stone;
  blackScore: number;
  whiteScore: number;
  blackTerritory: number; 
  whiteTerritory: number;
  isGameEnded: boolean;
  onPass: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSelectTool?: (tool: string) => void;
  selectedTool?: string;
  // 심플하게 단일 타입 속성으로 변경
  type: 'score' | 'controls' | 'game-end';
}

export default function GameControls({
  currentPlayer,
  blackScore,
  whiteScore,
  blackTerritory,
  whiteTerritory,
  isGameEnded,
  onPass,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onSelectTool,
  selectedTool,
  type
}: GameControlsProps) {

  // 점수 표시 영역 렌더링 함수 (상단에 표시)
  if (type === 'score') {
    return (
      <div className="flex justify-center mb-3">
        <div className="flex items-center px-3 py-1.5">
          {/* 흑 점수 */}
          <div className="flex items-center mr-2">
            <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              <span className="font-medium text-xs">
                {isGameEnded ? blackScore + blackTerritory : blackScore}
              </span>
            </div>
          </div>
          
          {/* 흑 레이블 */}
          <div className="text-sm font-bold mr-1.5">
            Black
          </div>
          
          <div className="relative w-12 h-8 mx-1">
            {/* 흑 원 */}
            <div className={`absolute w-7 h-7 rounded-full bg-black transition-all duration-300 ${
              currentPlayer === Stone.Black ? 'z-10 left-0 top-0.5' : 'z-0 left-0 top-0.5'
            }`} />
            {/* 백 원 */}
            <div className={`absolute w-7 h-7 rounded-full bg-white border-2 border-black transition-all duration-300 ${
              currentPlayer === Stone.White ? 'z-10 left-5 top-0.5' : 'z-0 left-5 top-0.5'
            }`} />
          </div>
          
          {/* 백 레이블 */}
          <div className="text-sm font-bold ml-1.5">
            White
          </div>
          
          {/* 백 점수 */}
          <div className="flex items-center ml-2">
            <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              <span className="font-medium text-xs">
                {isGameEnded ? whiteScore + whiteTerritory : whiteScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 게임 종료 알림 영역 렌더링 함수 (하단에 표시)
  if (type === 'game-end' && isGameEnded) {
    return (
      <div className="text-center mt-2 p-2 bg-yellow-100 rounded">
        <p>게임이 종료되었습니다.</p>
        <p>돌을 클릭하여 영역을 확인하세요.</p>
      </div>
    );
  }
  
  // 메인 컨트롤 바 렌더링 (하단에 표시)
  if (type === 'controls') {
    return (
      <div className="bg-gray-700 rounded-lg p-2 shadow-lg mt-4">
        <div className="flex justify-center items-center gap-2">
          {/* 맨 앞으로 */}
          <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <ChevronDoubleLeftIcon className="w-5 h-5" />
          </button>
          
          {/* 이전 */}
          <button onClick={onUndo} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <ArrowUturnLeftIcon className="w-5 h-5" />
          </button>
          
          {/* 다음 */}
          <button onClick={onRedo} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <ArrowUturnRightIcon className="w-5 h-5" />
          </button>
          
          {/* 맨 뒤로 */}
          <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <ChevronDoubleRightIcon className="w-5 h-5" />
          </button>
          
          {/* 게임 종료 (패스) */}
          <button onClick={onPass} disabled={isGameEnded} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white disabled:opacity-50">
            <StopIcon className="w-5 h-5" />
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-500 mx-1"></div>
          
          {/* 저장 */}
          <button onClick={onSave} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <DocumentTextIcon className="w-5 h-5" />
          </button>
          
          {/* 불러오기 */}
          <button onClick={onLoad} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <FolderOpenIcon className="w-5 h-5" />
          </button>
          
          {/* AI 분석 */}
          <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
            <span className="font-bold">AI</span>
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-500 mx-1"></div>
          
          {/* 편집 도구 (마커) - 수정된 부분 */}
          <div className="relative group">
            <button 
              className={`p-2 ${selectedTool && selectedTool !== 'move' ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-500'} rounded text-white`}
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            
            {/* 마커 도구 팝업 - 그룹 호버로 변경 및 연결 영역 추가 */}
            <div 
              className="hidden group-hover:flex absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0 flex-col"
            >
              {/* 투명한 연결 영역 */}
              <div className="h-2 w-full"></div>
              
              {/* 마커 버튼 컨테이너 */}
              <div className="bg-gray-800 p-2 rounded-lg flex gap-2 shadow-lg">
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'cross' ? 'move' : 'cross')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'cross' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  ×
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'triangle' ? 'move' : 'triangle')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'triangle' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  △
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'square' ? 'move' : 'square')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'square' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  □
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'circle' ? 'move' : 'circle')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'circle' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  ○
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'letter' ? 'move' : 'letter')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'letter' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  A
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'number' ? 'move' : 'number')} 
                  className={`w-8 h-8 flex items-center justify-center rounded ${selectedTool === 'number' ? 'bg-gray-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                >
                  1
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 기본 반환값
  return null;
}
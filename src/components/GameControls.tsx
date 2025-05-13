'use client';

import { Stone } from '@/lib/types';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowDownTrayIcon,
  FolderOpenIcon,
  PencilIcon,
  StopCircleIcon
} from '@heroicons/react/24/outline';

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

  // 점수 표시 영역 렌더링 함수 - 크기 확대
  if (type === 'score') {
    return (
      <div className="flex justify-center mb-5">
        <div className="flex items-center px-4 py-2.5">
          {/* 흑 점수 */}
          <div className="flex items-center mr-4">
            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-medium text-sm">
                {isGameEnded ? blackScore + blackTerritory : blackScore}
              </span>
            </div>
          </div>
          
          {/* 흑 레이블 */}
          <div className="text-base font-bold mr-2">
            Black
          </div>
          
          <div className="relative w-16 h-10 mx-2">
            {/* 흑 원 */}
            <div className={`absolute w-9 h-9 rounded-full bg-black transition-all duration-300 ${
              currentPlayer === Stone.Black ? 'z-10 left-0 top-0.5' : 'z-0 left-0 top-0.5'
            }`} />
            {/* 백 원 */}
            <div className={`absolute w-9 h-9 rounded-full bg-white border-2 border-black transition-all duration-300 ${
              currentPlayer === Stone.White ? 'z-10 left-7 top-0.5' : 'z-0 left-7 top-0.5'
            }`} />
          </div>
          
          {/* 백 레이블 */}
          <div className="text-base font-bold ml-2">
            White
          </div>
          
          {/* 백 점수 */}
          <div className="flex items-center ml-4">
            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-medium text-sm">
                {isGameEnded ? whiteScore + whiteTerritory : whiteScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 게임 종료 알림 영역 렌더링 함수 (하단에 표시) - 크기 확대
  if (type === 'game-end' && isGameEnded) {
    return (
      <div className="text-center mt-4 p-3 bg-yellow-100 rounded">
        <p className="text-base">게임이 종료되었습니다.</p>
        <p className="text-base">돌을 클릭하여 영역을 확인하세요.</p>
      </div>
    );
  }
  
  // 메인 컨트롤 바 렌더링 (하단에 표시) - 크기 확대
  if (type === 'controls') {
    return (
      <div className="p-4 mt-6">
        <div className="flex justify-center items-center gap-6">
          {/* 맨 앞으로 */}
          <button className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <ChevronDoubleLeftIcon className="w-6 h-6" />
          </button>
          
          {/* 이전 */}
          <button onClick={onUndo} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          {/* 다음 */}
          <button onClick={onRedo} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          
          {/* 맨 뒤로 */}
          <button className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <ChevronDoubleRightIcon className="w-6 h-6" />
          </button>
          
          {/* 게임 종료 (패스) */}
          <button onClick={onPass} disabled={isGameEnded} className="p-2 text-black hover:bg-gray-100 rounded-full transition disabled:opacity-50">
            <StopCircleIcon className="w-6 h-6" />
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* 저장 */}
          <button onClick={onSave} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
          
          {/* 불러오기 */}
          <button onClick={onLoad} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <FolderOpenIcon className="w-6 h-6" />
          </button>
          
          {/* AI 분석 */}
          <button className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <span className="font-bold text-base">AI</span>
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* 편집 도구 (마커) - 수정된 부분 */}
          <div className="relative group">
            <button 
              className={`p-2 ${selectedTool && selectedTool !== 'move' ? 'bg-gray-100' : 'hover:bg-gray-100'} rounded-full transition text-black`}
            >
              <PencilIcon className="w-6 h-6" />
            </button>
            
            {/* 마커 도구 팝업 - 그룹 호버로 변경 및 연결 영역 추가 */}
            <div 
              className="hidden group-hover:flex absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0 flex-col"
            >
              {/* 투명한 연결 영역 */}
              <div className="h-2 w-full"></div>
              
              {/* 마커 버튼 컨테이너 - 미니멀 스타일로 변경 */}
              <div className="bg-white p-3 rounded-lg flex gap-3 shadow-md">
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'cross' ? 'move' : 'cross')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'cross' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg font-bold">X</span>
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'triangle' ? 'move' : 'triangle')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'triangle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg">△</span>
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'square' ? 'move' : 'square')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'square' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg">□</span>
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'circle' ? 'move' : 'circle')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'circle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg">○</span>
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'letter' ? 'move' : 'letter')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'letter' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg font-bold">A</span>
                </button>
                <button 
                  onClick={() => onSelectTool?.(selectedTool === 'number' ? 'move' : 'number')} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedTool === 'number' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                >
                  <span className="text-lg font-bold">1</span>
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
'use client';

import { Stone } from '@/lib/types';
import { 
  CaretDoubleLeft, 
  CaretLeft, 
  CaretRight, 
  CaretDoubleRight, 
  DownloadSimple, 
  FolderOpen, 
  PencilSimple, 
  StopCircle,
  X,
  Triangle,
  Square,
  Circle,
  TextAUnderline,
  NumberOne
} from '@phosphor-icons/react';
import { useState } from 'react';

interface GameControlsProps {
  currentPlayer: Stone;
  blackScore: number;
  whiteScore: number;
  blackTerritory: number; 
  whiteTerritory: number;
  isGameEnded: boolean;
  onGoToStart?: () => void;
  onGoToEnd?: () => void;
  onPass: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSelectTool?: (tool: string) => void;
  selectedTool?: string;
  type: 'score' | 'controls' | 'game-end';
}

export default function GameControls({
  currentPlayer,
  blackScore,
  whiteScore,
  blackTerritory,
  whiteTerritory,
  isGameEnded,
  onGoToStart,
  onGoToEnd,
  onPass,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onSelectTool,
  selectedTool,
  type
}: GameControlsProps) {
  // 마커 모달 상태 관리
  const [showMarkerModal, setShowMarkerModal] = useState(false);

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
          <button onClick={onGoToStart} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretDoubleLeft weight="regular" size={24} />
          </button>
          
          {/* 이전 */}
          <button onClick={onUndo} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretLeft weight="regular" size={24} />
          </button>
          
          {/* 다음 */}
          <button onClick={onRedo} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretRight weight="regular" size={24} />
          </button>
          
          {/* 맨 뒤로 */}
          <button onClick={onGoToEnd} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretDoubleRight weight="regular" size={24} />
          </button>
          
          {/* 게임 종료 (패스) */}
          <button onClick={onPass} disabled={isGameEnded} className="p-2 text-black hover:bg-gray-100 rounded-full transition disabled:opacity-50">
            <StopCircle weight="regular" size={24} />
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* 저장 */}
          <button onClick={onSave} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <DownloadSimple weight="regular" size={24} />
          </button>
          
          {/* 불러오기 */}
          <button onClick={onLoad} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <FolderOpen weight="regular" size={24} />
          </button>
          
          {/* AI 분석 */}
          <button className="p-2 text-black hover:bg-gray-100 rounded-full transition">
            <span className="font-bold text-base">AI</span>
          </button>
          
          {/* 구분선 */}
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* 편집 도구 (마커) - 개선된 부분 */}
          <div className="relative">
            {/* 클릭 시 모달 토글하는 방식으로 변경 + 커서 포인터 추가 */}
            <button 
              onClick={() => setShowMarkerModal(!showMarkerModal)}
              className={`p-2 ${selectedTool && selectedTool !== 'move' ? 'bg-gray-100' : 'hover:bg-gray-100'} rounded-full transition text-black cursor-pointer relative`}
              title="마커 도구 선택"
            >
              <PencilSimple weight="regular" size={24} />
            </button>
            
            {/* 마커 도구 팝업 - 표시 조건 변경 */}
            {showMarkerModal && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2"
                style={{ zIndex: 50 }}
              >
                {/* 마커 버튼 컨테이너 */}
                <div className="bg-white p-2.5 rounded-lg flex gap-2 shadow-md border border-gray-200">
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'cross' ? 'move' : 'cross');
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'cross' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="X 마커"
                  >
                    <X weight="bold" size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'triangle' ? 'move' : 'triangle');
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'triangle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="삼각형 마커"
                  >
                    <Triangle weight="bold" size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'square' ? 'move' : 'square');
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'square' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="사각형 마커"
                  >
                    <Square weight="bold" size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'circle' ? 'move' : 'circle');
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'circle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="원형 마커"
                  >
                    <Circle weight="bold" size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'letter' ? 'move' : 'letter'); 
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'letter' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="알파벳 마커"
                  >
                    <TextAUnderline weight="bold" size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'number' ? 'move' : 'number');
                      setShowMarkerModal(false);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'number' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="숫자 마커"
                  >
                    <NumberOne weight="bold" size={18} />
                  </button>
                </div>
                
                {/* 화살표 추가하여 모달의 방향을 표시 */}
                <div className="w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200 absolute -bottom-2 left-1/2 -translate-x-1/2"></div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    );
  }
  
  // 기본 반환값
  return null;
}
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
import { useState, useEffect } from 'react';

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
  // 화면 크기에 따른 UI 조정을 위한 상태
  const [viewportState, setViewportState] = useState({
    isMobile: false,
    isTablet: false
  });
  
  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
    };
    
    // 초기 실행
    handleResize();
    
    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 점수 표시 영역 렌더링 함수 - 반응형 개선
  if (type === 'score') {
    return (
      <div className="w-full flex justify-center mb-2">
        <div className={`
          flex items-center justify-center py-2
          ${viewportState.isMobile ? 'scale-90 transform' : ''}
        `}>
          {/* 흑 점수 */}
          <div className="flex items-center mr-2 sm:mr-4">
            <div className="bg-gray-100 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <span className="font-medium text-xs sm:text-sm">
                {isGameEnded ? blackScore + blackTerritory : blackScore}
              </span>
            </div>
          </div>
          
          {/* 흑 레이블 */}
          <div className="text-sm sm:text-base font-bold mr-1 sm:mr-2">
            Black
          </div>
          
          <div className="relative w-14 h-8 mx-1 sm:w-16 sm:h-10 sm:mx-2">
            {/* 흑 원 */}
            <div className={`absolute w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black transition-all duration-300 ${
              currentPlayer === Stone.Black ? 'z-10 left-0 top-0' : 'z-0 left-0 top-0'
            }`} />
            {/* 백 원 */}
            <div className={`absolute w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-black transition-all duration-300 ${
              currentPlayer === Stone.White ? 'z-10 left-6 sm:left-7 top-0' : 'z-0 left-6 sm:left-7 top-0'
            }`} />
          </div>
          
          {/* 백 레이블 */}
          <div className="text-sm sm:text-base font-bold ml-1 sm:ml-2">
            White
          </div>
          
          {/* 백 점수 */}
          <div className="flex items-center ml-2 sm:ml-4">
            <div className="bg-gray-100 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <span className="font-medium text-xs sm:text-sm">
                {isGameEnded ? whiteScore + whiteTerritory : whiteScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 게임 종료 알림 영역 렌더링 함수 (하단에 표시) - 반응형 개선
  if (type === 'game-end' && isGameEnded) {
    return (
      <div className="w-full text-center mt-2 p-2 sm:p-3 bg-yellow-100 rounded">
        <p className="text-sm sm:text-base">게임이 종료되었습니다.</p>
        <p className="text-sm sm:text-base">돌을 클릭하여 영역을 확인하세요.</p>
      </div>
    );
  }
  
  // 메인 컨트롤 바 렌더링 (하단에 표시) - 반응형 개선
  if (type === 'controls') {
    return (
      <div className="w-full mt-3">
        <div className={`
          flex justify-center items-center 
          ${viewportState.isMobile ? 'gap-2 scale-90 transform' : viewportState.isTablet ? 'gap-4' : 'gap-6'}
        `}>
          {/* 맨 앞으로 - 모바일에서는 숨김 */}
          {!viewportState.isMobile && (
            <button onClick={onGoToStart} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
              <CaretDoubleLeft weight="regular" size={viewportState.isTablet ? 20 : 24} />
            </button>
          )}
          
          {/* 이전 */}
          <button onClick={onUndo} className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretLeft weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
          </button>
          
          {/* 다음 */}
          <button onClick={onRedo} className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition">
            <CaretRight weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
          </button>
          
          {/* 맨 뒤로 - 모바일에서는 숨김 */}
          {!viewportState.isMobile && (
            <button onClick={onGoToEnd} className="p-2 text-black hover:bg-gray-100 rounded-full transition">
              <CaretDoubleRight weight="regular" size={viewportState.isTablet ? 20 : 24} />
            </button>
          )}
          
          {/* 게임 종료 (패스) */}
          <button onClick={onPass} disabled={isGameEnded} className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition disabled:opacity-50">
            <StopCircle weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
          </button>
          
          {/* 구분선 */}
          <div className="h-6 sm:h-8 w-px bg-gray-200 mx-1 sm:mx-2"></div>
          
          {/* 저장 */}
          <button onClick={onSave} className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition">
            <DownloadSimple weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
          </button>
          
          {/* 불러오기 */}
          <button onClick={onLoad} className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition">
            <FolderOpen weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
          </button>
          
          {/* AI 분석 - 모바일에서는 숨김 */}
          {!viewportState.isMobile && (
            <button className="p-1.5 sm:p-2 text-black hover:bg-gray-100 rounded-full transition">
              <span className="font-bold text-xs sm:text-base">AI</span>
            </button>
          )}
          
          {/* 구분선 */}
          <div className="h-6 sm:h-8 w-px bg-gray-200 mx-1 sm:mx-2"></div>
          
          {/* 편집 도구 (마커) */}
          <div className="relative">
            <button 
              onClick={() => setShowMarkerModal(!showMarkerModal)}
              className={`p-1.5 sm:p-2 ${selectedTool && selectedTool !== 'move' ? 'bg-gray-100' : 'hover:bg-gray-100'} rounded-full transition text-black cursor-pointer relative`}
              title="마커 도구 선택"
            >
              <PencilSimple weight="regular" size={viewportState.isMobile ? 18 : viewportState.isTablet ? 20 : 24} />
            </button>
            
            {/* 마커 도구 팝업 - 위치 조정 */}
            {showMarkerModal && (
              <div 
                className={`absolute ${viewportState.isMobile ? 'right-0' : 'left-1/2 transform -translate-x-1/2'} bottom-full mb-2`}
                style={{ zIndex: 50 }}
              >
                <div className={`
                  bg-white p-2 rounded-lg flex gap-1 sm:gap-2 shadow-md border border-gray-200
                  ${viewportState.isMobile ? 'flex-col' : ''}
                `}>
                  {/* 마커 버튼들 */}
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'cross' ? 'move' : 'cross');
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'cross' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="X 마커"
                  >
                    <X weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'triangle' ? 'move' : 'triangle');
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'triangle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="삼각형 마커"
                  >
                    <Triangle weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'square' ? 'move' : 'square');
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'square' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="사각형 마커"
                  >
                    <Square weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'circle' ? 'move' : 'circle');
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'circle' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="원형 마커"
                  >
                    <Circle weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'letter' ? 'move' : 'letter'); 
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'letter' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="알파벳 마커"
                  >
                    <TextAUnderline weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      onSelectTool?.(selectedTool === 'number' ? 'move' : 'number');
                      setShowMarkerModal(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full cursor-pointer ${selectedTool === 'number' ? 'bg-gray-100 text-black font-bold' : 'hover:bg-gray-100 text-black'}`}
                    title="숫자 마커"
                  >
                    <NumberOne weight="bold" size={viewportState.isMobile ? 15 : 18} />
                  </button>
                </div>
                
                {/* 화살표 - 모바일에서는 위치 조정 */}
                {!viewportState.isMobile && (
                  <div className="w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200 absolute -bottom-2 left-1/2 -translate-x-1/2"></div>
                )}
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
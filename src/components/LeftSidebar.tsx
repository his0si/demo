"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon, 
  DocumentIcon,
  CalendarIcon,
  FolderIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export interface SGFFile {
  id: string;
  name: string;
  openedAt: string;
  createdAt: string;
  favorite?: boolean;
  thumbnail?: string;
}

export default function LeftSidebar({
  recentFiles,
  onFileClick,
  onToggleFavorite,
  isCollapsed,
  onToggle,
  currentFileId,
}: {
  recentFiles: SGFFile[];
  onFileClick: (file: SGFFile) => void;
  onToggleFavorite?: (file: SGFFile) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  currentFileId?: string;
}) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = React.useState<'recent' | 'favorite'>('recent');
  
  // 즐겨찾기 목록
  const favoriteFiles = recentFiles.filter(file => file.favorite);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 사용 시간 상대적 표시 (예: "3일 전", "방금 전")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes === 0) {
          return '방금 전';
        }
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    }
    
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    
    if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks}주 전`;
    }
    
    return formatDate(dateString);
  };

  return (
    <motion.aside 
      className={`${isCollapsed ? 'w-16' : 'w-72'} p-4 border-r bg-gray-50 flex flex-col min-h-screen transition-all duration-300`}
      initial={false}
    >
      {isCollapsed ? (
        // 축소된 상태 - 수직 중앙정렬
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
            aria-label="펼치기"
          >
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          {status === "authenticated" && session?.user && (
            <div className="relative">
              <Image
                src={session.user.image || '/images/default_profile.png'}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-white shadow-sm"
              />
            </div>
          )}
          
          {/* 접힌 상태에서도 아이콘 표시 */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <DocumentIcon className="w-6 h-6 text-blue-500" />
            <StarIcon className="w-6 h-6 text-yellow-400" />
            <FolderIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      ) : (
        // 확장된 상태 - 개선된 레이아웃
        <>
          <div className="flex justify-between items-center mb-6">
            {/* 제목 자리에 프로필을 위치시킴 */}
            {status === "authenticated" && session?.user ? (
              <div className="flex items-center flex-1">
                <div className="relative">
                  <Image
                    src={session.user.image || '/images/default_profile.png'}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                </div>
                <div className="ml-3 max-w-[150px]">
                  <h3 className="font-semibold text-gray-800 truncate">{session.user.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 text-gray-500 text-sm">로그인이 필요합니다</div>
            )}
            
            <button
              onClick={onToggle}
              className="hover:bg-gray-200 rounded-full transition-colors p-1.5"
              aria-label="사이드바 접기"
            >
              <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="border-b mb-6"></div>

          {/* 탭 네비게이션 */}
          <div className="flex mb-4 border-b">
            <button 
              className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('recent')}
            >
              최근 파일
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'favorite' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('favorite')}
            >
              즐겨찾기
              <span className="ml-1.5 bg-gray-200 text-gray-700 px-1.5 py-0.5 text-xs rounded-full">
                {favoriteFiles.length}
              </span>
            </button>
          </div>

          {/* SGF 파일 목록 - 개선된 디자인 */}
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'recent' ? '내 SGF 파일' : '즐겨찾기'}
              </h3>
              <span className="text-xs text-gray-400">
                {activeTab === 'recent' ? recentFiles.length : favoriteFiles.length}개 파일
              </span>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-grow">
              <div className="overflow-y-auto h-[calc(100vh-220px)] custom-scrollbar">
                {(activeTab === 'recent' ? recentFiles : favoriteFiles).length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {(activeTab === 'recent' ? recentFiles : favoriteFiles).map((file) => (
                      <li
                        key={file.id}
                        className={`hover:bg-blue-50 transition-colors cursor-pointer ${currentFileId === file.id ? 'bg-blue-100' : ''}`}
                      >
                        <div className="p-3">
                          <div className="flex items-center mb-1.5">
                            <DocumentIcon className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                            <div 
                              className="flex-grow min-w-0"
                              onClick={() => onFileClick(file)}
                            >
                              <div className="font-medium text-gray-800 truncate">{file.name}</div>
                            </div>
                            {/* 즐겨찾기 토글 버튼 */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleFavorite) {
                                  onToggleFavorite(file);
                                }
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <StarIcon 
                                className={`w-5 h-5 ${file.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                              />
                            </button>
                          </div>
                          <div className="pl-9 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
                              <span>등록일: {formatDate(file.createdAt)}</span>
                            </div>
                            <div className="text-gray-400">
                              {getRelativeTime(file.openedAt)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center">
                    <DocumentIcon className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      {activeTab === 'recent' ? '등록된 파일이 없습니다' : '즐겨찾기한 파일이 없습니다'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </motion.aside>
  );
}
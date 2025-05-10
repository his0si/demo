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
  createdAt: string; // 등록한 날짜 추가
  favorite?: boolean; // 즐겨찾기 여부
  thumbnail?: string; // 썸네일 이미지 경로
}

// 임시 데이터 (createdAt 추가)
const sampleSGFFiles: SGFFile[] = [
  { 
    id: '1', 
    name: '알파고 vs 이세돌 1국', 
    openedAt: '2025-05-08T10:30:00Z',
    createdAt: '2025-04-15T08:20:00Z',
    favorite: true,
    thumbnail: '/images/sgf_thumbnails/alphago_1.png'
  },
  { 
    id: '2', 
    name: '알파고 vs 이세돌 2국', 
    openedAt: '2025-05-07T14:20:00Z',
    createdAt: '2025-04-16T09:30:00Z',
    thumbnail: '/images/sgf_thumbnails/alphago_2.png'
  },
  { 
    id: '3', 
    name: '신진서 vs 이야마 9단', 
    openedAt: '2025-05-06T09:15:00Z',
    createdAt: '2025-05-01T15:40:00Z',
    favorite: true
  },
  { 
    id: '4', 
    name: '내 첫 대국', 
    openedAt: '2025-05-05T17:45:00Z',
    createdAt: '2025-05-02T11:25:00Z'
  },
  { 
    id: '5', 
    name: '바둑 강의 예제', 
    openedAt: '2025-05-04T11:10:00Z',
    createdAt: '2025-05-03T16:50:00Z'
  },
  { 
    id: '6', 
    name: '프로 기사의 정석 응용', 
    openedAt: '2025-05-02T13:20:00Z',
    createdAt: '2025-04-20T09:15:00Z'
  },
  { 
    id: '7', 
    name: '바둑 초보를 위한 가이드', 
    openedAt: '2025-04-30T16:40:00Z',
    createdAt: '2025-04-25T14:30:00Z'
  },
  { 
    id: '8', 
    name: '이창호 9단의 명국 해설', 
    openedAt: '2025-04-28T09:30:00Z',
    createdAt: '2025-04-10T13:45:00Z',
    favorite: true
  },
  { 
    id: '9', 
    name: '박정환 9단 vs 커제 9단', 
    openedAt: '2025-04-25T14:15:00Z',
    createdAt: '2025-03-20T10:30:00Z'
  },
  { 
    id: '10', 
    name: '알파고 자가대국 연구', 
    openedAt: '2025-04-22T11:40:00Z',
    createdAt: '2025-03-15T09:20:00Z',
    favorite: true
  },
  { 
    id: '11', 
    name: '바둑 정석 변화형 모음', 
    openedAt: '2025-04-18T16:50:00Z',
    createdAt: '2025-03-10T14:15:00Z'
  },
  { 
    id: '12', 
    name: '세계 바둑 챔피언십 결승전', 
    openedAt: '2025-04-15T10:25:00Z',
    createdAt: '2025-02-28T08:30:00Z'
  },
  { 
    id: '13', 
    name: '고전 명국 해설집', 
    openedAt: '2025-04-10T13:20:00Z',
    createdAt: '2025-02-20T11:10:00Z',
    favorite: true
  },
  { 
    id: '14', 
    name: '인공지능과 인간의 바둑 차이점 분석', 
    openedAt: '2025-04-05T09:40:00Z',
    createdAt: '2025-02-15T16:30:00Z'
  },
  { 
    id: '15', 
    name: '바둑 포석 전략과 실전', 
    openedAt: '2025-04-01T15:10:00Z',
    createdAt: '2025-01-30T14:20:00Z'
  }
];

export default function LeftSidebar({
  recentFiles = sampleSGFFiles, // 임시 데이터로 기본값 설정
  onFileClick,
  isCollapsed,
  onToggle,
}: {
  recentFiles?: SGFFile[];
  onFileClick: (file: SGFFile) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = React.useState<'recent' | 'favorite'>('recent');

  // 강제로 샘플 파일을 사용하기
  const filesToDisplay = recentFiles && recentFiles.length > 0 ? recentFiles : sampleSGFFiles;
  
  // 즐겨찾기 목록
  const favoriteFiles = filesToDisplay.filter(file => file.favorite);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
                {activeTab === 'recent' ? filesToDisplay.length : favoriteFiles.length}개 파일
              </span>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-grow">
              <div className="overflow-y-auto h-[calc(100vh-220px)] custom-scrollbar">
                {(activeTab === 'recent' ? filesToDisplay : favoriteFiles).length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {(activeTab === 'recent' ? filesToDisplay : favoriteFiles).map((file) => (
                      <li
                        key={file.id}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => onFileClick(file)}
                      >
                        <div className="p-3">
                          <div className="flex items-center mb-1.5">
                            <DocumentIcon className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                            <div className="flex-grow min-w-0">
                              <div className="font-medium text-gray-800 truncate">{file.name}</div>
                            </div>
                            {file.favorite && (
                              <StarIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="pl-9 flex items-center text-xs text-gray-500">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>등록일: {formatDate(file.createdAt)}</span>
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
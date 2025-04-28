"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

export interface SGFFile {
  id: string;
  name: string;
  openedAt: string;
}

export default function LeftSidebar({
  recentFiles,
  onFileClick,
  isCollapsed,
  onToggle,
}: {
  recentFiles: SGFFile[];
  onFileClick: (file: SGFFile) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const { data: session, status } = useSession();

  return (
    <motion.aside 
      className={`${isCollapsed ? 'w-16' : 'w-64'} p-4 border-r bg-gray-100 flex flex-col min-h-screen transition-all duration-300`}
    >
      {isCollapsed ? (
        // 축소된 상태 - 수직 중앙정렬
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
          >
            <ChevronDoubleRightIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          {status === "authenticated" && session.user && (
            <Image
              src={session.user.image || '/images/default_profile.png'}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
      ) : (
        // 확장된 상태 - 기존 레이아웃 유지
        <>
          <button
            onClick={onToggle}
            className="self-end mb-4 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-[20%] border-b pb-2 flex flex-col items-center">
            {status === "authenticated" && session.user ? (
              <>
                <Image
                  src={session.user.image || '/images/default_profile.png'}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full mb-2"
                />
                <h3 className="text-md font-semibold">{session.user.name}</h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500">로그인이 필요합니다</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Recent SGF Files Section */}
      {!isCollapsed && (
        <div className="h-[80%] pt-4 flex flex-col">
          <h3 className="text-md font-semibold mb-2">History</h3>
          <div className="bg-white rounded p-2 shadow-inner overflow-auto flex-grow">
            <ul className="space-y-2">
              {recentFiles.map((file) => (
                <li
                  key={file.id}
                  className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                  onClick={() => onFileClick(file)}
                >
                  <div className="font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(file.openedAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

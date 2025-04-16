"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export interface SGFFile {
  id: string;
  name: string;
  openedAt: string;
}

export default function LeftSidebar({
  recentFiles,
  onFileClick,
}: {
  recentFiles: SGFFile[];
  onFileClick: (file: SGFFile) => void;
}) {
  const { data: session, status } = useSession();

  return (
    <aside className="w-64 p-4 border-r bg-gray-100 flex flex-col min-h-screen">
      {/* Profile Section */}
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

      {/* Recent SGF Files Section */}
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
    </aside>
  );
}

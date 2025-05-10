import { SGFFile } from "@/components/LeftSidebar";

// LocalStorage를 이용한 간단한 SGF 파일 관리 서비스
const SGF_STORAGE_KEY = 'goggle-sgf-files';

export const sgfStorage = {
  // 모든 SGF 파일 목록 가져오기
  getAll: (): SGFFile[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const filesData = localStorage.getItem(SGF_STORAGE_KEY);
      if (!filesData) return [];
      
      const files = JSON.parse(filesData);
      console.log(`스토리지에서 ${files.length}개 SGF 파일 목록 로드됨`);
      return files;
    } catch (error) {
      console.error('SGF 파일 목록을 불러오는 중 오류 발생:', error);
      return [];
    }
  },

  // SGF 파일 내용 가져오기
  getSGFContent: (fileId: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const sgfContent = localStorage.getItem(`sgf-content-${fileId}`);
      return sgfContent;
    } catch (error) {
      console.error('SGF 파일 내용을 불러오는 중 오류 발생:', error);
      return null;
    }
  },

  // SGF 파일 저장하기
  saveSGF: (name: string, content: string, thumbnail?: string): SGFFile => {
    if (typeof window === 'undefined') throw new Error('브라우저 환경이 아닙니다');

    try {
      // 현재 목록 불러오기
      const files = sgfStorage.getAll();
      console.log(`현재 저장된 파일 수: ${files.length}`);
      
      // 새 SGF 파일 정보 생성
      const newFile: SGFFile = {
        id: Date.now().toString(),
        name,
        openedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        favorite: false,
        thumbnail
      };
      
      // 목록에 추가
      const updatedFiles = [newFile, ...files];
      console.log(`업데이트된 파일 수: ${updatedFiles.length}`);
      
      // 목록 및 내용 저장
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      localStorage.setItem(`sgf-content-${newFile.id}`, content);
      
      // 저장 확인 로그
      console.log(`SGF 파일 저장 완료: ${name} (ID: ${newFile.id})`);
      
      // 저장 이벤트를 강제로 발생시켜 다른 컴포넌트에서도 변경 감지
      window.dispatchEvent(new StorageEvent('storage', {
        key: SGF_STORAGE_KEY,
        newValue: JSON.stringify(updatedFiles)
      }));
      
      return newFile;
    } catch (error) {
      console.error('SGF 파일 저장 중 오류 발생:', error);
      throw error;
    }
  },

  // 최근 열어본 시간 업데이트
  updateOpenedTime: (fileId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const files = sgfStorage.getAll();
      const updatedFiles = files.map(file => {
        if (file.id === fileId) {
          return { ...file, openedAt: new Date().toISOString() };
        }
        return file;
      });
      
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      
      // 저장 이벤트를 강제로 발생시킴
      window.dispatchEvent(new StorageEvent('storage', {
        key: SGF_STORAGE_KEY,
        newValue: JSON.stringify(updatedFiles)
      }));
    } catch (error) {
      console.error('열어본 시간 업데이트 중 오류 발생:', error);
    }
  },

  // 즐겨찾기 토글
  toggleFavorite: (fileId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const files = sgfStorage.getAll();
      const updatedFiles = files.map(file => {
        if (file.id === fileId) {
          return { ...file, favorite: !file.favorite };
        }
        return file;
      });
      
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      
      // 저장 이벤트를 강제로 발생시킴
      window.dispatchEvent(new StorageEvent('storage', {
        key: SGF_STORAGE_KEY,
        newValue: JSON.stringify(updatedFiles)
      }));
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류 발생:', error);
    }
  },

  // SGF 파일 삭제
  deleteSGF: (fileId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const files = sgfStorage.getAll();
      const updatedFiles = files.filter(file => file.id !== fileId);
      
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      localStorage.removeItem(`sgf-content-${fileId}`);
      
      // 저장 이벤트를 강제로 발생시킴
      window.dispatchEvent(new StorageEvent('storage', {
        key: SGF_STORAGE_KEY,
        newValue: JSON.stringify(updatedFiles)
      }));
    } catch (error) {
      console.error('SGF 파일 삭제 중 오류 발생:', error);
    }
  }
};
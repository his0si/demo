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
      
      // 파일명 중복 검사 및 처리
      let uniqueName = name;
      let counter = 1;
      
      // 동일한 이름의 파일이 있는지 확인하고, 있다면 이름 뒤에 숫자 추가
      while (files.some(file => file.name === uniqueName)) {
        const nameParts = name.split('.');
        const ext = nameParts.pop() || '';
        const baseName = nameParts.join('.');
        uniqueName = `${baseName} (${counter}).${ext}`;
        counter++;
      }
      
      // 새 SGF 파일 정보 생성
      const newFile: SGFFile = {
        id: Date.now().toString(),
        name: uniqueName, // 중복 검사 후 고유한 이름 사용
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
      console.log(`SGF 파일 저장 완료: ${uniqueName} (ID: ${newFile.id})`);
      
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

  // 분석된 SGF 파일로 저장
  saveSGFWithAnalysis: (name: string, content: string, highlights: HighlightData[], thumbnail?: string): SGFFile => {
    if (typeof window === 'undefined') throw new Error('브라우저 환경이 아닙니다');

    try {
      // 현재 목록 불러오기
      const files = sgfStorage.getAll();
      
      // 파일명 처리
      let uniqueName = name;
      let counter = 1;

      while (files.some(file => file.name === uniqueName)) {
        const nameParts = name.split('.');
        const ext = nameParts.pop() || '';
        const baseName = nameParts.join('.');
        uniqueName = `${baseName} (${counter}).${ext}`;
        counter++;
      }
      
      // 새 SGF 파일 정보 생성 with 분석 플래그
      const newFile: SGFFile = {
        id: Date.now().toString(),
        name: uniqueName,
        openedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        favorite: false,
        thumbnail,
        isAnalyzed: true, // 분석 완료 표시
        highlights: highlights // 하이라이트 데이터 저장
      };
      
      // 목록에 추가
      const updatedFiles = [newFile, ...files];
      
      // 목록 및 내용 저장
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      localStorage.setItem(`sgf-content-${newFile.id}`, content);
      
      // 하이라이트 데이터 저장
      if (highlights && highlights.length > 0) {
        localStorage.setItem(`highlights-${newFile.id}`, JSON.stringify(highlights));
      }
      
      // 이벤트 발생
      window.dispatchEvent(new StorageEvent('storage', {
        key: SGF_STORAGE_KEY,
        newValue: JSON.stringify(updatedFiles)
      }));
      
      return newFile;
    } catch (error) {
      console.error('분석된 SGF 파일 저장 중 오류 발생:', error);
      throw error;
    }
  },

  // 하이라이트 데이터 가져오기
  getHighlights: (fileId: string): HighlightData[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const highlightsData = localStorage.getItem(`highlights-${fileId}`);
      if (!highlightsData) return [];
      
      return JSON.parse(highlightsData);
    } catch (error) {
      console.error('하이라이트 데이터 로드 중 오류:', error);
      return [];
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

  // SGF 파일 삭제 - 개선된 버전
  deleteSGF: (fileId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      console.log(`SGF 파일 삭제 시작: ID ${fileId}`);
      
      // 파일 존재 여부 확인
      const fileContent = localStorage.getItem(`sgf-content-${fileId}`);
      if (!fileContent) {
        console.warn(`파일 내용이 존재하지 않음: ID ${fileId}`);
      }
      
      const files = sgfStorage.getAll();
      const fileToDelete = files.find(file => file.id === fileId);
      
      if (!fileToDelete) {
        console.warn(`삭제할 파일 정보를 찾을 수 없음: ID ${fileId}`);
        return false;
      }
      
      console.log(`삭제 대상 파일: ${fileToDelete.name} (ID: ${fileId})`);
      
      // 목록에서 파일 제거
      const updatedFiles = files.filter(file => file.id !== fileId);
      
      // 업데이트된 목록 저장
      localStorage.setItem(SGF_STORAGE_KEY, JSON.stringify(updatedFiles));
      
      // 파일 내용 삭제
      localStorage.removeItem(`sgf-content-${fileId}`);
      
      console.log(`파일 삭제 완료: ID ${fileId}, 남은 파일 수: ${updatedFiles.length}`);
      
      // 저장 이벤트를 강제로 발생시킴 (같은 탭에서 감지하기 위함)
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: SGF_STORAGE_KEY,
          newValue: JSON.stringify(updatedFiles)
        }));
      } catch (e) {
        console.warn('저장 이벤트 발생 중 오류:', e);
        // 이벤트 발생 실패해도 계속 진행
      }
      
      return true;
    } catch (error) {
      console.error('SGF 파일 삭제 중 오류 발생:', error);
      return false;
    }
  }
};
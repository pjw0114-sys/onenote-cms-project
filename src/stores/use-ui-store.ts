import { create } from "zustand";

// 전역 클라이언트 상태(Zustand) 최소 예제.
// 서버 상태(TanStack Query)와 분리해, 서버와 무관한 순수 UI 설정을 담는다.
type UiState = {
  isCompact: boolean;
  toggleCompact: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCompact: false,
  toggleCompact: () => set((state) => ({ isCompact: !state.isCompact })),
}));

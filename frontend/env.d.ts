/// <reference types="vite/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

declare module '@/stores/auth' {
  export function useAuthStore(): any
}

declare module '@/stores/ranking' {
  export function useRankingStore(): any
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 資料保持新鮮的時間 (5分鐘)
      staleTime: 5 * 60 * 1000,
      // 垃圾回收時間 (10分鐘)
      gcTime: 10 * 60 * 1000,
      // 窗口重新獲得焦點時重新驗證
      refetchOnWindowFocus: false,
      // 重新連接時重新驗證
      refetchOnReconnect: true,
      retry: 2,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

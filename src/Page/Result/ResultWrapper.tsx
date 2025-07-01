// 🎭 Result 頁面 - 包含 Suspense 和 Error Boundary 的完整版本

import { Suspense } from "react";
import { ErrorBoundary } from "../../components/SimpleErrorBoundary";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import ResultSuspense from "./Result";

export default function ResultWithSuspense() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <ResultSuspense />
      </Suspense>
    </ErrorBoundary>
  );
}

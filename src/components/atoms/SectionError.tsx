import { Button } from "./Button";

export interface SectionErrorProps {
  message: string;
  onRetry: () => void;
  onReportIssue: () => void;
  isRetrying?: boolean;
}

export const SectionError = ({
  message,
  onRetry,
  onReportIssue,
  isRetrying = false,
}: SectionErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            size="sm"
            variant="outline"
            className="bg-white hover:bg-red-50 border-red-300 text-red-700"
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
          <Button
            onClick={onReportIssue}
            disabled={isRetrying}
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  );
};


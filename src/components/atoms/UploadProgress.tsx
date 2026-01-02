"use client";

import { UPLOAD_STATUS } from "@/constants/ui";

export type UploadStage = 'uploading' | 'analyzing' | 'processing' | 'complete';

export interface UploadProgressProps {
    stage: UploadStage;
    progress: number; // 0-100
    fileName?: string;
}

const getStatusMessage = (stage: UploadStage): string => {
    switch (stage) {
        case 'uploading':
            return UPLOAD_STATUS.UPLOADING;
        case 'analyzing':
            return UPLOAD_STATUS.ANALYZING;
        case 'processing':
            return UPLOAD_STATUS.PROCESSING;
        case 'complete':
            return UPLOAD_STATUS.COMPLETE;
        default:
            return UPLOAD_STATUS.UPLOADING;
    }
};

export const UploadProgress = ({
    stage,
    progress,
    fileName,
}: UploadProgressProps) => {
    const statusMessage = getStatusMessage(stage);
    const isComplete = stage === 'complete';

    return (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
                {/* Status Header */}
                <div className="flex items-center gap-3">
                    {isComplete ? (
                        <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900">
                            {statusMessage}
                        </p>
                        {fileName && (
                            <p className="text-xs text-blue-700 truncate mt-0.5">
                                {fileName}
                            </p>
                        )}
                    </div>
                    <span className="text-sm font-semibold text-blue-900">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>

                {/* Stage Description */}
                <p className="text-xs text-blue-700 leading-relaxed">
                    {stage === 'uploading' && 'Uploading your file to the server...'}
                    {stage === 'analyzing' && 'Analyzing video content and extracting frames...'}
                    {stage === 'processing' && 'Processing and preparing for metadata generation...'}
                    {stage === 'complete' && 'File ready for metadata generation!'}
                </p>
            </div>
        </div>
    );
};


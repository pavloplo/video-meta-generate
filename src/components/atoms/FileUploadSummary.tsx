"use client";

import Image from "next/image";
import { UPLOAD_LABELS } from "@/constants/ui";

export interface UploadedFileInfo {
    name: string;
    size: number;
    type: string;
    duration?: number;
    thumbnailUrl?: string;
}

export interface FileUploadSummaryProps {
    file: UploadedFileInfo;
    onReplace: () => void;
    onRemove?: () => void;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const isVideoFile = (type: string): boolean => {
    return type.startsWith('video/');
};

export const FileUploadSummary = ({
    file,
    onReplace,
    onRemove,
}: FileUploadSummaryProps) => {
    const isVideo = isVideoFile(file.type);

    return (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex gap-4">
                {/* Thumbnail/Preview */}
                <div className="shrink-0 w-24 h-24 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                    {file.thumbnailUrl ? (
                        <Image
                            src={file.thumbnailUrl}
                            alt="File preview"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="text-slate-400">
                            {isVideo ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            )}
                        </div>
                    )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate mb-2">
                        {file.name}
                    </p>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-600">
                            <span className="font-medium">{UPLOAD_LABELS.FILE_SIZE}</span>{" "}
                            {formatFileSize(file.size)}
                        </p>
                        {isVideo && file.duration !== undefined && (
                            <p className="text-xs text-slate-600">
                                <span className="font-medium">{UPLOAD_LABELS.VIDEO_DURATION}</span>{" "}
                                {formatDuration(file.duration)}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={onReplace}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            {UPLOAD_LABELS.REPLACE_FILE}
                        </button>
                        {onRemove && (
                            <button
                                onClick={onRemove}
                                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                                {UPLOAD_LABELS.REMOVE_FILE}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


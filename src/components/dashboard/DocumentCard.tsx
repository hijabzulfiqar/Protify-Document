"use client";

import { Document } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Trash2,
  FileImage,
  FileType,
  Calendar,
  HardDrive,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onDownload: (document: Document) => void;
  isDeleting?: boolean;
}

export function DocumentCard({
  document,
  onDelete,
  onDownload,
  isDeleting = false,
}: DocumentCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    if (document.mimeType.startsWith("image/")) {
      return FileImage;
    }
    return FileText;
  };

  const FileIcon = getFileIcon();

  const getCategoryColor = (category: string) => {
    const colors = {
      resume: "bg-blue-50 text-blue-700 border border-blue-200",
      degrees: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      certificates: "bg-purple-50 text-purple-700 border border-purple-200",
      transcripts: "bg-orange-50 text-orange-700 border border-orange-200",
      headshots: "bg-pink-50 text-pink-700 border border-pink-200",
      others: "bg-gray-50 text-gray-700 border border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.others;
  };

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-gray-50 group-hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0">
          <FileIcon className="h-5 w-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate mb-2 leading-tight">
            {document.originalName}
          </h3>
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize",
              getCategoryColor(document.category)
            )}
          >
            {document.category}
          </span>
        </div>
      </div>

      {/* File Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <HardDrive className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {formatFileSize(document.fileSize)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FileType className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {document.mimeType.split("/")[1]?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {format(new Date(document.uploadedAt), "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onDownload(document)}
          size="sm"
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Download className="h-3 w-3 mr-1.5" />
          <span className="truncate">Download</span>
        </Button>
        <Button
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className={cn("h-3 w-3", isDeleting && "animate-pulse")} />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Spinner } from "@/components/ui/spinner";
import { documentCategories } from "@/lib/config";
import { ChevronDown } from "lucide-react";

// Ensure documentCategories is properly typed
const categoryValues = documentCategories as readonly [string, ...string[]];

const uploadSchema = z.object({
  category: z.enum(categoryValues, {
    message: "Please select a document category",
  }),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { apiCall } = useApi();
  const { addToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", data.category);

        await apiCall({
          method: "POST",
          url: "/api/documents/upload",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        successCount++;
      } catch (error: any) {
        console.error(`Upload failed for ${file.name}:`, error);
        errorCount++;

        // Show error toast for each failed file
        addToast({
          type: "error",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${
            error?.response?.data?.message || error?.message || "Upload failed"
          }`,
          duration: 7000,
        });
      }
    }

    setIsUploading(false);

    // Show success toast if any files uploaded successfully
    if (successCount > 0) {
      addToast({
        type: "success",
        title: "Upload Successful",
        description: `${successCount} file${
          successCount !== 1 ? "s" : ""
        } uploaded successfully`,
        duration: 5000,
      });

      setSelectedFiles([]);
      reset();

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Document Category
          </label>
          <div className="relative">
            <select
              id="category"
              {...register("category")}
              className="w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 
                       hover:border-gray-400 dark:hover:border-gray-500 
                       focus:border-gray-500 dark:focus:border-gray-400 
                       bg-white dark:bg-black text-gray-900 dark:text-white 
                       px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-opacity-50 
                       transition-all duration-200"
            >
              <option
                value=""
                className="bg-white dark:bg-black text-gray-900 dark:text-white"
              >
                Select a category...
              </option>
              {documentCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-white dark:bg-black text-gray-900 dark:text-white"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.category && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Select Files
          </label>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            disabled={isUploading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isUploading || selectedFiles.length === 0}
            className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 
                     text-white transition-all duration-200 shadow-sm hover:shadow-md
                     disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>
                  Uploading {selectedFiles.length} file
                  {selectedFiles.length !== 1 ? "s" : ""}...
                </span>
              </div>
            ) : (
              `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ""} ${
                selectedFiles.length === 1 ? "File" : "Files"
              }`
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                     border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 
                     text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                     transition-all duration-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

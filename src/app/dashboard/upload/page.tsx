"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UploadForm } from "@/components/dashboard/UploadForm";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          {/* Upload Form Card */}
          <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Upload className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900">
                    Document Upload
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select files to upload and organize
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <UploadForm />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

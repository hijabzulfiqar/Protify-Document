"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { Document } from "@/types";
import {
  Upload,
  FileText,
  TrendingUp,
  HardDrive,
  Plus,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { apiCall } = useApi();

  // Fetch documents for stats calculation
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiCall({
        method: "GET",
        url: "/api/documents/list",
      });
      setDocuments(response.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle documents change (called when documents are added/deleted)
  const handleDocumentsChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  // Refresh data when page becomes visible (e.g., returning from upload page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDocuments();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Calculate stats
  const calculateStats = () => {
    const totalDocuments = documents.length;

    // Documents uploaded this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthDocuments = documents.filter((doc) => {
      const docDate = new Date(doc.uploadedAt);
      return (
        docDate.getMonth() === currentMonth &&
        docDate.getFullYear() === currentYear
      );
    }).length;

    // Total storage used
    const totalStorage = documents.reduce(
      (total, doc) => total + doc.fileSize,
      0
    );
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 MB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return {
      totalDocuments,
      thisMonthDocuments,
      totalStorage: formatFileSize(totalStorage),
    };
  };

  const stats = calculateStats();

  const statsCards = [
    {
      title: "Documents",
      value: loading ? "..." : stats.totalDocuments.toString(),
      icon: FileText,
      color: "text-gray-600",
    },
    {
      title: "This Month",
      value: loading ? "..." : stats.thisMonthDocuments.toString(),
      icon: TrendingUp,
      color: "text-gray-600",
    },
    {
      title: "Storage",
      value: loading ? "..." : stats.totalStorage,
      icon: HardDrive,
      color: "text-gray-600",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage your documents</p>
            </div>
            <Link href="/dashboard/upload">
              <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsCards.map((stat) => (
              <div
                key={stat.title}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 sm:p-5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Documents
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <DocumentList
                refreshTrigger={refreshTrigger}
                onDocumentsChange={handleDocumentsChange}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

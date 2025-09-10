"use client";

import { useState, useEffect } from "react";
import { Document } from "@/types";
import { useApi } from "@/hooks/useApi";
import { DocumentCard } from "./DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { documentCategories } from "@/lib/config";
import { Search, FolderOpen, RefreshCw, Plus, ChevronDown } from "lucide-react";

interface DocumentListProps {
  refreshTrigger?: number;
  onDocumentsChange?: () => void;
}

export function DocumentList({
  refreshTrigger,
  onDocumentsChange,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    document: Document | null;
  }>({ isOpen: false, document: null });
  const { apiCall } = useApi();

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

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await apiCall({
        method: "DELETE",
        url: `/api/documents/delete?id=${id}`,
      });
      setDocuments(documents.filter((doc) => doc.id !== id));
      setDeleteModal({ isOpen: false, document: null });
      // Notify parent component that documents have changed
      if (onDocumentsChange) {
        onDocumentsChange();
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    const document = documents.find((doc) => doc.id === id);
    if (document) {
      setDeleteModal({ isOpen: true, document });
    }
  };

  const handleCloseModal = () => {
    if (!deletingId) {
      setDeleteModal({ isOpen: false, document: null });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteModal.document) {
      handleDelete(deleteModal.document.id);
    }
  };

  const handleDownload = (document: Document) => {
    window.open(document.fileUrl, "_blank");
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.originalName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 hover:border-gray-300 focus:border-gray-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none rounded-md bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-200 min-w-[140px] cursor-pointer"
            >
              <option value="all" className="bg-gray-900 text-white">
                All Categories
              </option>
              {documentCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-gray-900 text-white"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
          </div>

          <Button
            onClick={fetchDocuments}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Summary and Clear Filters */}
      {documents.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-500">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
          {(searchTerm || selectedCategory !== "all") && (
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 self-start sm:self-auto"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Documents Grid or Empty State */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16 px-4">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {documents.length === 0 ? "No documents yet" : "No documents found"}
          </h3>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            {documents.length === 0
              ? "Upload your first document to get started with organizing your files"
              : "Try adjusting your search terms or filters to find what you're looking for"}
          </p>
          {documents.length === 0 && (
            <Button
              onClick={() => (window.location.href = "/dashboard/upload")}
              className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteClick}
              onDownload={handleDownload}
              isDeleting={deletingId === document.id}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteModal.document?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={!!deletingId}
        variant="danger"
      />
    </div>
  );
}

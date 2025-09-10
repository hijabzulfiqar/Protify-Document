"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  User,
  LogOut,
  Menu,
  X,
  FolderOpen,
  MoreHorizontal,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setUserMenuOpen(false);

    // Immediate redirect before auth state changes
    window.location.replace("/auth/login");

    // Clean up auth state after redirect starts
    setTimeout(() => {
      logout();
    }, 0);
  };

  // Click outside handler using useEffect instead of overlay
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuOpen &&
        !(event.target as Element)?.closest(".user-menu-container")
      ) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const navigation = [
    { name: "Documents", href: "/dashboard", icon: FolderOpen },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl border-r border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">
                  Portify
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-xl  hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group ${
                      pathname === item.href
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile User section - Fixed positioning */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
              <div className="relative user-menu-container">
                <div
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <MoreHorizontal
                    className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
                      userMenuOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {/* Mobile Dropdown Menu - Fixed positioning to stay within sidebar */}
                {userMenuOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200/60 py-1 backdrop-blur-sm z-[60]">
                    <button
                      onClick={(e) => handleLogout(e)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-100 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 h-16 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                Portify
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-xl hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group ${
                    pathname === item.href
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors  ${
                      pathname === item.href
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop User section - Fixed to bottom */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="relative user-menu-container">
              <div
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <MoreHorizontal
                  className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
                    userMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </div>

              {/* Desktop Dropdown Menu - Properly contained */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200/60 py-1 backdrop-blur-sm z-[60]">
                  <button
                    onClick={(e) => handleLogout(e)}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700  hover:text-gray-900 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="lg:hidden sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                  <FileText className="h-3 w-3 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Portify</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}

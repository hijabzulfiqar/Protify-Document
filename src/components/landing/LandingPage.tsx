"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Upload,
  Search,
  Zap,
  Users,
  ArrowRight,
  Globe,
  Lock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { MagicCard } from "@/components/ui/magic-card";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { RetroGrid } from "@/components/ui/retro-grid";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import NumberTicker from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import WordRotate from "@/components/ui/magic/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";

const features = [
  {
    className: "md:col-span-2",
    title: "Smart Document Organization",
    description:
      "AI-powered categorization automatically sorts your academic documents by type, subject, and importance.",
    header: (
      <div className="h-full min-h-[6rem] w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <FileText className="h-12 w-12 text-white" />
      </div>
    ),
    icon: <FileText className="h-6 w-6 text-gray-700" />,
  },
  {
    className: "md:col-span-1",
    title: "Bank-Level Security",
    description:
      "End-to-end encryption protects your sensitive academic records.",
    header: (
      <div className="h-full min-h-[6rem] w-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
        <Shield className="h-12 w-12 text-white" />
      </div>
    ),
    icon: <Shield className="h-6 w-6 text-gray-700" />,
  },
  {
    className: "md:col-span-1",
    title: "Instant Upload",
    description: "Drag, drop, and go. Process multiple documents in seconds.",
    header: (
      <div className="h-full min-h-[6rem] w-full bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
        <Upload className="h-12 w-12 text-white" />
      </div>
    ),
    icon: <Upload className="h-6 w-6 text-gray-700" />,
  },
  {
    className: "md:col-span-2",
    title: "Lightning-Fast Search",
    description:
      "Find any document instantly with our advanced search engine that understands context and content.",
    header: (
      <div className="h-full min-h-[6rem] w-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
        <Search className="h-12 w-12 text-white" />
      </div>
    ),
    icon: <Search className="h-6 w-6 text-gray-700" />,
  },
];

const stats = [
  { number: 12000, label: "Students Worldwide" },
  { number: 250000, label: "Documents Secured" },
  { number: 99.9, label: "Uptime %" },
  { number: 24, label: "Hour Support" },
];

export function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gray-900 rounded-lg blur opacity-10" />
            <div className="relative bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
            </div>
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            Portify
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            asChild
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all duration-200 text-sm sm:text-base px-3 sm:px-4"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-gray-900 hover:bg-gray-800 text-white border-0 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
          >
            <Link href="/auth/register">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-8 sm:pt-16 pb-16 sm:pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <DotPattern
            className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] opacity-100"
            cr={1}
            cx={4}
            cy={4}
          />
          {/* Subtle gradient overlays */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden sm:inline">
                Trusted by 12,000+ students worldwide
              </span>
              <span className="sm:hidden">12k+ students trust us</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
              >
                Document management on{" "}
                <WordRotate
                  words={["autopilot", "steroids", "demand", "the cloud"]}
                  duration={2500}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                The secure platform for students to store, organize, and access
                their academic documents anywhere, anytime.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4"
            >
              <ShimmerButton
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white border-gray-800 rounded-lg font-medium transition-all duration-200 [&>*]:text-white"
                onClick={() => router.push("/auth/register")}
              >
                <span className="text-white">Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </ShimmerButton>

              <Button
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200"
                asChild
              >
                <Link href="/auth/login">Schedule Demo</Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-8 sm:pt-12 space-y-4"
            >
              <p className="text-xs sm:text-sm text-gray-500">
                Trusted by students at
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40">
                <div className="text-lg sm:text-xl font-bold text-gray-400">
                  MIT
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-400">
                  Stanford
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-400">
                  Harvard
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-400">
                  Berkeley
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-400">
                  CMU
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for students to manage their academic
              documents with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-12 h-12 rounded-lg bg-gray-900/5 border border-gray-200 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 rounded-2xl border border-gray-200/60 shadow-sm" />
            <div className="relative p-8 sm:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Ready to get started?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                Join thousands of students who have secured their academic
                future with Portify.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <ShimmerButton
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white border-gray-800 rounded-lg font-medium transition-all duration-200 [&>*]:text-white"
                  onClick={() => router.push("/auth/register")}
                >
                  <span className="text-white">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </ShimmerButton>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all duration-200"
                >
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gray-900 rounded-lg blur opacity-10" />
                <div className="relative bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-900" />
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">Portify</span>
            </div>

            <div className="text-sm text-gray-600 font-medium order-3 md:order-2">
              © 2024 Portify. All rights reserved. Built for students, by
              students.
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 order-2 md:order-3">
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

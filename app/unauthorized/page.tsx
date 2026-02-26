"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft, Lock, Mail } from "lucide-react";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Shield Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-red-200 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-white animate-bounce" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg border-2 border-red-200">
            <Lock className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Error 403
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            You don't have permission to access this page. This area is restricted to authorized personnel only.
          </p>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          {/* <Link href="/" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <Home className="w-5 h-5" />
              Go to Home
            </button>
          </Link> */}

          {/* <a href="mailto:support@campushub.com" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-orange-200 text-orange-700 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-sm">
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
          </a> */}
        </div>

        {/* Help Text */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100 p-6">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Need access?</strong>
          </p>
          <p className="text-sm text-gray-600">
            If you believe you should have access to this page, please contact your administrator or reach out to our support team for assistance.
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
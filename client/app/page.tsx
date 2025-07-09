'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import GeneratedContent from '@/components/GeneratedContent';
import Chatbot from '@/components/Chatbot';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">BrainStarta</h1>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
          </button>
        </div>

        {/* Generated Content */}
        <div className="flex-1 overflow-hidden">
          <GeneratedContent />
        </div>

        {/* Desktop Chatbot */}
        <div className="hidden lg:flex">
          <Chatbot />
        </div>

        {/* Mobile Chatbot */}
        {isChatOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-40">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full">
              <Chatbot />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
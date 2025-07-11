'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import GeneratedContent from '@/components/GeneratedContent';
import Chatbot from '@/components/Chatbot';
import { Menu, X } from 'lucide-react';
import LearningDemo from '@/components/resources/LearningDemo';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-y-auto">
      {/* Main Content */}
        <div className="w-full">
          <LearningDemo/>
        </div>
        {/* Desktop Chatbot */}
          <Chatbot />
    </div>
  );
}
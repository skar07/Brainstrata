'use client';

import React, { useState } from 'react';
import MindMap from '../../components/MindMap';
import AddTopicModal from '../../components/AddTopicModal';
import { Plus } from 'lucide-react';

export default function MindMapPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Mind Map Container */}
        
      </div>
    </div>
  );
} 
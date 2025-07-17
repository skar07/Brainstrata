'use client';

import { X } from 'lucide-react';
import ReactDOM from 'react-dom';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAnalysis?: string | null;
}

export default function ImageModal({ isOpen, onClose, imageUrl, imageAnalysis }: ImageModalProps) {
  if (!isOpen || typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute -top-12 right-0 text-white bg-black/60 p-3 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
          onClick={onClose}
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Full size preview"
          className="max-h-[85vh] w-auto rounded-lg shadow-2xl border-2 border-white/20"
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>,
    document.body
  );
} 
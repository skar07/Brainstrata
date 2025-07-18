import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadBoxProps {
  uploadedImage: string | null;
  imageAnalysis: string | null;
  handleImageUpload: (file: File) => void;
  setUploadedImage: (img: string | null) => void;
  setImageAnalysis: (analysis: string | null) => void;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  uploadedImage,
  imageAnalysis,
  handleImageUpload,
  setUploadedImage,
  setImageAnalysis,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="space-y-3">
      {!uploadedImage ? (
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-dashed border-purple-300/30 rounded-xl cursor-pointer hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-300/50 transition-all duration-300 group-hover:scale-[1.02]"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-300 font-medium">Upload Image</p>
              <p className="text-xs text-white/40">Click or drag to upload</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative group">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-24 object-cover rounded-xl border border-white/20 group-hover:border-purple-300/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowPreview(true)}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUploadedImage(null);
                setImageAnalysis(null);
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500/90 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-500 hover:scale-110 transition-all duration-200 shadow-lg z-10"
              title="Remove image"
            >
              ×
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Fullscreen Preview Overlay */}
            {showPreview && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-w-full max-h-full rounded-xl shadow-2xl border-4 border-white/10"
                  style={{ objectFit: 'contain' }}
                />
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-6 right-8 text-white text-4xl font-bold bg-black/60 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-all z-50"
                  title="Close preview"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {imageAnalysis && (
            <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-300/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-300 font-semibold">Image Analyzed</p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{imageAnalysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadBox; 
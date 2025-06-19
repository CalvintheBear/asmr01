'use client'

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage: File | null;
  disabled?: boolean;
}

export default function ImageUploader({ 
  onImageSelect, 
  onImageRemove, 
  selectedImage, 
  disabled = false 
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('请选择有效的图片文件');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onImageRemove();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {selectedImage && previewUrl ? (
        // 预览模式
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200">
            <img
              src={previewUrl}
              alt="上传的图片"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200">
              <button
                onClick={handleRemove}
                disabled={disabled}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">{selectedImage.name}</p>
            <p className="text-gray-400">
              {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        // 上传模式
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`relative w-full h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
            dragOver
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className={`mb-4 ${dragOver ? 'text-purple-500' : 'text-gray-400'}`}>
              {dragOver ? (
                <Upload className="w-12 h-12" />
              ) : (
                <ImageIcon className="w-12 h-12" />
              )}
            </div>
            <div className="text-center">
              <p className={`text-lg font-medium mb-2 ${
                dragOver ? 'text-purple-700' : 'text-gray-700'
              }`}>
                {dragOver ? '释放以上传图片' : '点击或拖拽上传图片'}
              </p>
              <p className="text-sm text-gray-500">
                支持 JPG, PNG, WebP 格式，最大 10MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
} 
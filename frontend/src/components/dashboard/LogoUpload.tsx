'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  EyeIcon,
  SwatchIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface LogoAnalysis {
  colors: string[];
  style: string;
  hasText: boolean;
  complexity: number;
  recommendedTemplates: string[];
  dimensions: { width: number; height: number };
}

interface LogoUploadProps {
  onUploadComplete?: (logoData?: any) => void;
}

export function LogoUpload({ onUploadComplete }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [logoAnalysis, setLogoAnalysis] = useState<LogoAnalysis | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploading(true);
    setUploadProgress(0);
    setLogoAnalysis(null);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      // Upload the logo
      const response = await api.uploadLogo(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        setUploading(false);
        setAnalyzing(true);

        // Start AI analysis
        toast.success('Logo uploaded! Analyzing...');

        try {
          const analysisResponse = await api.analyzeLogo(response.data.id);
          setLogoAnalysis(analysisResponse.data);
          toast.success('Analysis complete!');
        } catch (analysisError) {
          console.error('Analysis failed:', analysisError);
          toast.error('Analysis failed, but upload was successful');
        } finally {
          setAnalyzing(false);
        }

        queryClient.invalidateQueries({ queryKey: ['logos'] });
        onUploadComplete?.(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setUploadedFile(null);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  }, [queryClient, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setLogoAnalysis(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          uploading && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto h-12 w-12 text-blue-600">
              <CloudArrowUpIcon />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Uploading...</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : analyzing ? (
          <div className="space-y-4">
            <div className="animate-pulse mx-auto h-12 w-12 text-blue-600">
              <CpuChipIcon />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Analyzing Logo...</p>
              <p className="text-sm text-gray-600">Our AI is analyzing your logo</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-6">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
            <div>
              <p className="text-lg font-medium text-gray-900">Upload Complete!</p>
              <p className="text-sm text-gray-600">{uploadedFile.name}</p>
            </div>

            {/* Logo Preview */}
            {previewUrl && (
              <div className="flex justify-center">
                <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* AI Analysis Results */}
            {logoAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-left"
              >
                <div className="flex items-center mb-4">
                  <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Color Palette */}
                  <div>
                    <div className="flex items-center mb-2">
                      <SwatchIcon className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Color Palette</span>
                    </div>
                    <div className="flex space-x-2">
                      {logoAnalysis.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Logo Properties */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        Style: <span className="font-medium">{logoAnalysis.style}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Contains Text: <span className="font-medium">{logoAnalysis.hasText ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Complexity: <span className="font-medium">{logoAnalysis.complexity}/10</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Templates */}
                {logoAnalysis.recommendedTemplates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      🎯 Recommended Template Categories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {logoAnalysis.recommendedTemplates.map((template, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {template}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your logo here' : 'Upload your logo'}
              </p>
              <p className="text-sm text-gray-600">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, SVG up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload Error</h4>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-red-700">
              <p className="font-medium">{file.name}</p>
              <ul className="list-disc list-inside">
                {errors.map((error) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Upload Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use high-resolution images (at least 500x500px)</li>
          <li>• PNG files with transparent backgrounds work best</li>
          <li>• Avoid logos with complex backgrounds</li>
          <li>• Square or rectangular logos are ideal</li>
        </ul>
      </div>

      {/* Action Buttons */}
      {uploadedFile && !uploading && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={removeFile}>
            <XMarkIcon className="h-4 w-4 mr-2" />
            Remove
          </Button>
          <Button onClick={onUploadComplete}>
            Continue to Templates
          </Button>
        </div>
      )}
    </div>
  );
}

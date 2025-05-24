'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface Mockup {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  renderUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  logo: {
    filename: string;
    originalUrl: string;
  };
  template: {
    name: string;
    category: string;
  };
}

interface MockupGridProps {
  mockups: Mockup[];
  loading?: boolean;
  onView?: (mockup: Mockup) => void;
  onDownload?: (mockup: Mockup) => void;
  onDelete?: (mockup: Mockup) => void;
}

export function MockupGrid({ 
  mockups, 
  loading = false, 
  onView, 
  onDownload, 
  onDelete 
}: MockupGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'PROCESSING':
        return <ClockIcon className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'PROCESSING':
        return 'Processing...';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!mockups || mockups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No mockups yet</h3>
        <p className="text-gray-600">Upload a logo and choose a template to create your first mockup.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockups.map((mockup, index) => (
        <motion.div
          key={mockup.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            {mockup.status === 'COMPLETED' && mockup.thumbnailUrl ? (
              <img
                src={mockup.thumbnailUrl}
                alt={`Mockup of ${mockup.logo.filename}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  {getStatusIcon(mockup.status)}
                  <p className="text-sm text-gray-500 mt-2">
                    {getStatusText(mockup.status)}
                  </p>
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mockup.status)}`}>
                {getStatusText(mockup.status)}
              </span>
            </div>

            {/* Overlay with actions */}
            {mockup.status === 'COMPLETED' && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {onView && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(mockup);
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {onDownload && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(mockup);
                      }}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(mockup);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 truncate mb-1">
              {mockup.logo.filename}
            </h3>
            <p className="text-sm text-gray-600 truncate mb-2">
              {mockup.template.name}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="capitalize">{mockup.template.category}</span>
              <span>{new Date(mockup.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

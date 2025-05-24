'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  EyeIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export function RecentMockups() {
  const { user } = useAuth();

  const { data: mockups, isLoading } = useQuery({
    queryKey: ['recent-mockups', user?.id],
    queryFn: async () => {
      const response = await api.get('/mockups?limit=6');
      return response.data.data as Mockup[];
    },
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

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
        return 'Ready';
      case 'PROCESSING':
        return 'Processing...';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Mockups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mockups || mockups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Mockups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mockups yet</h3>
            <p className="text-gray-600 mb-6">Upload a logo and choose a template to create your first mockup.</p>
            <Link href="/templates">
              <Button>Browse Templates</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Mockups</CardTitle>
        <Link href="/mockups">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockups.map((mockup, index) => (
            <motion.div
              key={mockup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                {mockup.status === 'COMPLETED' && mockup.thumbnailUrl ? (
                  <img
                    src={mockup.thumbnailUrl}
                    alt={`Mockup of ${mockup.logo.filename}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      {getStatusIcon(mockup.status)}
                      <p className="text-sm text-gray-600 mt-2">
                        {getStatusText(mockup.status)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with actions */}
                {mockup.status === 'COMPLETED' && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-white text-gray-900">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white text-gray-900">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {mockup.logo.filename}
                </h4>
                <p className="text-xs text-gray-500">
                  {mockup.template.name} • {mockup.template.category}
                </p>
                <div className="flex items-center mt-1">
                  {getStatusIcon(mockup.status)}
                  <span className="text-xs text-gray-500 ml-1">
                    {getStatusText(mockup.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

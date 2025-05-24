'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

export default function MockupsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: mockups, isLoading, refetch } = useQuery({
    queryKey: ['user-mockups', user?.id, statusFilter, sortBy],
    queryFn: async () => {
      const response = await api.get('/mockups', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sortBy
        }
      });
      return response.data.data as Mockup[];
    },
    enabled: !!user,
  });

  const filteredMockups = mockups?.filter(mockup => {
    const matchesSearch = !searchQuery || 
      mockup.logo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockup.template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockup.template.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'PROCESSING':
        return <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'PROCESSING':
        return 'Processing';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const handleDownload = async (mockup: Mockup) => {
    if (mockup.renderUrl) {
      const link = document.createElement('a');
      link.href = mockup.renderUrl;
      link.download = `mockup-${mockup.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async (mockupId: string) => {
    if (confirm('Are you sure you want to delete this mockup?')) {
      try {
        await api.delete(`/mockups/${mockupId}`);
        refetch();
      } catch (error) {
        console.error('Failed to delete mockup:', error);
      }
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to view your mockups.</p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Mockups</h1>
            <p className="text-gray-600 mt-2">
              Manage and download your created mockups
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="mt-4 sm:mt-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Mockup
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search mockups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mockups Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredMockups.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mockups found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Create your first mockup to get started.'}
            </p>
            <Link href="/dashboard">
              <Button>Create Your First Mockup</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMockups.map((mockup, index) => (
              <motion.div
                key={mockup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    {/* Mockup Preview */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                      {mockup.status === 'COMPLETED' && mockup.thumbnailUrl ? (
                        <img
                          src={mockup.thumbnailUrl}
                          alt={`Mockup of ${mockup.logo.filename}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getStatusIcon(mockup.status)}
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          mockup.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          mockup.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          mockup.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(mockup.status)}
                        </span>
                      </div>
                    </div>

                    {/* Mockup Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {mockup.logo.filename}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {mockup.template.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(mockup.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        {mockup.status === 'COMPLETED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(mockup)}
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(mockup.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { LogoUpload } from '@/components/dashboard/LogoUpload';
import { RecentMockups } from '@/components/dashboard/RecentMockups';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';
import { TemplateSelector } from '@/components/dashboard/TemplateSelector';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PhotoIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const { data: logos, isLoading: logosLoading } = useQuery({
    queryKey: ['logos'],
    queryFn: async () => {
      const response = await api.getLogos();
      return response.data;
    },
    enabled: !!user
  });

  const handleLogoSelect = (logoId: string) => {
    setSelectedLogo(logoId);
    setShowTemplates(true);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to access the dashboard.</p>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || 'Creator'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to create some amazing mockups? Let's get started.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Upload & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RocketLaunchIcon className="h-5 w-5 text-blue-600" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Start creating your next mockup in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowUpload(true)}
                    className="h-20 flex-col space-y-2"
                    variant="outline"
                  >
                    <PlusIcon className="h-6 w-6" />
                    <span>Upload New Logo</span>
                  </Button>
                  <Link href="/templates">
                    <Button
                      className="h-20 flex-col space-y-2 w-full"
                      variant="outline"
                    >
                      <PhotoIcon className="h-6 w-6" />
                      <span>Browse Templates</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Logo Upload Modal/Section */}
            {showUpload && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <SparklesIcon className="h-5 w-5 text-purple-600" />
                      <span>Upload Your Logo</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUpload(false)}
                    >
                      ✕
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Upload your logo and we'll analyze it to suggest the best templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogoUpload onUploadComplete={() => setShowUpload(false)} />
                </CardContent>
              </Card>
            )}

            {/* Logo Selection for Template */}
            {!showTemplates && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PhotoIcon className="h-5 w-5 text-green-600" />
                    <span>Your Logos</span>
                  </CardTitle>
                  <CardDescription>
                    Select a logo to create a mockup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {logosLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : logos && logos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {logos.map((logo: any) => (
                        <motion.div
                          key={logo.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLogoSelect(logo.id)}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-blue-300 transition-colors">
                            <img
                              src={logo.originalUrl}
                              alt={logo.filename}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
                            {logo.filename}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(logo.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No logos uploaded yet</p>
                      <Button onClick={() => setShowUpload(true)}>
                        Upload Your First Logo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Template Selector */}
            {showTemplates && selectedLogo && (
              <TemplateSelector
                logoId={selectedLogo}
                onBack={() => {
                  setShowTemplates(false);
                  setSelectedLogo(null);
                }}
              />
            )}

            {/* Recent Mockups */}
            {!showTemplates && <RecentMockups />}
          </div>

          {/* Right Column - Template Preview & Tips */}
          <div className="space-y-6">
            {/* Featured Template */}
            <TemplatePreview />

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">High-quality logos work best</p>
                  <p>Upload PNG files with transparent backgrounds for the best results.</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Try different templates</p>
                  <p>Each logo looks different on various mockups. Experiment to find the perfect match.</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Save your favorites</p>
                  <p>Download mockups you love and use them across your marketing materials.</p>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Card (for free users) */}
            {user.subscriptionTier === 'FREE' && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">
                    🚀 Upgrade to Pro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700 mb-4">
                    Get unlimited mockups, premium templates, and priority processing.
                  </p>
                  <Link href="/subscription">
                    <Button size="sm" className="w-full">
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
}

export function TemplatePreview() {
  const { data: featuredTemplate, isLoading } = useQuery({
    queryKey: ['featured-template'],
    queryFn: async () => {
      const response = await api.get('/templates?featured=true&limit=1');
      return response.data.data[0] as Template;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <span>Featured Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!featuredTemplate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <span>Featured Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No featured template available</p>
            <Link href="/templates">
              <Button variant="outline">Browse All Templates</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <span>Featured Template</span>
          {featuredTemplate.isPremium && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              Pro
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group cursor-pointer"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={featuredTemplate.thumbnailUrl}
              alt={featuredTemplate.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-semibold text-lg mb-1">{featuredTemplate.name}</h3>
              <p className="text-sm text-gray-200 capitalize">{featuredTemplate.category}</p>
            </div>
          </div>
        </motion.div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              {featuredTemplate.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {featuredTemplate.category}
            </p>
            {featuredTemplate.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {featuredTemplate.description}
              </p>
            )}
          </div>
          
          <Link href={`/templates?category=${featuredTemplate.category}`}>
            <Button className="w-full group">
              <span>Explore {featuredTemplate.category}</span>
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

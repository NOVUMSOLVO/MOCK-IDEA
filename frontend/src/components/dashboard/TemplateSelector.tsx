'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { MockupCustomizer } from './MockupCustomizer';

interface TemplateSelectorProps {
  logoId: string;
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  createdAt: string;
}

export function TemplateSelector({ logoId, onBack }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.getTemplates();
      return response.data as Template[];
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.createMockup(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockups'] });
      queryClient.invalidateQueries({ queryKey: ['recent-mockups'] });
      toast.success('Mockup generation started!');
      onBack();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Generation failed');
    }
  });

  const categories = ['all', 'apparel', 'stationery', 'digital', 'packaging', 'business'];

  const filteredTemplates = templates?.filter((template: Template) => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCustomizer(true);
  };

  const handleGenerate = (customizations: any) => {
    generateMutation.mutate({
      logoId,
      templateId: selectedTemplate,
      customizations
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Template
            </h2>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates?.map((template: Template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTemplateSelect(template.id)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Pro
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <AdjustmentsHorizontalIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500">{template.category}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Customizer Modal */}
      <AnimatePresence>
        {showCustomizer && selectedTemplate && (
          <MockupCustomizer
            templateId={selectedTemplate}
            logoId={logoId}
            onGenerate={handleGenerate}
            onClose={() => {
              setShowCustomizer(false);
              setSelectedTemplate(null);
            }}
            isGenerating={generateMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

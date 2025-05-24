'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, SwatchIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface MockupCustomizerProps {
  templateId: string;
  logoId: string;
  onGenerate: (customizations: any) => void;
  onClose: () => void;
  isGenerating: boolean;
}

export function MockupCustomizer({
  templateId,
  logoId,
  onGenerate,
  onClose,
  isGenerating
}: MockupCustomizerProps) {
  const [customizations, setCustomizations] = useState({
    position: { x: 0.5, y: 0.5 },
    scale: 0.3,
    rotation: 0,
    opacity: 1,
    blendMode: 'over',
    tint: '',
    grayscale: false
  });

  const [activeTab, setActiveTab] = useState<'position' | 'effects' | 'advanced'>('position');

  const handleGenerate = () => {
    onGenerate(customizations);
  };

  const updateCustomization = (key: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updatePosition = (axis: 'x' | 'y', value: number) => {
    setCustomizations(prev => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: value
      }
    }));
  };

  const blendModes = [
    'over', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference'
  ];

  const presetPositions = [
    { name: 'Center', x: 0.5, y: 0.5 },
    { name: 'Top Left', x: 0.25, y: 0.25 },
    { name: 'Top Right', x: 0.75, y: 0.25 },
    { name: 'Bottom Left', x: 0.25, y: 0.75 },
    { name: 'Bottom Right', x: 0.75, y: 0.75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Customize Mockup
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Preview Area */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="h-full bg-white rounded-lg shadow-inner flex items-center justify-center">
              <div className="text-center">
                <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Preview</span>
                </div>
                <p className="text-sm text-gray-600">
                  Live preview will appear here
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-80 border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'position', label: 'Position' },
                { id: 'effects', label: 'Effects' },
                { id: 'advanced', label: 'Advanced' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'position' && (
                <div className="space-y-6">
                  {/* Preset Positions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quick Positions
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {presetPositions.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => updateCustomization('position', { x: preset.x, y: preset.y })}
                          className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position X */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horizontal Position: {(customizations.position.x * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={customizations.position.x}
                      onChange={(e) => updatePosition('x', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Position Y */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vertical Position: {(customizations.position.y * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={customizations.position.y}
                      onChange={(e) => updatePosition('y', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Scale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scale: {(customizations.scale * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={customizations.scale}
                      onChange={(e) => updateCustomization('scale', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {customizations.rotation}°
                    </label>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={customizations.rotation}
                      onChange={(e) => updateCustomization('rotation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="space-y-6">
                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opacity: {(customizations.opacity * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={customizations.opacity}
                      onChange={(e) => updateCustomization('opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Tint Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tint Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customizations.tint || '#000000'}
                        onChange={(e) => updateCustomization('tint', e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={customizations.tint || ''}
                        onChange={(e) => updateCustomization('tint', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => updateCustomization('tint', '')}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Grayscale */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customizations.grayscale}
                        onChange={(e) => updateCustomization('grayscale', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Convert to Grayscale
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  {/* Blend Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blend Mode
                    </label>
                    <select
                      value={customizations.blendMode}
                      onChange={(e) => updateCustomization('blendMode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {blendModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Button */}
                  <div>
                    <button
                      onClick={() => setCustomizations({
                        position: { x: 0.5, y: 0.5 },
                        scale: 0.3,
                        rotation: 0,
                        opacity: 1,
                        blendMode: 'over',
                        tint: '',
                        grayscale: false
                      })}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="min-w-[120px]"
          >
            {isGenerating ? 'Generating...' : 'Generate Mockup'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
